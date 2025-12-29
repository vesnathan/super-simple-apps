#!/usr/bin/env ts-node

/**
 * Super Simple Invoice Deployment Script
 *
 * Deploys all infrastructure via CloudFormation:
 * 1. Uses shared DynamoDB table (from shared-infra)
 * 2. Uses shared Cognito (from shared-infra)
 * 3. AppSync GraphQL API
 * 4. S3 + CloudFront (Frontend)
 * 5. Builds and uploads frontend
 */

import { config } from "dotenv";
import { readFileSync, existsSync, mkdirSync, writeFileSync } from "fs";
import * as path from "path";
import { join } from "path";
import { execSync } from "child_process";
import { Command } from "commander";
import * as crypto from "crypto";

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
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { STSClient, AssumeRoleCommand } from "@aws-sdk/client-sts";

import { logger, setLogFile, closeLogFile, configureAwsCredentials, ResolverCompiler } from "@super-simple-apps/deploy";
import { OutputsManager } from "./outputs-manager";

// Load environment variables
config({ path: path.resolve(__dirname, "../../../.env") });

// Parse command line arguments
const program = new Command();
program
  .option("--stage <stage>", "Deployment stage", "prod")
  .option("--debug", "Enable debug mode")
  .option("--remove", "Remove the stack")
  .parse(process.argv);

const options = program.opts();
const STAGE = options.stage || "prod";
const REGION = process.env.AWS_REGION || "ap-southeast-2";
const APP_NAME = "super-simple-apps-invoice";
const TEMPLATE_BUCKET = "ssa-deploy-templates";
const CFN_ROLE_ARN = `arn:aws:iam::${process.env.AWS_ACCOUNT_ID || "430118819356"}:role/ssa-cloudformation-role`;
const DEBUG_MODE = options.debug || false;

// Domain configuration
const ROOT_DOMAIN = "super-simple-apps.com";
const INVOICE_SUBDOMAIN = `invoice.${ROOT_DOMAIN}`;
const DOMAIN_NAME = STAGE === "prod" ? INVOICE_SUBDOMAIN : "";
const HOSTED_ZONE_ID = process.env.HOSTED_ZONE_ID || "";

// AWS Clients
const cfnClient = new CloudFormationClient({ region: REGION });
const cfClient = new CloudFrontClient({ region: REGION });
const s3Client = new S3Client({ region: REGION });

