/**
 * Shared Static App Deployer
 *
 * Provides common deployment logic for static sites (landing, image-crop, image-resize, etc.)
 * Uses the shared wildcard certificate from super-simple-apps-dns-certificate stack.
 */

import { config } from "dotenv";
import { readFileSync, existsSync, rmSync, mkdirSync, writeFileSync } from "fs";
import * as path from "path";
import { join } from "path";
import { execSync } from "child_process";

import {
  CloudFormationClient,
  CreateStackCommand,
  UpdateStackCommand,
  DeleteStackCommand,
  DescribeStacksCommand,
  DescribeStackEventsCommand,
} from "@aws-sdk/client-cloudformation";
import {
  CloudFrontClient,
  CreateInvalidationCommand,
  GetInvalidationCommand,
} from "@aws-sdk/client-cloudfront";
import {
  STSClient,
  AssumeRoleCommand,
} from "@aws-sdk/client-sts";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";

import { logger } from "@super-simple-apps/deploy";

// Load root .env
config({ path: path.resolve(__dirname, "../.env") });

const ROOT_DOMAIN = "super-simple-apps.com";
const HOSTED_ZONE_ID = process.env.HOSTED_ZONE_ID || "";
const CFN_ROLE_ARN = `arn:aws:iam::${process.env.AWS_ACCOUNT_ID || "430118819356"}:role/ssa-cloudformation-role`;
const DEPLOY_USER_ARN = process.env.DEPLOY_USER_ARN || "";

export interface StaticAppConfig {
  appName: string;
  subdomain: string; // e.g., "crop", "resize", "annotate", "" for root
  appDir: string; // Absolute path to app directory
  stage: string;
  region?: string;
}

export interface DeployResult {
  outputs: Record<string, string>;
  websiteUrl: string;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

interface AssumedCredentials {
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken: string;
}

/**
 * Assume the deploy role for a specific app to get scoped credentials
 */
async function assumeDeployRole(
  roleArn: string,
  externalId: string,
  region: string
): Promise<AssumedCredentials> {
  const stsClient = new STSClient({ region });

  logger.info(`Assuming deploy role: ${roleArn}`);

  const response = await stsClient.send(
    new AssumeRoleCommand({
      RoleArn: roleArn,
      RoleSessionName: "static-app-deploy",
      ExternalId: externalId,
      DurationSeconds: 3600, // 1 hour
    })
  );

  if (!response.Credentials) {
    throw new Error("Failed to assume deploy role - no credentials returned");
  }

  logger.success("Assumed deploy role successfully");

  return {
    accessKeyId: response.Credentials.AccessKeyId!,
    secretAccessKey: response.Credentials.SecretAccessKey!,
    sessionToken: response.Credentials.SessionToken!,
  };
}

async function getStackOutputs(
  client: CloudFormationClient,
  stackName: string
): Promise<Record<string, string> | null> {
  try {
    const response = await client.send(
      new DescribeStacksCommand({ StackName: stackName })
    );
    const stack = response.Stacks?.[0];
    if (!stack) return null;

    const outputs: Record<string, string> = {};
    stack.Outputs?.forEach((output) => {
      if (output.OutputKey && output.OutputValue) {
        outputs[output.OutputKey] = output.OutputValue;
      }
    });
    return outputs;
  } catch (error: unknown) {
    if (error instanceof Error && error.message?.includes("does not exist")) {
      return null;
    }
    throw error;
  }
}

async function waitForStackComplete(
  client: CloudFormationClient,
  stackName: string,
  operation: "CREATE" | "UPDATE" | "DELETE"
): Promise<void> {
  const successStatus = operation === "DELETE" ? "DELETE_COMPLETE" : `${operation}_COMPLETE`;
  const failureStatuses = [
    `${operation}_FAILED`,
    "ROLLBACK_COMPLETE",
    "ROLLBACK_FAILED",
    `${operation}_ROLLBACK_COMPLETE`,
  ];

  const stopSpinner = logger.infoWithSpinner(`Waiting for stack ${operation.toLowerCase()}...`);

  const maxAttempts = 120;
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const response = await client.send(
        new DescribeStacksCommand({ StackName: stackName })
      );
      const status = response.Stacks?.[0]?.StackStatus;

      if (status === successStatus) {
        stopSpinner();
        logger.success(`Stack ${operation.toLowerCase()} complete`);
        return;
      }

      if (failureStatuses.some((s) => status?.includes(s))) {
        stopSpinner();
        const events = await client.send(
          new DescribeStackEventsCommand({ StackName: stackName })
        );
        const failedEvent = events.StackEvents?.find((e) =>
          e.ResourceStatus?.includes("FAILED")
        );
        throw new Error(
          `Stack ${operation.toLowerCase()} failed: ${failedEvent?.ResourceStatusReason || status}`
        );
      }
    } catch (error: unknown) {
      // For DELETE, stack not found means success
      if (operation === "DELETE" && error instanceof Error && error.message?.includes("does not exist")) {
        stopSpinner();
        logger.success("Stack deleted");
        return;
      }
      throw error;
    }

