#!/usr/bin/env ts-node

/**
 * Simple Flashcards Deployment Script
 *
 * Deploys all infrastructure via CloudFormation:
 * 1. Cognito (User Pool + Client + Identity Pool)
 * 2. DynamoDB Table
 * 3. AppSync GraphQL API
 * 4. S3 + CloudFront (Frontend)
 * 5. Builds and uploads frontend
 */

import { config } from "dotenv";
import { readFileSync, existsSync, rmSync, mkdirSync, createWriteStream } from "fs";
import * as path from "path";
import archiver from "archiver";

// Load environment variables BEFORE any AWS SDK imports
// First load root .env (AWS credentials), then app-specific .env (can override)
config({ path: path.resolve(__dirname, "../../../.env") });
config({ path: path.resolve(__dirname, "../.env") });
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
  Parameter,
} from "@aws-sdk/client-cloudformation";
import {
  CloudFrontClient,
  CreateInvalidationCommand,
  GetInvalidationCommand,
} from "@aws-sdk/client-cloudfront";
import {
  S3Client,
  PutObjectCommand,
  HeadBucketCommand,
} from "@aws-sdk/client-s3";
import { STSClient, AssumeRoleCommand } from "@aws-sdk/client-sts";

import { logger, setLogFile, closeLogFile, configureAwsCredentials, ResolverCompiler } from "@super-simple-apps/deploy";
import { OutputsManager } from "./outputs-manager";
import { seedDB } from "./utils/seed-db";

// Parse command line arguments
const program = new Command();
program
  .option("--stage <stage>", "Deployment stage", "dev")
  .option("--debug", "Enable debug mode")
  .option("--domain-name <domain>", "Custom domain name (e.g., super-simple-flashcards.com)")
  .option("--hosted-zone-id <zoneId>", "Route53 Hosted Zone ID for the domain")
  .parse(process.argv);

const options = program.opts();
const STAGE = options.stage || process.env.STAGE || "dev";
const REGION = process.env.AWS_REGION || "ap-southeast-2";
const APP_NAME = "super-simple-flashcards";
const TEMPLATE_BUCKET = "ssa-deploy-templates"; // Shared template bucket
const CFN_ROLE_ARN = `arn:aws:iam::${process.env.AWS_ACCOUNT_ID || "430118819356"}:role/ssa-cloudformation-role`;
const DEBUG_MODE = options.debug || false;

// Super Simple Apps shared infrastructure
const ROOT_DOMAIN = "super-simple-apps.com";
const FLASHCARDS_SUBDOMAIN = `flashcards.${ROOT_DOMAIN}`;
const DOMAIN_NAME = options.domainName || (STAGE === "prod" ? FLASHCARDS_SUBDOMAIN : "");
const HOSTED_ZONE_ID = options.hostedZoneId || process.env.HOSTED_ZONE_ID || "";

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
  // Use centralized log directory at monorepo root
  const logDir = join(__dirname, "../../../.cache/deploy/logs");
  if (existsSync(logDir)) {
    rmSync(logDir, { recursive: true, force: true });
  }
  mkdirSync(logDir, { recursive: true });

  const timestamp = new Date().toISOString().replace(/:/g, "-").split(".")[0];
  const logFile = join(logDir, `flashcards-${STAGE}-${timestamp}.log`);
  setLogFile(logFile);
  logger.info(`Logging to: ${logFile}`);
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

async function createZipFromDirectory(sourceDir: string, zipPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const output = createWriteStream(zipPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", () => {
      resolve();
    });

    archive.on("error", (err: Error) => {
      reject(err);
    });

    archive.pipe(output);
    archive.directory(sourceDir, false);
    archive.finalize();
  });
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
      // Stack doesn't exist means deletion complete
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

async function deleteFailedStack(stackName: string): Promise<void> {
  logger.warning(`Deleting failed stack: ${stackName}...`);
  await cfnClient.send(new DeleteStackCommand({ StackName: stackName }));
  await waitForStackDeletion(stackName);
}