// Outputs manager
const outputsManager = new OutputsManager(REGION);

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function setupLogging() {
  const logDir = join(__dirname, "../../../.cache/deploy/logs");
  if (!existsSync(logDir)) {
    mkdirSync(logDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/:/g, "-").split(".")[0];
  const logFile = join(logDir, `invoice-${STAGE}-${timestamp}.log`);
  setLogFile(logFile);
  logger.info(`Logging to: ${logFile}`);
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

async function waitForStackComplete(stackName: string, operation: "CREATE" | "UPDATE") {
  const successStatus = operation === "CREATE" ? "CREATE_COMPLETE" : "UPDATE_COMPLETE";
  const failureStatuses = [
    `${operation}_FAILED`,
    "ROLLBACK_COMPLETE",
    "ROLLBACK_FAILED",
    `${operation}_ROLLBACK_COMPLETE`,
  ];

  const stopSpinner = logger.infoWithSpinner(`Waiting for stack ${operation.toLowerCase()}...`);

  const maxAttempts = 120;
  for (let i = 0; i < maxAttempts; i++) {
    const response = await cfnClient.send(
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
      const events = await cfnClient.send(
        new DescribeStackEventsCommand({ StackName: stackName })
      );
      const failedEvent = events.StackEvents?.find((e) =>
        e.ResourceStatus?.includes("FAILED")
      );
      throw new Error(
        `Stack ${operation.toLowerCase()} failed: ${failedEvent?.ResourceStatusReason || status}`
      );
    }

    await new Promise((resolve) => setTimeout(resolve, 5000));
  }

  stopSpinner();
  throw new Error(`Timeout waiting for stack ${operation.toLowerCase()}`);
}

async function deployStack(
  stackName: string,
  templatePath: string,
  parameters: Record<string, string>,
  capabilities: string[] = []
): Promise<Record<string, string>> {
  const templateBody = readFileSync(templatePath, "utf-8");
  const cfnParameters = Object.entries(parameters).map(([key, value]) => ({
    ParameterKey: key,
    ParameterValue: value,
  }));

  try {
    let stackExists = false;
    let stackStatus: string | undefined;

    try {
      const response = await cfnClient.send(new DescribeStacksCommand({ StackName: stackName }));
      stackExists = true;
      stackStatus = response.Stacks?.[0]?.StackStatus;
    } catch (error: unknown) {
      if (!(error instanceof Error) || !error.message?.includes("does not exist")) {
        throw error;
      }
    }

    // Failed stack states that need to be deleted before recreating
    const failedStates = [
      "CREATE_FAILED",
      "ROLLBACK_COMPLETE",
      "ROLLBACK_FAILED",
      "DELETE_FAILED",
      "UPDATE_ROLLBACK_COMPLETE",
      "UPDATE_ROLLBACK_FAILED",
    ];

    if (stackExists && stackStatus && failedStates.includes(stackStatus)) {
      logger.warning(`Stack ${stackName} is in ${stackStatus} state - deleting before recreation...`);
      await cfnClient.send(new DeleteStackCommand({ StackName: stackName }));
      await waitForStackDeletion(stackName);
      stackExists = false;
    }

    if (stackExists) {
      logger.info(`Updating existing stack: ${stackName}`);
      try {
        await cfnClient.send(
          new UpdateStackCommand({
            StackName: stackName,
            TemplateBody: templateBody,
            Parameters: cfnParameters,
            Capabilities: capabilities as ("CAPABILITY_IAM" | "CAPABILITY_NAMED_IAM" | "CAPABILITY_AUTO_EXPAND")[],
            RoleARN: CFN_ROLE_ARN,
          })
        );
        await waitForStackComplete(stackName, "UPDATE");
      } catch (error: unknown) {
        if (error instanceof Error && error.message?.includes("No updates are to be performed")) {
          logger.info("Stack is already up to date");
        } else {
          throw error;
        }
      }
    } else {
      logger.info(`Creating new stack: ${stackName}`);
      await cfnClient.send(
        new CreateStackCommand({
          StackName: stackName,
          TemplateBody: templateBody,
          Parameters: cfnParameters,
          Capabilities: capabilities as ("CAPABILITY_IAM" | "CAPABILITY_NAMED_IAM" | "CAPABILITY_AUTO_EXPAND")[],
          RoleARN: CFN_ROLE_ARN,
        })
      );
      await waitForStackComplete(stackName, "CREATE");
    }

    return await outputsManager.saveStackOutputs(stackName, STAGE);
  } catch (error) {
    logger.error(`Stack deployment failed: ${getErrorMessage(error)}`);
    throw error;
  }
}

async function waitForStackDeletion(stackName: string): Promise<void> {
  const stopSpinner = logger.infoWithSpinner(`Waiting for stack deletion...`);
  const maxAttempts = 60;

  for (let i = 0; i < maxAttempts; i++) {
    try {
      const response = await cfnClient.send(
        new DescribeStacksCommand({ StackName: stackName })
      );
      const status = response.Stacks?.[0]?.StackStatus;

      if (status === "DELETE_COMPLETE") {
        stopSpinner();
        logger.success("Stack deleted successfully");
        return;
      }

      if (status === "DELETE_FAILED") {
        stopSpinner();
        throw new Error(`Stack deletion failed`);
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.message?.includes("does not exist")) {
        stopSpinner();
        logger.success("Stack deleted successfully");
        return;
      }
      throw error;
    }

    await new Promise((resolve) => setTimeout(resolve, 5000));
  }

  stopSpinner();
  throw new Error("Timeout waiting for stack deletion");
}

// ============================================================================
// GET SHARED INFRASTRUCTURE OUTPUTS
// ============================================================================

async function getSharedInfraOutputs(): Promise<{
  cognitoOutputs: Record<string, string>;
  dynamoOutputs: Record<string, string>;
  certificateArn: string;
}> {
  logger.info("Getting shared infrastructure outputs...");

  // Get Cognito outputs
  const cognitoStackName = `super-simple-apps-cognito-${STAGE}`;
  const cognitoResponse = await cfnClient.send(
    new DescribeStacksCommand({ StackName: cognitoStackName })
  );
  const cognitoOutputs: Record<string, string> = {};
  cognitoResponse.Stacks?.[0]?.Outputs?.forEach((output) => {
    if (output.OutputKey && output.OutputValue) {
      cognitoOutputs[output.OutputKey] = output.OutputValue;
    }
  });
  logger.success(`   Cognito User Pool: ${cognitoOutputs.UserPoolId}`);

  // Get DynamoDB outputs
  const dynamoStackName = `super-simple-apps-business-db-${STAGE}`;
  const dynamoResponse = await cfnClient.send(
    new DescribeStacksCommand({ StackName: dynamoStackName })
  );
  const dynamoOutputs: Record<string, string> = {};
  dynamoResponse.Stacks?.[0]?.Outputs?.forEach((output) => {
    if (output.OutputKey && output.OutputValue) {
      dynamoOutputs[output.OutputKey] = output.OutputValue;
    }
  });
  // Map TableName to BusinessDataTableName for compatibility
  dynamoOutputs.BusinessDataTableName = dynamoOutputs.TableName;
  logger.success(`   DynamoDB Table: ${dynamoOutputs.BusinessDataTableName}`);

  // Get certificate from us-east-1
  let certificateArn = "";
  if (STAGE === "prod") {
    const cfnUsEast1 = new CloudFormationClient({ region: "us-east-1" });
    try {
      const certResponse = await cfnUsEast1.send(
        new DescribeStacksCommand({ StackName: "super-simple-apps-dns-certificate" })
      );
      certificateArn = certResponse.Stacks?.[0]?.Outputs?.find(
        (o) => o.OutputKey === "WildcardCertificateArn"
      )?.OutputValue || "";
      if (certificateArn) {
        logger.success(`   Certificate: ${certificateArn.substring(0, 50)}...`);
      }
    } catch {
      logger.warning("   Shared certificate not found");
    }
  }

  return { cognitoOutputs, dynamoOutputs, certificateArn };
}

// ============================================================================
// GRAPHQL SCHEMA & RESOLVERS
// ============================================================================

async function buildGraphQLSchema(): Promise<void> {
  logger.info("Building GraphQL schema...");
  const backendPath = join(__dirname, "../backend");
  const schemaDir = join(backendPath, "schema");

  // Merge all .graphql files into combined schema
  const glob = require("glob");
  const schemaFiles: string[] = glob.sync("*.graphql", { cwd: schemaDir, absolute: true });

  if (schemaFiles.length === 0) {
    throw new Error(`No GraphQL schema files found in ${schemaDir}`);
  }

  schemaFiles.sort(); // Ensure consistent order (00-schema.graphql first)

  let combinedSchema = "";
  for (const file of schemaFiles) {
    combinedSchema += readFileSync(file, "utf8") + "\n\n";
  }

  const combinedPath = join(backendPath, "combined_schema.graphql");
  writeFileSync(combinedPath, combinedSchema);

  logger.success(`GraphQL schema built (${schemaFiles.length} files merged)`);
}

async function uploadSchema(): Promise<string> {
  const schemaPath = join(__dirname, "../backend/combined_schema.graphql");

  if (!existsSync(schemaPath)) {
    throw new Error(`Combined schema not found at ${schemaPath}`);
  }

  const schemaContent = readFileSync(schemaPath, "utf8");
  const schemaHash = crypto
    .createHash("sha256")
    .update(schemaContent)
    .digest("hex")
    .substring(0, 16);

  const schemaKey = `invoice/schema-${schemaHash}.graphql`;
  logger.info(`Uploading schema (hash: ${schemaHash})...`);

  await s3Client.send(
    new PutObjectCommand({
      Bucket: TEMPLATE_BUCKET,
      Key: schemaKey,
      Body: schemaContent,
      ContentType: "text/plain",
    })
  );

  logger.success(`Schema uploaded: s3://${TEMPLATE_BUCKET}/${schemaKey}`);
  return schemaHash;
}

async function compileAndUploadResolvers(): Promise<string> {
  const resolverDir = join(__dirname, "../backend/resolvers");

  if (!existsSync(resolverDir)) {
    throw new Error(`Resolver directory not found at ${resolverDir}`);
  }

  const glob = require("glob");
  const resolverFiles: string[] = glob.sync("**/*.ts", {
    cwd: resolverDir,
    absolute: false,
  });

  if (resolverFiles.length === 0) {
    throw new Error(`No TypeScript resolver files found in ${resolverDir}`);
  }

  logger.info(`Found ${resolverFiles.length} resolver files to compile`);

  const resolverCompiler = new ResolverCompiler({
    logger: logger,
    baseResolverDir: resolverDir,
    s3KeyPrefix: "invoice/resolvers",
    stage: STAGE,
    s3BucketName: TEMPLATE_BUCKET,
    region: REGION,
    resolverFiles: resolverFiles,
    projectRoot: join(__dirname, ".."),
  });

  const buildHash = await resolverCompiler.compileAndUploadResolvers();
  logger.success(`Resolvers compiled and uploaded (hash: ${buildHash})`);
  return buildHash;
}

// ============================================================================
// APPSYNC DEPLOYMENT
// ============================================================================

async function deployAppSync(
  dynamoOutputs: Record<string, string>,
  cognitoOutputs: Record<string, string>,
  schemaHash: string,
  resolversBuildHash: string
): Promise<Record<string, string>> {
  logger.info("Deploying AppSync GraphQL API...");
  const stackName = `${APP_NAME}-appsync-${STAGE}`;
  const templatePath = join(__dirname, "resources/AppSync/appsync.yaml");

  if (!existsSync(templatePath)) {
    throw new Error(`AppSync template not found at ${templatePath}`);
  }

  const outputs = await deployStack(stackName, templatePath, {
    Stage: STAGE,
    AppName: "invoice",
    DataTableName: dynamoOutputs.BusinessDataTableName,
    TemplateBucketName: TEMPLATE_BUCKET,
    ResolversBuildHash: resolversBuildHash,
    SchemaHash: schemaHash,
    UserPoolId: cognitoOutputs.UserPoolId,
  }, ["CAPABILITY_NAMED_IAM"]);

  logger.success("AppSync deployed");
  logger.info(`   GraphQL URL: ${outputs.AppSyncApiUrl}`);
  logger.info(`   API ID: ${outputs.AppSyncApiId}`);
  return outputs;
}

// ============================================================================
// FRONTEND DEPLOYMENT
// ============================================================================

async function deployFrontend(
  certificateArn: string
): Promise<Record<string, string>> {
  logger.info("Deploying frontend infrastructure...");
  const stackName = `${APP_NAME}-frontend-${STAGE}`;
  const templatePath = join(__dirname, "resources/CloudFront/frontend.yaml");

  if (!existsSync(templatePath)) {
    throw new Error(`Frontend template not found at ${templatePath}`);
  }

  const deployUserArn = process.env.DEPLOY_USER_ARN || "";
  const domainName = STAGE === "prod" && certificateArn ? DOMAIN_NAME : "";
  const hostedZoneId = STAGE === "prod" && certificateArn ? HOSTED_ZONE_ID : "";

  const outputs = await deployStack(stackName, templatePath, {
    Stage: STAGE,
    AppName: APP_NAME,
    DeployUserArn: deployUserArn,
    DomainName: domainName,
    CertificateArn: certificateArn,
    HostedZoneId: hostedZoneId,
  }, ["CAPABILITY_NAMED_IAM"]);

  logger.success("Frontend infrastructure deployed");
  logger.info(`   S3 Bucket: ${outputs.WebsiteBucket}`);
  logger.info(`   CloudFront: ${outputs.CloudFrontDistributionId}`);
  logger.info(`   URL: ${outputs.WebsiteUrl}`);

  // Build and upload frontend
  await buildAndUploadFrontend(
    outputs.WebsiteBucket,
    outputs.CloudFrontDistributionId,
    outputs.DeployRoleArn
  );

  return outputs;
}

async function buildAndUploadFrontend(
  bucketName: string,
  distributionId: string,
  deployRoleArn?: string
): Promise<void> {
  const appPath = join(__dirname, "..");
  const outPath = join(appPath, "out");

  logger.info("Building frontend...");

  try {
    execSync(`yarn build`, {
      cwd: appPath,
      stdio: "inherit",
      env: { ...process.env, NEXT_PUBLIC_ENVIRONMENT: STAGE },
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

  // Assume deploy role if available
  let awsEnv: Record<string, string> = Object.fromEntries(
    Object.entries(process.env).filter((entry): entry is [string, string] => entry[1] !== undefined)
  );

  if (deployRoleArn) {
    logger.info(`Assuming deploy role: ${deployRoleArn}`);
    const stsClient = new STSClient({ region: REGION });
    const assumeRoleResponse = await stsClient.send(
      new AssumeRoleCommand({
        RoleArn: deployRoleArn,
        RoleSessionName: "invoice-frontend-deploy",
        ExternalId: `${APP_NAME}-${STAGE}`,
        DurationSeconds: 900,
      })
    );

    const credentials = assumeRoleResponse.Credentials;
    if (!credentials?.AccessKeyId || !credentials?.SecretAccessKey || !credentials?.SessionToken) {
      throw new Error("Failed to get credentials from deploy role");
    }

    awsEnv = {
      ...awsEnv,
      AWS_ACCESS_KEY_ID: credentials.AccessKeyId,
      AWS_SECRET_ACCESS_KEY: credentials.SecretAccessKey,
      AWS_SESSION_TOKEN: credentials.SessionToken,
    };
    logger.success("Assumed deploy role");
  }

  logger.info("Uploading to S3...");

  try {
    const awsCli = process.env.AWS_CLI_PATH || "aws";
    execSync(`${awsCli} s3 sync ${outPath} s3://${bucketName}/ --delete --region ${REGION}`, {
      stdio: "inherit",
      env: awsEnv,
    });
    logger.success("Upload complete");
  } catch (error) {
    logger.error("S3 upload failed");
    throw error;
  }

  // Invalidate CloudFront
  logger.info("Creating CloudFront invalidation...");

  try {
    const cfClientForInvalidation = deployRoleArn
      ? new CloudFrontClient({
          region: REGION,
          credentials: {
            accessKeyId: awsEnv.AWS_ACCESS_KEY_ID,
            secretAccessKey: awsEnv.AWS_SECRET_ACCESS_KEY,
            sessionToken: awsEnv.AWS_SESSION_TOKEN,
          },
        })
      : cfClient;

    const invalidation = await cfClientForInvalidation.send(
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

    const stopSpinner = logger.infoWithSpinner("Waiting for CloudFront invalidation...");
    await waitForInvalidation(cfClientForInvalidation, distributionId, invalidationId!);
    stopSpinner();
    logger.success("CloudFront invalidation complete");
  } catch (error) {
    logger.warning(`CloudFront invalidation failed: ${getErrorMessage(error)}`);
  }
}

async function waitForInvalidation(
  client: CloudFrontClient,
  distributionId: string,
  invalidationId: string
): Promise<void> {
  const maxAttempts = 60;

  for (let i = 0; i < maxAttempts; i++) {
    const response = await client.send(
      new GetInvalidationCommand({
        DistributionId: distributionId,
        Id: invalidationId,
      })
    );

    if (response.Invalidation?.Status === "Completed") {
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 5000));
  }

  logger.warning("Invalidation still in progress (continuing anyway)");
}

// ============================================================================
// MAIN DEPLOYMENT
// ============================================================================

async function deploy(): Promise<void> {
  setupLogging();

  logger.info("Starting Super Simple Invoice deployment");
  logger.info(`   Stage: ${STAGE}`);
  logger.info(`   Region: ${REGION}`);
  if (DOMAIN_NAME) {
    logger.info(`   Domain: ${DOMAIN_NAME}`);
  }

  try {
    // Validate AWS credentials
    await configureAwsCredentials();

    // 1. Get shared infrastructure outputs
    const { cognitoOutputs, dynamoOutputs, certificateArn } = await getSharedInfraOutputs();

    // 2. Build GraphQL schema
    await buildGraphQLSchema();

    // 3. Upload schema to S3
    const schemaHash = await uploadSchema();

    // 4. Compile and upload resolvers
    const resolversBuildHash = await compileAndUploadResolvers();

    // 5. Deploy AppSync
    const appSyncOutputs = await deployAppSync(dynamoOutputs, cognitoOutputs, schemaHash, resolversBuildHash);

    // 6. Deploy Frontend
    const frontendOutputs = await deployFrontend(certificateArn);

    // Save all outputs
    const allOutputs = {
      ...cognitoOutputs,
      ...dynamoOutputs,
      ...appSyncOutputs,
      ...frontendOutputs,
    };

    const outputsPath = join(__dirname, "deployment-outputs.json");
    writeFileSync(outputsPath, JSON.stringify(allOutputs, null, 2));

    // Print summary
    logger.success("\nDeployment complete!\n");
    logger.info("Key outputs:");
    logger.info(`   Website URL: ${frontendOutputs.WebsiteUrl}`);
    logger.info(`   GraphQL URL: ${appSyncOutputs.AppSyncApiUrl}`);
    logger.info(`   User Pool: ${cognitoOutputs.UserPoolId}`);

    closeLogFile();
    process.exit(0);
  } catch (error) {
    logger.error(`\nDeployment failed: ${getErrorMessage(error)}`);
    closeLogFile();
    process.exit(1);
  }
}

async function remove(): Promise<void> {
  setupLogging();

  logger.info("Removing Super Simple Invoice stacks");
  logger.info(`   Stage: ${STAGE}`);

  try {
    await configureAwsCredentials();

    // Delete stacks in reverse order
    const stacks = [
      `${APP_NAME}-frontend-${STAGE}`,
      `${APP_NAME}-appsync-${STAGE}`,
    ];

    for (const stackName of stacks) {
      try {
        await cfnClient.send(new DescribeStacksCommand({ StackName: stackName }));
        logger.info(`Deleting stack: ${stackName}`);
        await cfnClient.send(new DeleteStackCommand({ StackName: stackName }));
        await waitForStackDeletion(stackName);
      } catch (error: unknown) {
        if (error instanceof Error && error.message?.includes("does not exist")) {
          logger.info(`Stack ${stackName} does not exist`);
        } else {
          throw error;
        }
      }
    }

    logger.success("\nRemoval complete!");
    closeLogFile();
    process.exit(0);
  } catch (error) {
    logger.error(`\nRemoval failed: ${getErrorMessage(error)}`);
    closeLogFile();
    process.exit(1);
  }
}

// Run
if (options.remove) {
  remove();
} else {
  deploy();
}