    await new Promise((resolve) => setTimeout(resolve, 5000));
  }

  stopSpinner();
  throw new Error(`Timeout waiting for stack ${operation.toLowerCase()}`);
}

async function deployStack(
  client: CloudFormationClient,
  stackName: string,
  templatePath: string,
  parameters: Record<string, string>
): Promise<Record<string, string>> {
  const templateBody = readFileSync(templatePath, "utf8");

  const params = Object.entries(parameters).map(([key, value]) => ({
    ParameterKey: key,
    ParameterValue: value,
  }));

  // Check if stack exists
  let stackExists = false;
  try {
    await client.send(new DescribeStacksCommand({ StackName: stackName }));
    stackExists = true;
  } catch (error: unknown) {
    if (!(error instanceof Error && error.message?.includes("does not exist"))) {
      throw error;
    }
  }

  if (stackExists) {
    logger.info(`Updating stack: ${stackName}`);
    try {
      await client.send(
        new UpdateStackCommand({
          StackName: stackName,
          TemplateBody: templateBody,
          Parameters: params,
          Capabilities: ["CAPABILITY_IAM", "CAPABILITY_NAMED_IAM"],
          RoleARN: CFN_ROLE_ARN,
        })
      );
      await waitForStackComplete(client, stackName, "UPDATE");
    } catch (error: unknown) {
      if (error instanceof Error && error.message?.includes("No updates are to be performed")) {
        logger.info("No updates needed for stack");
      } else {
        throw error;
      }
    }
  } else {
    logger.info(`Creating stack: ${stackName}`);
    await client.send(
      new CreateStackCommand({
        StackName: stackName,
        TemplateBody: templateBody,
        Parameters: params,
        Capabilities: ["CAPABILITY_IAM", "CAPABILITY_NAMED_IAM"],
        RoleARN: CFN_ROLE_ARN,
      })
    );
    await waitForStackComplete(client, stackName, "CREATE");
  }

  // Get outputs
  const response = await client.send(
    new DescribeStacksCommand({ StackName: stackName })
  );

  const outputs: Record<string, string> = {};
  response.Stacks?.[0]?.Outputs?.forEach((output) => {
    if (output.OutputKey && output.OutputValue) {
      outputs[output.OutputKey] = output.OutputValue;
    }
  });

  return outputs;
}

/**
 * Get the shared wildcard certificate ARN from super-simple-apps-dns-certificate stack
 */
export async function getSharedCertificateArn(): Promise<string> {
  const cfnUsEast1 = new CloudFormationClient({ region: "us-east-1" });

  try {
    const response = await cfnUsEast1.send(
      new DescribeStacksCommand({ StackName: "super-simple-apps-dns-certificate" })
    );
    const certArn = response.Stacks?.[0]?.Outputs?.find(
      (o) => o.OutputKey === "WildcardCertificateArn"
    )?.OutputValue || "";

    if (certArn) {
      logger.success(`Using shared wildcard certificate`);
      return certArn;
    }
  } catch {
    logger.warning("Shared certificate stack not found");
  }

  return "";
}