async function deployStack(
  stackName: string,
  templatePath: string,
  parameters: Record<string, string>,
  capabilities: string[] = [],
  roleArn?: string
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
      await deleteFailedStack(stackName);
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
            RoleARN: roleArn,
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
          RoleARN: roleArn,
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

// ============================================================================
// DNS STACK DEPLOYMENT (us-east-1 for CloudFront certificates)
// ============================================================================

async function deployDNSStack(
  domainName: string,
  hostedZoneId: string,
  stage: string,
  cloudFrontDomainName?: string
): Promise<string> {
  const region = "us-east-1"; // ACM certs for CloudFront MUST be in us-east-1
  const cfn = new CloudFormationClient({ region });
  // Use shared template bucket (in ap-southeast-2, but accessible from any region)
  const s3 = new S3Client({ region: "ap-southeast-2" });
  const stackName = `${APP_NAME}-dns-${stage}`;

  logger.info(`Deploying DNS stack to us-east-1 for domain: ${domainName}`);

  // Upload DNS template to shared S3 bucket
  const dnsTemplatePath = join(__dirname, "resources/DNS/dns.yaml");
  const dnsTemplateContent = readFileSync(dnsTemplatePath, "utf8");
  const templateKey = `flashcards/${stage}/dns.yaml`;

  await s3.send(
    new PutObjectCommand({
      Bucket: TEMPLATE_BUCKET,
      Key: templateKey,
      Body: dnsTemplateContent,
      ContentType: "application/x-yaml",
    })
  );
  logger.debug("DNS template uploaded");

  // Prepare CloudFormation parameters
  const stackParams: Parameter[] = [
    { ParameterKey: "Stage", ParameterValue: stage },
    { ParameterKey: "DomainName", ParameterValue: domainName },
    { ParameterKey: "HostedZoneId", ParameterValue: hostedZoneId },
    { ParameterKey: "CloudFrontDomainName", ParameterValue: cloudFrontDomainName || "" },
  ];

  // Check if stack exists
  let stackExists = false;
  try {
    await cfn.send(new DescribeStacksCommand({ StackName: stackName }));
    stackExists = true;
  } catch {
    // Stack doesn't exist
  }

  const templateUrl = `https://${TEMPLATE_BUCKET}.s3.ap-southeast-2.amazonaws.com/${templateKey}`;

  if (stackExists) {
    logger.info(`Updating DNS stack: ${stackName}`);
    try {
      await cfn.send(
        new UpdateStackCommand({
          StackName: stackName,
          TemplateURL: templateUrl,
          Parameters: stackParams,
          RoleARN: CFN_ROLE_ARN,
        })
      );

      // Wait for update
      const stopSpinner = logger.infoWithSpinner("Waiting for DNS stack update...");
      await waitForDNSStackComplete(cfn, stackName, "UPDATE");
      stopSpinner();
    } catch (error: unknown) {
      if (error instanceof Error && error.message?.includes("No updates are to be performed")) {
        logger.info("DNS stack is already up to date");
      } else {
        throw error;
      }
    }
  } else {
    logger.info(`Creating DNS stack: ${stackName}`);
    await cfn.send(
      new CreateStackCommand({
        StackName: stackName,
        TemplateURL: templateUrl,
        Parameters: stackParams,
        RoleARN: CFN_ROLE_ARN,
      })
    );

    // Wait for creation (certificate validation can take a few minutes)
    const stopSpinner = logger.infoWithSpinner("Waiting for DNS stack creation and certificate validation...");
    await waitForDNSStackComplete(cfn, stackName, "CREATE");
    stopSpinner();
  }

  // Get certificate ARN from outputs
  const response = await cfn.send(new DescribeStacksCommand({ StackName: stackName }));
  const outputs = response.Stacks?.[0]?.Outputs || [];
  const certArn = outputs.find((o) => o.OutputKey === "CertificateArn")?.OutputValue || "";

  if (certArn) {
    logger.success(`DNS stack deployed with certificate: ${certArn.substring(0, 60)}...`);
  } else {
    logger.info("DNS stack deployed (certificate may not be created for non-prod stage)");
  }

  return certArn;
}

async function waitForDNSStackComplete(
  cfn: CloudFormationClient,
  stackName: string,
  operation: "CREATE" | "UPDATE"
): Promise<void> {
  const successStatus = operation === "CREATE" ? "CREATE_COMPLETE" : "UPDATE_COMPLETE";
  const failureStatuses = [
    `${operation}_FAILED`,
    "ROLLBACK_COMPLETE",
    "ROLLBACK_FAILED",
    `${operation}_ROLLBACK_COMPLETE`,
  ];

  const maxAttempts = 120; // Certificate validation can take a while
  for (let i = 0; i < maxAttempts; i++) {
    const response = await cfn.send(new DescribeStacksCommand({ StackName: stackName }));
    const status = response.Stacks?.[0]?.StackStatus;

    if (status === successStatus) {
      return;
    }

    if (failureStatuses.some((s) => status?.includes(s))) {
      const events = await cfn.send(new DescribeStackEventsCommand({ StackName: stackName }));
      const failedEvent = events.StackEvents?.find((e) => e.ResourceStatus?.includes("FAILED"));
      throw new Error(`DNS stack ${operation.toLowerCase()} failed: ${failedEvent?.ResourceStatusReason || status}`);
    }

    await new Promise((resolve) => setTimeout(resolve, 5000));
  }

  throw new Error(`Timeout waiting for DNS stack ${operation.toLowerCase()}`);
}

// ============================================================================
// COGNITO - USE SHARED POOL FROM SUPER-SIMPLE-APPS
// ============================================================================

async function getSharedCognitoOutputs(): Promise<Record<string, string>> {
  logger.info("Getting shared Cognito configuration...");
  const sharedStackName = `super-simple-apps-cognito-${STAGE}`;

  try {
    const response = await cfnClient.send(
      new DescribeStacksCommand({ StackName: sharedStackName })
    );

    const stackOutputs = response.Stacks?.[0]?.Outputs || [];

    // Map shared cognito outputs to the format flashcards expects
    const outputs: Record<string, string> = {};
    for (const output of stackOutputs) {
      if (output.OutputKey && output.OutputValue) {
        outputs[output.OutputKey] = output.OutputValue;
      }
    }

    // Map to expected keys (shared uses SharedClientId, flashcards expects UserPoolClientId)
    const mappedOutputs = {
      UserPoolId: outputs.UserPoolId || "",
      UserPoolClientId: outputs.SharedClientId || "", // Use shared client, not legacy flashcards client
      IdentityPoolId: outputs.IdentityPoolId || "",
      UserPoolArn: outputs.UserPoolArn || "",
      UserPoolProviderName: outputs.UserPoolProviderName || "",
    };

    if (!mappedOutputs.UserPoolId || !mappedOutputs.UserPoolClientId || !mappedOutputs.IdentityPoolId) {
      throw new Error("Missing required Cognito outputs from shared stack");
    }

    logger.success("Using shared Cognito pool");
    logger.info(`   User Pool ID: ${mappedOutputs.UserPoolId}`);
    logger.info(`   Client ID: ${mappedOutputs.UserPoolClientId}`);
    logger.info(`   Identity Pool ID: ${mappedOutputs.IdentityPoolId}`);

    // Save to outputs manager for frontend to use
    const existingOutputs = await outputsManager.loadOutputs();
    if (!existingOutputs.stages[STAGE]) {
      existingOutputs.stages[STAGE] = { lastUpdated: new Date().toISOString(), outputs: {} };
    }
    existingOutputs.stages[STAGE].outputs = {
      ...existingOutputs.stages[STAGE].outputs,
      ...mappedOutputs,
    };
    existingOutputs.stages[STAGE].lastUpdated = new Date().toISOString();
    await outputsManager.saveOutputs(existingOutputs);

    return mappedOutputs;
  } catch (error) {
    if (error instanceof Error && error.message?.includes("does not exist")) {
      throw new Error(
        `Shared Cognito stack '${sharedStackName}' not found. ` +
        `Run 'yarn deploy:shared-infra:${STAGE}' first to create the shared Cognito pool.`
      );
    }
    throw error;
  }
}

// ============================================================================
// DYNAMODB DEPLOYMENT
// ============================================================================

async function deployDynamoDB(): Promise<Record<string, string>> {
  logger.info("Deploying DynamoDB table...");
  const stackName = `${APP_NAME}-dynamodb-${STAGE}`;
  const templatePath = join(__dirname, "resources/DynamoDB/decks-table.yaml");

  if (!existsSync(templatePath)) {
    throw new Error(`DynamoDB template not found at ${templatePath}`);
  }

  const deployUserArn = process.env.DEPLOY_USER_ARN || "";

  const outputs = await deployStack(stackName, templatePath, {
    Stage: STAGE,
    AppName: "flashcards",
    DeployUserArn: deployUserArn,
  }, ["CAPABILITY_NAMED_IAM"], cfnRoleArn);

  logger.success("DynamoDB deployed");
  logger.info(`   Table: ${outputs.DataTableName}`);

  // Seed database with sample public decks using the seed role
  if (outputs.SeedRoleArn) {
    try {
      await seedDB({
        region: REGION,
        tableName: outputs.DataTableName,
        stage: STAGE,
        skipConfirmation: true,
        seedRoleArn: outputs.SeedRoleArn,
        externalId: `flashcards-seed-${STAGE}`,
      });
    } catch (error) {
      logger.warning(`Seeding failed: ${getErrorMessage(error)}`);
      logger.warning("Continuing deployment...");
    }
  } else {
    logger.info("No seed role available, skipping database seeding");
  }

  return outputs;
}

// ============================================================================
// GRAPHQL SCHEMA & RESOLVERS
// ============================================================================

async function buildGraphQLSchema(): Promise<void> {
  logger.info("Building GraphQL schema and types...");
  const rootPath = join(__dirname, "..");

  try {
    // Run merge-schema and codegen
    execSync("yarn build-gql", {
      cwd: rootPath,
      stdio: DEBUG_MODE ? "inherit" : "pipe",
      encoding: "utf8",
    });
    logger.success("GraphQL schema and types built");
  } catch (error) {
    logger.error("Failed to build GraphQL schema");
    throw error;
  }
}

async function uploadSchema(): Promise<string> {
  const schemaPath = join(__dirname, "../backend/combined_schema.graphql");

  if (!existsSync(schemaPath)) {
    throw new Error(`Combined schema not found at ${schemaPath}. Run 'yarn merge-schema' first.`);
  }

  // Calculate hash for versioning
  const schemaContent = readFileSync(schemaPath, "utf8");
  const schemaHash = crypto
    .createHash("sha256")
    .update(schemaContent)
    .digest("hex")
    .substring(0, 16);

  const schemaKey = `schema-${schemaHash}.graphql`;
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

  // Find all resolver TypeScript files (relative paths)
  const glob = require("glob");
  const resolverFiles: string[] = glob.sync("**/*.ts", {
    cwd: resolverDir,
    absolute: false,
  });

  if (resolverFiles.length === 0) {
    throw new Error(`No TypeScript resolver files found in ${resolverDir}`);
  }

  logger.info(`Found ${resolverFiles.length} resolver files to compile`);
  resolverFiles.forEach((file: string) => {
    logger.debug(`  - ${path.relative(resolverDir, file)}`);
  });

  const resolverCompiler = new ResolverCompiler({
    logger: logger,
    baseResolverDir: resolverDir,
    s3KeyPrefix: "resolvers",
    stage: STAGE,
    s3BucketName: TEMPLATE_BUCKET,
    region: REGION,
    resolverFiles: resolverFiles,
    sharedFileName: "gqlTypes.ts",
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
    AppName: "flashcards",
    DataTableName: dynamoOutputs.DataTableName,
    TemplateBucketName: TEMPLATE_BUCKET,
    ResolversBuildHash: resolversBuildHash,
    SchemaHash: schemaHash,
    UserPoolId: cognitoOutputs.UserPoolId,
  }, ["CAPABILITY_NAMED_IAM"], cfnRoleArn);

  logger.success("AppSync deployed");
  logger.info(`   GraphQL URL: ${outputs.AppSyncApiUrl}`);
  logger.info(`   API ID: ${outputs.AppSyncApiId}`);
  return outputs;
}

// ============================================================================
// FRONTEND DEPLOYMENT
// ============================================================================

async function deployFrontend(
  domainName: string = "",
  certificateArn: string = "",
  hostedZoneId: string = ""
): Promise<Record<string, string>> {
  logger.info("Deploying frontend infrastructure...");
  const stackName = `${APP_NAME}-frontend-${STAGE}`;
  const templatePath = join(__dirname, "resources/CloudFront/frontend.yaml");

  if (!existsSync(templatePath)) {
    throw new Error(`Frontend template not found at ${templatePath}`);
  }

  const deployUserArn = process.env.DEPLOY_USER_ARN || "";
  logger.info(`   DeployUserArn: ${deployUserArn || "(not set)"}`);
  if (domainName) {
    logger.info(`   DomainName: ${domainName}`);
    logger.info(`   CertificateArn: ${certificateArn ? certificateArn.substring(0, 60) + "..." : "(not set)"}`);
    logger.info(`   HostedZoneId: ${hostedZoneId || "(not set)"}`);
  }

  const outputs = await deployStack(stackName, templatePath, {
    Stage: STAGE,
    AppName: APP_NAME,
    DeployUserArn: deployUserArn,
    DomainName: domainName,
    CertificateArn: certificateArn,
    HostedZoneId: hostedZoneId,
  }, ["CAPABILITY_NAMED_IAM"], cfnRoleArn);

  logger.success("Frontend infrastructure deployed");
  logger.info(`   S3 Bucket: ${outputs.WebsiteBucket}`);
  logger.info(`   CloudFront: ${outputs.CloudFrontDistributionId}`);
  logger.info(`   URL: https://${outputs.CloudFrontDomainName}`);

  // Build and upload frontend using the deploy role
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
  const frontendPath = join(__dirname, "../frontend");
  const outPath = join(frontendPath, "out");

  // next.config.js reads deployment-outputs.json directly - no .env.local needed
  logger.info("Building frontend...");

  try {
    execSync(`yarn build`, {
      cwd: frontendPath,
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
  let awsEnv: Record<string, string> = { ...process.env } as Record<string, string>;

  if (deployRoleArn) {
    logger.info(`Assuming deploy role: ${deployRoleArn}`);
    const stsClient = new STSClient({ region: REGION });
    const assumeRoleResponse = await stsClient.send(
      new AssumeRoleCommand({
        RoleArn: deployRoleArn,
        RoleSessionName: "flashcards-frontend-deploy",
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

  // Invalidate CloudFront using assumed role credentials
  logger.info("Creating CloudFront invalidation...");

  try {
    // Create CloudFront client with assumed role credentials if available
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

    // Wait for invalidation
    const stopSpinner = logger.infoWithSpinner("Waiting for CloudFront invalidation...");
    await waitForInvalidationWithClient(cfClientForInvalidation, distributionId, invalidationId!);
    stopSpinner();
    logger.success("CloudFront invalidation complete");
  } catch (error) {
    logger.warning(`CloudFront invalidation failed: ${getErrorMessage(error)}`);
  }
}

async function waitForInvalidationWithClient(
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
// CONSOLIDATED LAMBDA DEPLOYMENT (SEO, Contact, Report Notification)
// ============================================================================

interface LambdaBuildResult {
  seoS3Key: string;
  contactS3Key: string;
  reportS3Key: string;
}

async function buildAndUploadLambdas(): Promise<LambdaBuildResult> {
  const backendPath = join(__dirname, "../backend");
  const distPath = join(backendPath, "dist-lambdas");

  // Clean and create dist directory
  if (existsSync(distPath)) {
    rmSync(distPath, { recursive: true, force: true });
  }
  mkdirSync(distPath, { recursive: true });

  // Build all handlers in parallel
  logger.info("Building Lambda handlers...");

  const handlers = [
    { name: "SEO", src: "src/handlers/seo/generateDeckHtml.ts", outdir: "seo" },
    { name: "Contact", src: "src/handlers/contact/submitContact.ts", outdir: "contact" },
    { name: "Report", src: "src/handlers/reports/notifyReportedCard.ts", outdir: "reports" },
  ];

  for (const handler of handlers) {
    try {
      execSync(
        `npx esbuild ${handler.src} --bundle --platform=node --target=node18 --outdir=${distPath}/${handler.outdir} --format=cjs`,
        {
          cwd: backendPath,
          stdio: DEBUG_MODE ? "inherit" : "pipe",
        }
      );
      logger.success(`${handler.name} handler compiled`);
    } catch (error) {
      logger.error(`Failed to compile ${handler.name} handler`);
      throw error;
    }
  }

  // Create zips and upload to S3
  const results: LambdaBuildResult = {
    seoS3Key: "",
    contactS3Key: "",
    reportS3Key: "",
  };

  for (const handler of handlers) {
    const zipPath = join(distPath, `${handler.outdir}-lambda.zip`);
    await createZipFromDirectory(join(distPath, handler.outdir), zipPath);

    const codeHash = crypto
      .createHash("sha256")
      .update(readFileSync(zipPath))
      .digest("hex")
      .substring(0, 16);
    const s3Key = `${handler.outdir}-lambda-${codeHash}.zip`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: TEMPLATE_BUCKET,
        Key: s3Key,
        Body: readFileSync(zipPath),
      })
    );
    logger.info(`${handler.name} Lambda uploaded: s3://${TEMPLATE_BUCKET}/${s3Key}`);

    if (handler.outdir === "seo") results.seoS3Key = s3Key;
    if (handler.outdir === "contact") results.contactS3Key = s3Key;
    if (handler.outdir === "reports") results.reportS3Key = s3Key;
  }

  return results;
}

async function deployLambdas(
  dynamoOutputs: Record<string, string>,
  cognitoOutputs: Record<string, string>,
  frontendOutputs: Record<string, string>
): Promise<Record<string, string>> {
  logger.info("Deploying Lambda functions (consolidated stack)...");
  const stackName = `${APP_NAME}-lambdas-${STAGE}`;
  const templatePath = join(__dirname, "resources/Lambda/lambdas.yaml");

  if (!existsSync(templatePath)) {
    throw new Error(`Lambda template not found at ${templatePath}`);
  }

  // Build and upload all Lambda code
  const lambdaKeys = await buildAndUploadLambdas();

  // Determine site URL
  const siteUrl = DOMAIN_NAME && STAGE === "prod"
    ? `https://${DOMAIN_NAME}`
    : `https://${frontendOutputs.CloudFrontDomainName}`;

  // Get email config from environment
  const recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY || "";
  const contactEmail = process.env.CONTACT_EMAIL || "";
  const adminEmail = process.env.ADMIN_EMAIL || process.env.CONTACT_EMAIL || "";
  const fromEmail = process.env.FROM_EMAIL || "";

  const outputs = await deployStack(stackName, templatePath, {
    Stage: STAGE,
    AppName: APP_NAME,
    S3Bucket: TEMPLATE_BUCKET,
    SeoS3Key: lambdaKeys.seoS3Key,
    ContactS3Key: lambdaKeys.contactS3Key,
    ReportS3Key: lambdaKeys.reportS3Key,
    DataTableName: dynamoOutputs.DataTableName,
    DataTableArn: dynamoOutputs.DataTableArn,
    DataTableStreamArn: dynamoOutputs.DataTableStreamArn,
    FrontendBucketName: frontendOutputs.WebsiteBucket,
    FrontendBucketArn: frontendOutputs.WebsiteBucketArn,
    SiteUrl: siteUrl,
    UserPoolId: cognitoOutputs.UserPoolId,
    RecaptchaSecretKey: recaptchaSecretKey,
    ContactEmail: contactEmail,
    AdminEmail: adminEmail,
    FromEmail: fromEmail,
  }, ["CAPABILITY_NAMED_IAM"], cfnRoleArn);

  logger.success("Lambda functions deployed (consolidated)");
  logger.info(`   SEO Function: ${outputs.GenerateDeckHtmlFunctionArn}`);
  logger.info(`   Contact Function: ${outputs.ContactFormFunctionArn}`);
  logger.info(`   Contact API: ${outputs.ContactApiEndpoint}`);
  logger.info(`   Report Function: ${outputs.ReportNotificationFunctionArn}`);
  return outputs;
}

// ============================================================================
// MAIN DEPLOYMENT
// ============================================================================

// Store roleArn globally so deployment functions can access it
let cfnRoleArn: string | undefined;

async function deploy(): Promise<void> {
  setupLogging();

  logger.info("Starting Simple Flashcards deployment");
  logger.info(`   Stage: ${STAGE}`);
  logger.info(`   Region: ${REGION}`);

  // Validate domain configuration
  const hasCustomDomain = DOMAIN_NAME && HOSTED_ZONE_ID;
  if (DOMAIN_NAME && !HOSTED_ZONE_ID) {
    logger.error("--hosted-zone-id is required when --domain-name is specified");
    process.exit(1);
  }
  if (HOSTED_ZONE_ID && !DOMAIN_NAME) {
    logger.error("--domain-name is required when --hosted-zone-id is specified");
    process.exit(1);
  }
  if (hasCustomDomain) {
    logger.info(`   Domain: ${DOMAIN_NAME}`);
    logger.info(`   Hosted Zone: ${HOSTED_ZONE_ID}`);
  }

  // Store certificate ARN for later use
  let certificateArn = "";

  try {
    // Validate AWS credentials
    await configureAwsCredentials();

    // Phase 1: Get or create certificate (if custom domain configured)
    if (hasCustomDomain && STAGE === "prod") {
      logger.info("\n--- Phase 1: DNS & Certificate Setup ---");

      // First, try to get the shared certificate from super-simple-apps-dns-certificate stack
      const cfnUsEast1 = new CloudFormationClient({ region: "us-east-1" });
      try {
        const sharedStackResponse = await cfnUsEast1.send(
          new DescribeStacksCommand({ StackName: "super-simple-apps-dns-certificate" })
        );
        certificateArn = sharedStackResponse.Stacks?.[0]?.Outputs?.find(
          (o) => o.OutputKey === "WildcardCertificateArn"
        )?.OutputValue || "";

        if (certificateArn) {
          logger.success(`Using shared wildcard certificate: ${certificateArn.substring(0, 60)}...`);
        }
      } catch {
        logger.info("Shared certificate not found, creating app-specific certificate...");
      }

      // If no shared certificate, deploy app-specific DNS stack
      if (!certificateArn) {
        certificateArn = await deployDNSStack(
          DOMAIN_NAME,
          HOSTED_ZONE_ID,
          STAGE,
          undefined // CloudFront domain not available yet
        );
      }

      if (!certificateArn) {
        logger.warning("Certificate not created - domain configuration will be skipped");
      }
    } else if (hasCustomDomain && STAGE !== "prod") {
      logger.warning("Custom domain configuration is only supported for prod stage");
      logger.warning("Skipping DNS setup for dev stage");
    }

    // Use shared CloudFormation role (manually created bootstrap resource)
    cfnRoleArn = CFN_ROLE_ARN;
    logger.info(`   Using CloudFormation role: ${cfnRoleArn}`);

    // 1. Build GraphQL schema and types
    await buildGraphQLSchema();

    // 2. Upload schema to S3
    const schemaHash = await uploadSchema();

    // 3. Compile and upload resolvers
    const resolversBuildHash = await compileAndUploadResolvers();

    // 4. Get shared Cognito outputs (uses the shared pool from super-simple-apps)
    const cognitoOutputs = await getSharedCognitoOutputs();

    // 5. Deploy DynamoDB
    const dynamoOutputs = await deployDynamoDB();

    // 6. Deploy AppSync
    await deployAppSync(dynamoOutputs, cognitoOutputs, schemaHash, resolversBuildHash);

    // 7. Deploy Frontend (S3 + CloudFront) - with custom domain if configured
    // Domain configuration is handled by CloudFormation, not direct API calls
    const frontendDomainName = hasCustomDomain && STAGE === "prod" && certificateArn ? DOMAIN_NAME : "";
    const frontendCertArn = hasCustomDomain && STAGE === "prod" ? certificateArn : "";
    const frontendHostedZoneId = hasCustomDomain && STAGE === "prod" ? HOSTED_ZONE_ID : "";

    const frontendOutputs = await deployFrontend(frontendDomainName, frontendCertArn, frontendHostedZoneId);

    // 8. Deploy all Lambda functions (consolidated: SEO, Contact, Report Notification)
    await deployLambdas(dynamoOutputs, cognitoOutputs, frontendOutputs);

    // Log custom domain info if configured
    if (hasCustomDomain && STAGE === "prod" && certificateArn) {
      const cloudFrontDomainName = frontendOutputs.CloudFrontDomainName;
      logger.success("\nCustom domain configuration complete!");
      logger.info("Your site will be accessible at:");
      logger.info(`   - https://${DOMAIN_NAME}`);
      if (DOMAIN_NAME.split('.').length <= 2) {
        logger.info(`   - https://www.${DOMAIN_NAME}`);
      }
      logger.info(`   - https://${cloudFrontDomainName} (CloudFront default)`);
      logger.warning("Note: CloudFront distribution update may take 15-20 minutes to propagate globally");
    }

    // Print summary
    const outputs = await outputsManager.getAllOutputs(STAGE);
    logger.success("\nDeployment complete!\n");
    logger.info("Deployment Outputs:");
    for (const [key, value] of Object.entries(outputs)) {
      logger.info(`   ${key}: ${value}`);
    }

    closeLogFile();
    process.exit(0);
  } catch (error) {
    logger.error(`\nDeployment failed: ${getErrorMessage(error)}`);
    closeLogFile();
    process.exit(1);
  }
}

deploy();