/**
 * Deploy a static app using the shared certificate (single stack deployment)
 */
export async function deployStaticApp(config: StaticAppConfig): Promise<DeployResult> {
  const region = config.region || process.env.AWS_REGION || "ap-southeast-2";
  const cfnClient = new CloudFormationClient({ region });
  const cfClient = new CloudFrontClient({ region });

  const domainName = config.stage === "prod"
    ? (config.subdomain ? `${config.subdomain}.${ROOT_DOMAIN}` : ROOT_DOMAIN)
    : "";

  logger.info("=".repeat(60));
  logger.info(`Deploying ${config.appName}`);
  logger.info(`Stage: ${config.stage}`);
  logger.info(`Region: ${region}`);
  if (domainName) {
    logger.info(`Domain: ${domainName}`);
  }
  logger.info("=".repeat(60));

  // Get shared certificate
  let certificateArn = "";
  if (domainName && HOSTED_ZONE_ID) {
    certificateArn = await getSharedCertificateArn();
    if (!certificateArn) {
      logger.warning("No shared certificate found - deploying without custom domain");
    }
  }

  // Deploy frontend stack (includes DNS record if certificate provided)
  logger.info("\n--- Deploying Infrastructure ---");
  const stackName = `${config.appName}-${config.stage}`;
  const templatePath = join(config.appDir, "deploy/resources/CloudFront/frontend.yaml");

  if (!existsSync(templatePath)) {
    throw new Error(`Frontend template not found at ${templatePath}`);
  }

  const parameters: Record<string, string> = {
    Stage: config.stage,
    AppName: config.appName,
  };

  if (domainName && certificateArn) {
    parameters.DomainName = domainName;
    parameters.CertificateArn = certificateArn;
    if (HOSTED_ZONE_ID) {
      parameters.HostedZoneId = HOSTED_ZONE_ID;
    }
  }

  // Pass deploy user ARN so CloudFormation can create the deploy role
  if (DEPLOY_USER_ARN) {
    parameters.DeployUserArn = DEPLOY_USER_ARN;
  }

  const outputs = await deployStack(cfnClient, stackName, templatePath, parameters);

  logger.success("Infrastructure deployed");
  logger.info(`   S3 Bucket: ${outputs.WebsiteBucket}`);
  logger.info(`   CloudFront: ${outputs.CloudFrontDistributionId}`);
  logger.info(`   Deploy Role: ${outputs.DeployRoleArn}`);
  logger.info(`   URL: ${outputs.WebsiteUrl}`);

  // Save outputs
  const outputsPath = join(config.appDir, "deploy/deployment-outputs.json");
  writeFileSync(outputsPath, JSON.stringify(outputs, null, 2));

  // Assume the deploy role for S3/CloudFront operations
  const deployRoleArn = outputs.DeployRoleArn;
  if (!deployRoleArn) {
    throw new Error("DeployRoleArn not found in stack outputs - template may need updating");
  }

  const credentials = await assumeDeployRole(
    deployRoleArn,
    `${config.appName}-${config.stage}`, // External ID must match
    region
  );

  // Create clients with assumed role credentials
  const s3Client = new S3Client({
    region,
    credentials: {
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey,
      sessionToken: credentials.sessionToken,
    },
  });

  const cfClientWithRole = new CloudFrontClient({
    region,
    credentials: {
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey,
      sessionToken: credentials.sessionToken,
    },
  });

  // Build and upload frontend using assumed role
  await buildAndUploadFrontendWithRole(
    config.appDir,
    outputs.WebsiteBucket,
    outputs.CloudFrontDistributionId,
    config.stage,
    s3Client,
    cfClientWithRole
  );

  return {
    outputs,
    websiteUrl: outputs.WebsiteUrl,
  };
}

/**
 * Get content type based on file extension
 */
function getContentType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  const contentTypes: Record<string, string> = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "application/javascript",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".ttf": "font/ttf",
    ".eot": "application/vnd.ms-fontobject",
    ".txt": "text/plain",
    ".xml": "application/xml",
    ".webp": "image/webp",
    ".mp4": "video/mp4",
    ".webm": "video/webm",
    ".pdf": "application/pdf",
  };
  return contentTypes[ext] || "application/octet-stream";
}

/**
 * Recursively get all files in a directory
 */
function getAllFiles(dir: string, baseDir: string = dir): string[] {
  const files: string[] = [];
  const entries = require("fs").readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getAllFiles(fullPath, baseDir));
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Build frontend and upload to S3 using assumed role credentials
 */
async function buildAndUploadFrontendWithRole(
  appDir: string,
  bucketName: string,
  distributionId: string,
  stage: string,
  s3Client: S3Client,
  cfClient: CloudFrontClient
): Promise<void> {
  const outPath = join(appDir, "out");

  logger.info("Building frontend...");

  try {
    execSync(`yarn build`, {
      cwd: appDir,
      stdio: "inherit",
      env: { ...process.env, NEXT_PUBLIC_ENVIRONMENT: stage },
    });
    logger.success("Frontend build complete");
  } catch (error) {
    logger.error("Frontend build failed");
    throw error;
  }

  if (!existsSync(outPath)) {
    logger.warning("No 'out' directory found - is 'output: export' configured in next.config.js?");
    return;
  }

  logger.info("Uploading to S3 using assumed role...");

  // Get all files to upload
  const files = getAllFiles(outPath);
  logger.info(`   Found ${files.length} files to upload`);

  // Upload all files
  let uploaded = 0;
  for (const filePath of files) {
    const key = path.relative(outPath, filePath).replace(/\\/g, "/");
    const content = readFileSync(filePath);
    const contentType = getContentType(filePath);

    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: content,
        ContentType: contentType,
      })
    );

    uploaded++;
    if (uploaded % 50 === 0) {
      logger.info(`   Uploaded ${uploaded}/${files.length} files...`);
    }
  }

  logger.success(`Upload complete (${uploaded} files)`);

  // Delete old files that are no longer in the build
  logger.info("Cleaning up old files...");
  const uploadedKeys = new Set(files.map((f) => path.relative(outPath, f).replace(/\\/g, "/")));

  let continuationToken: string | undefined;
  let deletedCount = 0;

  do {
    const listResponse = await s3Client.send(
      new ListObjectsV2Command({
        Bucket: bucketName,
        ContinuationToken: continuationToken,
      })
    );

    for (const obj of listResponse.Contents || []) {
      if (obj.Key && !uploadedKeys.has(obj.Key)) {
        await s3Client.send(
          new DeleteObjectCommand({
            Bucket: bucketName,
            Key: obj.Key,
          })
        );
        deletedCount++;
      }
    }

    continuationToken = listResponse.NextContinuationToken;
  } while (continuationToken);

  if (deletedCount > 0) {
    logger.info(`   Deleted ${deletedCount} old files`);
  }

  // Invalidate CloudFront
  if (distributionId) {
    await invalidateCloudFront(cfClient, distributionId);
  }
}

/**
 * Build frontend and upload to S3 (legacy - uses AWS CLI)
 */
export async function buildAndUploadFrontend(
  appDir: string,
  bucketName: string,
  distributionId: string,
  stage: string,
  region: string,
  cfClient?: CloudFrontClient
): Promise<void> {
  const outPath = join(appDir, "out");

  logger.info("Building frontend...");

  try {
    execSync(`yarn build`, {
      cwd: appDir,
      stdio: "inherit",
      env: { ...process.env, NEXT_PUBLIC_ENVIRONMENT: stage },
    });
    logger.success("Frontend build complete");
  } catch (error) {
    logger.error("Frontend build failed");
    throw error;
  }

  if (!existsSync(outPath)) {
    logger.warning("No 'out' directory found - is 'output: export' configured in next.config.js?");
    return;
  }

  logger.info("Uploading to S3...");

  try {
    const awsCli = process.env.AWS_CLI_PATH || "aws";
    execSync(`${awsCli} s3 sync ${outPath} s3://${bucketName}/ --delete --region ${region}`, {
      stdio: "inherit",
    });
    logger.success("Upload complete");
  } catch (error) {
    logger.error("S3 upload failed");
    throw error;
  }

  // Invalidate CloudFront
  if (cfClient && distributionId) {
    await invalidateCloudFront(cfClient, distributionId);
  }
}

/**
 * Invalidate CloudFront distribution
 */
export async function invalidateCloudFront(
  cfClient: CloudFrontClient,
  distributionId: string
): Promise<void> {
  logger.info("Creating CloudFront invalidation...");

  try {
    const invalidation = await cfClient.send(
      new CreateInvalidationCommand({
        DistributionId: distributionId,
        InvalidationBatch: {
          CallerReference: Date.now().toString(),
          Paths: { Quantity: 1, Items: ["/*"] },
        },
      })
    );

    const invalidationId = invalidation.Invalidation?.Id;
    logger.info(`   Invalidation ID: ${invalidationId}`);

    // Wait for invalidation
    const stopSpinner = logger.infoWithSpinner("Waiting for CloudFront invalidation...");

    const maxAttempts = 60;
    for (let i = 0; i < maxAttempts; i++) {
      const response = await cfClient.send(
        new GetInvalidationCommand({
          DistributionId: distributionId,
          Id: invalidationId!,
        })
      );

      if (response.Invalidation?.Status === "Completed") {
        stopSpinner();
        logger.success("CloudFront invalidation complete");
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 5000));
    }

    stopSpinner();
    logger.warning("Invalidation still in progress (continuing anyway)");
  } catch (error) {
    logger.warning(`CloudFront invalidation failed: ${getErrorMessage(error)}`);
  }
}

/**
 * Delete a static app stack
 */
export async function deleteStaticApp(config: StaticAppConfig): Promise<void> {
  const region = config.region || process.env.AWS_REGION || "ap-southeast-2";
  const cfnClient = new CloudFormationClient({ region });

  const stackName = `${config.appName}-${config.stage}`;

  logger.info(`Deleting stack: ${stackName}`);

  try {
    await cfnClient.send(new DeleteStackCommand({ StackName: stackName }));
    await waitForStackComplete(cfnClient, stackName, "DELETE");
    logger.success(`Stack ${stackName} deleted`);
  } catch (error: unknown) {
    if (error instanceof Error && error.message?.includes("does not exist")) {
      logger.info(`Stack ${stackName} does not exist`);
    } else {
      throw error;
    }
  }

  // Also try to delete the legacy DNS stack if it exists
  const dnsStackName = `${config.appName}-dns-${config.stage}`;
  const cfnUsEast1 = new CloudFormationClient({ region: "us-east-1" });

  try {
    await cfnUsEast1.send(new DescribeStacksCommand({ StackName: dnsStackName }));
    logger.info(`Deleting legacy DNS stack: ${dnsStackName}`);
    await cfnUsEast1.send(new DeleteStackCommand({ StackName: dnsStackName }));
    await waitForStackComplete(cfnUsEast1, dnsStackName, "DELETE");
    logger.success(`Legacy DNS stack deleted`);
  } catch (error: unknown) {
    // Stack doesn't exist - that's fine
    if (!(error instanceof Error && error.message?.includes("does not exist"))) {
      logger.warning(`Could not delete DNS stack: ${getErrorMessage(error)}`);
    }
  }
}

/**
 * Get deployment info for a static app
 */
export async function getStaticAppInfo(config: StaticAppConfig): Promise<Record<string, string> | null> {
  const region = config.region || process.env.AWS_REGION || "ap-southeast-2";
  const cfnClient = new CloudFormationClient({ region });
  const stackName = `${config.appName}-${config.stage}`;

  return getStackOutputs(cfnClient, stackName);
}
