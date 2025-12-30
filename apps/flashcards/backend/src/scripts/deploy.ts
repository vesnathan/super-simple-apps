/* eslint-disable no-console */
import { readFileSync, existsSync, rmSync, mkdirSync } from "fs";
import { join } from "path";
import { mkdir, rm, readdir, readFile, writeFile, appendFile } from "fs/promises";
import { execSync } from "child_process";

import esbuild from "esbuild";
import JSZip from "jszip";
import {
  CreateTableCommand,
  KeyType,
  ProjectionType,
  ScalarAttributeType,
  BillingMode,
} from "@aws-sdk/client-dynamodb";
import {
  APIGatewayClient,
  CreateRestApiCommand,
  CreateResourceCommand,
  PutMethodCommand,
  PutIntegrationCommand,
  CreateDeploymentCommand,
  GetResourcesCommand,
} from "@aws-sdk/client-api-gateway";
import { LambdaClient, CreateFunctionCommand } from "@aws-sdk/client-lambda";
import {
  IAMClient,
  CreateRoleCommand,
  PutRolePolicyCommand,
  GetRoleCommand,
} from "@aws-sdk/client-iam";
import {
  CloudFormationClient,
  CreateStackCommand,
  UpdateStackCommand,
  DescribeStacksCommand,
  DescribeStackEventsCommand,
} from "@aws-sdk/client-cloudformation";
import {
  CloudFrontClient,
  CreateInvalidationCommand,
  GetInvalidationCommand,
} from "@aws-sdk/client-cloudfront";

import { dynamoDB, CONFIG } from "../config/aws";
import { logger, setLogFile, closeLogFile } from "../utils/logger";

// Type guard for AWS errors
interface AWSError extends Error {
  name: string;
  Code?: string;
}

function isAWSError(error: unknown): error is AWSError {
  return error instanceof Error && "name" in error;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

const cloudformation = new CloudFormationClient({ region: CONFIG.REGION });
const cloudfront = new CloudFrontClient({ region: CONFIG.REGION });

const apiGateway = new APIGatewayClient({});
const lambda = new LambdaClient({});
const iam = new IAMClient({});

// Deployment outputs interface
interface DeploymentOutputs {
  stages: Record<string, {
    lastUpdated: string;
    outputs: Record<string, string>;
  }>;
}

const OUTPUTS_PATH = join(__dirname, "../../deployment-outputs.json");

// Setup logging
function setupLogging() {
  const logDir = join(__dirname, "../../.cache/deploy/logs");

  // Clean up old logs
  if (existsSync(logDir)) {
    rmSync(logDir, { recursive: true, force: true });
  }
  mkdirSync(logDir, { recursive: true });

  const timestamp = new Date().toISOString().replace(/:/g, "-").split(".")[0];
  const logFile = join(logDir, `deploy-${CONFIG.STAGE}-${timestamp}.log`);
  setLogFile(logFile);
  logger.info(`📝 Logging to: ${logFile}`);
}

// Load deployment outputs
function loadDeploymentOutputs(): DeploymentOutputs {
  if (existsSync(OUTPUTS_PATH)) {
    try {
      const content = readFileSync(OUTPUTS_PATH, "utf-8");
      return JSON.parse(content);
    } catch {
      return { stages: {} };
    }
  }
  return { stages: {} };
}

// Get output value from deployment outputs
function getOutputValue(key: string): string | undefined {
  const outputs = loadDeploymentOutputs();
  return outputs.stages[CONFIG.STAGE]?.outputs[key];
}

const handlers = {
  getPublicDecks: "./src/handlers/decks/getPublicDecks.ts", // This will create flashcards-dev-getPublicDecks
  getUserDecks: "./src/handlers/decks/getUserDecks.ts",
  createDeck: "./src/handlers/decks/createDeck.ts",
  syncUserDeck: "./src/handlers/decks/syncUserDeck.ts",
  updateUserCard: "./src/handlers/cards/updateUserCard.ts",
};

interface RouteConfig {
  method: string;
  path: string;
  handler: string;
  requiresAuth?: boolean;
}

const routes: RouteConfig[] = [
  {
    method: "GET",
    path: "api/getPublicDecks", // This path must match frontend API call
    handler: "getPublicDecks", // This must match the key in handlers
    requiresAuth: false,
  },
  {
    method: "GET",
    path: "api/user/getUserDecks",
    handler: "getUserDecks", // Must match key in handlers object
    requiresAuth: true,
  },
  {
    method: "POST",
    path: "api/createDeck",
    handler: "createDeck", // Must match key in handlers object
    requiresAuth: true,
  },
  {
    method: "POST",
    path: "api/deck/syncUserDeck",
    handler: "syncUserDeck", // Must match key in handlers object
    requiresAuth: true,
  },
  {
    method: "PATCH",
    path: "api/deck/{deckId}/updateCard/{cardId}",
    handler: "updateUserCard", // Must match key in handlers object
    requiresAuth: true,
  },
];

async function createDynamoDBTable() {
  const params = {
    TableName: CONFIG.DECKS_TABLE,
    AttributeDefinitions: [
      { AttributeName: "id", AttributeType: ScalarAttributeType.S },
      { AttributeName: "userId", AttributeType: ScalarAttributeType.S },
      { AttributeName: "isPublic", AttributeType: ScalarAttributeType.S },
      { AttributeName: "createdAt", AttributeType: ScalarAttributeType.S },
    ],
    KeySchema: [
      { AttributeName: "id", KeyType: KeyType.HASH },
      { AttributeName: "userId", KeyType: KeyType.RANGE },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: "PublicDecksIndex",
        KeySchema: [
          { AttributeName: "isPublic", KeyType: KeyType.HASH },
          { AttributeName: "createdAt", KeyType: KeyType.RANGE },
        ],
        Projection: { ProjectionType: ProjectionType.ALL },
      },
    ],
    BillingMode: BillingMode.PAY_PER_REQUEST,
  };

  try {
    await dynamoDB.send(new CreateTableCommand(params));
    logger.success("DynamoDB table created successfully");
  } catch (error: unknown) {
    if (isAWSError(error) && error.name === "ResourceInUseException") {
      logger.info("DynamoDB table already exists");
    } else {
      logger.error(`Error creating DynamoDB table: ${getErrorMessage(error)}`);
    }
  }
}

// Add zipDirectory function
async function zipDirectory(sourcePath: string, outPath: string) {
  const zip = new JSZip();
  const entries = await readdir(sourcePath, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isFile()) {
      const filePath = join(sourcePath, entry.name);
      const content = await readFile(filePath);

      zip.file(entry.name, content);
    }
  }

  const zipContent = await zip.generateAsync({ type: "nodebuffer" });

  await writeFile(outPath, zipContent);
}

// Add buildHandlers function
async function buildHandlers() {
  logger.info("Building Lambda functions...");
  const distPath = join(__dirname, "../dist");

  // Clean dist directory
  await rm(distPath, { recursive: true, force: true });
  await mkdir(distPath);

  try {
    // Build each handler separately
    for (const [name, entry] of Object.entries(handlers)) {
      logger.debug(`Building ${name} from ${entry}...`);

      await esbuild.build({
        entryPoints: [entry],
        bundle: true,
        outfile: join(distPath, `${name}.js`),
        platform: "node",
        target: "node18",
        external: ["aws-sdk"],
        minify: true,
      });

      logger.success(`✓ Built ${name}`);
    }

    logger.info("Creating deployment package...");
    await zipDirectory(distPath, join(distPath, "functions.zip"));
    logger.success("✓ Created functions.zip");
  } catch (error: unknown) {
    logger.error(`Build failed: ${getErrorMessage(error)}`);
    throw error;
  }
}

async function createLambdaFunction(name: string, handlerPath: string) {
  if (!CONFIG.LAMBDA_ROLE_ARN) {
    throw new Error("Lambda Role ARN is required");
  }
  if (!CONFIG.COGNITO_USER_POOL_ID) {
    throw new Error("Cognito User Pool ID is required");
  }
  if (!CONFIG.COGNITO_CLIENT_ID) {
    throw new Error("Cognito Client ID is required");
  }

  const functionName = `${CONFIG.APP_NAME}-${name}-${CONFIG.STAGE}`;

  logger.debug(`Creating Lambda function: ${functionName}`);

  const zipPath = join(__dirname, "../dist/functions.zip");
  const zipFile = readFileSync(zipPath);

  try {
    await lambda.send(
      new CreateFunctionCommand({
        FunctionName: functionName,
        Runtime: "nodejs18.x",
        Handler: handlerPath.replace(".ts", ".handler"),
        Role: CONFIG.LAMBDA_ROLE_ARN,
        Code: { ZipFile: zipFile },
        Environment: {
          Variables: {
            DECKS_TABLE: CONFIG.DECKS_TABLE || "decks",
            COGNITO_USER_POOL_ID: CONFIG.COGNITO_USER_POOL_ID,
            COGNITO_CLIENT_ID: CONFIG.COGNITO_CLIENT_ID,
            STAGE: CONFIG.STAGE || "dev",
          },
        },
      }),
    );
    logger.success(`✓ Created Lambda: ${functionName}`);
  } catch (error: unknown) {
    if (isAWSError(error) && error.name === "ResourceConflictException") {
      logger.info(`Lambda ${functionName} already exists`);
    } else {
      logger.error(`Failed to create Lambda function ${name}: ${getErrorMessage(error)}`);
      throw error;
    }
  }
}

async function createApi(): Promise<string> {
  const result = await apiGateway.send(
    new CreateRestApiCommand({
      name: `${CONFIG.APP_NAME}-${CONFIG.STAGE}`,
      description: "API for Flashcards application",
    }),
  );

  if (!result.id) {
    throw new Error("Failed to create API: No API ID returned");
  }

  return result.id;
}

async function createRoute(
  apiId: string,
  method: string,
  path: string,
  handlerName: string,
  requiresAuth: boolean = true,
) {
  // Get root resource
  const resources = await apiGateway.send(
    new GetResourcesCommand({ restApiId: apiId }),
  );

  // Ensure we have the root resource
  const rootResource = resources.items?.find((r) => r.path === "/");

  if (!rootResource?.id) {
    throw new Error("Root resource not found");
  }

  let parentId = rootResource.id;
  const pathParts = path.split("/").filter(Boolean);

  // Create each path segment
  for (const part of pathParts) {
    const resources = await apiGateway.send(
      new GetResourcesCommand({ restApiId: apiId }),
    );

    const existing = resources.items?.find(
      (r) => r.parentId === parentId && r.pathPart === part,
    );

    if (existing) {
      parentId = existing.id || "";
    } else {
      const newResource = await apiGateway.send(
        new CreateResourceCommand({
          restApiId: apiId,
          parentId,
          pathPart: part,
        }),
      );

      parentId = newResource.id!;
    }
  }

  logger.debug(`Creating route: ${method} ${path} -> ${handlerName} (auth: ${requiresAuth})`);

  // Create method with correct authorization
  await apiGateway.send(
    new PutMethodCommand({
      restApiId: apiId,
      resourceId: parentId,
      httpMethod: method,
      authorizationType: requiresAuth ? "COGNITO_USER_POOLS" : "NONE",
      authorizerId: requiresAuth ? CONFIG.COGNITO_AUTHORIZER_ID : undefined,
    }),
  );

  logger.debug(`Creating Lambda integration: ${CONFIG.APP_NAME}-${handlerName}-${CONFIG.STAGE}`);

  // Fix the Lambda integration URI
  await apiGateway.send(
    new PutIntegrationCommand({
      restApiId: apiId,
      resourceId: parentId,
      httpMethod: method,
      type: "AWS_PROXY",
      integrationHttpMethod: "POST",
      uri: `arn:aws:apigateway:${CONFIG.REGION}:lambda:path/2015-03-31/functions/${CONFIG.APP_NAME}-${handlerName}-${CONFIG.STAGE}/invocations`,
      credentials: CONFIG.LAMBDA_ROLE_ARN,
    }),
  );
}

async function waitForRole(roleName: string, maxAttempts = 10): Promise<void> {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      await iam.send(new GetRoleCommand({ RoleName: roleName }));
      logger.success(`Role ${roleName} is now available`);
      return;
    } catch (error: unknown) {
      if (isAWSError(error) && error.name === "NoSuchEntity") {
        logger.debug(`Waiting for role ${roleName} (attempt ${i + 1}/${maxAttempts})...`);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        continue;
      }
      throw error;
    }
  }
  throw new Error(`Timeout waiting for role ${roleName} to become available`);
}

async function createOrGetLambdaRole() {
  const roleName = `flashcards-${CONFIG.STAGE}`;

  try {
    logger.debug(`Checking for existing role: ${roleName}`);
    const existingRole = await iam.send(
      new GetRoleCommand({ RoleName: roleName }),
    );

    if (!existingRole.Role?.Arn) {
      throw new Error(`Role ${roleName} exists but has no ARN`);
    }

    logger.info(`Using existing Lambda role: ${roleName}`);
    return existingRole.Role.Arn;
  } catch (error: unknown) {
    if (
      isAWSError(error) &&
      (error.Code === "NoSuchEntity" || error.name === "NoSuchEntityException")
    ) {
      logger.info(`Role ${roleName} not found, creating new role...`);

      try {
        const createRoleResponse = await iam.send(
          new CreateRoleCommand({
            RoleName: roleName,
            AssumeRolePolicyDocument: JSON.stringify({
              Version: "2012-10-17",
              Statement: [
                {
                  Effect: "Allow",
                  Principal: {
                    Service: "lambda.amazonaws.com",
                  },
                  Action: "sts:AssumeRole",
                },
              ],
            }),
          }),
        );

        if (!createRoleResponse.Role?.Arn) {
          throw new Error("Failed to create role: No ARN returned");
        }

        logger.success(`✓ Created role: ${roleName}`);
        logger.debug(`Role ARN: ${createRoleResponse.Role.Arn}`);

        logger.info("Waiting for role to be available...");
        await waitForRole(roleName);

        logger.info("Attaching Lambda execution policy...");
        await iam.send(
          new PutRolePolicyCommand({
            RoleName: roleName,
            PolicyName: "basic-lambda-execution",
            PolicyDocument: JSON.stringify({
              Version: "2012-10-17",
              Statement: [
                {
                  Effect: "Allow",
                  Action: [
                    "logs:CreateLogGroup",
                    "logs:CreateLogStream",
                    "logs:PutLogEvents",
                  ],
                  Resource: `arn:aws:logs:${CONFIG.REGION}:${CONFIG.AWS_ACCOUNT_ID}:log-group:/aws/lambda/*`,
                },
              ],
            }),
          }),
        );
        logger.success("✓ Lambda execution policy attached");

        logger.info("Attaching DynamoDB policy...");
        await iam.send(
          new PutRolePolicyCommand({
            RoleName: roleName,
            PolicyName: "dynamodb-access",
            PolicyDocument: JSON.stringify({
              Version: "2012-10-17",
              Statement: [
                {
                  Effect: "Allow",
                  Action: [
                    "dynamodb:GetItem",
                    "dynamodb:PutItem",
                    "dynamodb:Query",
                    "dynamodb:Scan",
                  ],
                  Resource: `arn:aws:dynamodb:${CONFIG.REGION}:${CONFIG.AWS_ACCOUNT_ID}:table/${CONFIG.DECKS_TABLE}`,
                },
              ],
            }),
          }),
        );
        logger.success("✓ DynamoDB policy attached");

        return createRoleResponse.Role.Arn;
      } catch (createError: unknown) {
        logger.error(`Error creating role: ${getErrorMessage(createError)}`);
        throw createError;
      }
    }
    logger.error(`Unexpected error: ${getErrorMessage(error)}`);
    throw error;
  }
}

export const createResources = async () => {
  // Setup logging first
  setupLogging();

  logger.info(`🚀 Starting deployment for stage: ${CONFIG.STAGE}`);
  logger.info(`   Region: ${CONFIG.REGION}`);
  logger.info(`   App: ${CONFIG.APP_NAME}`);

  // Build handlers first
  await buildHandlers();

  logger.info("Creating AWS resources...");

  // Create or get Lambda role first
  const roleArn = await createOrGetLambdaRole();

  if (!roleArn) {
    throw new Error("Failed to create or get Lambda role ARN");
  }

  logger.debug(`Using Lambda role ARN: ${roleArn}`);

  // Set the role ARN in CONFIG
  CONFIG.LAMBDA_ROLE_ARN = roleArn;

  await createDynamoDBTable();

  // Create Lambda functions
  await Promise.all(
    Object.entries(handlers).map(async ([name, path]) => {
      await createLambdaFunction(name, path);
    }),
  );

  // Create API Gateway endpoints
  const apiId = await createApi();

  if (!apiId) {
    throw new Error("Failed to create API Gateway");
  }

  await Promise.all(
    routes.map((route) =>
      createRoute(
        apiId,
        route.method,
        route.path,
        route.handler,
        route.requiresAuth,
      ),
    ),
  );

  // Create deployment
  await apiGateway.send(
    new CreateDeploymentCommand({
      restApiId: apiId,
      stageName: CONFIG.STAGE,
    }),
  );

  // Deploy frontend infrastructure and upload
  await deployFrontendInfrastructure();
};

// Frontend Infrastructure Deployment
async function deployFrontendInfrastructure() {
  const stackName = `${CONFIG.APP_NAME}-frontend-${CONFIG.STAGE}`;
  const templatePath = join(__dirname, "../../cloudformation/frontend.yaml");

  if (!existsSync(templatePath)) {
    logger.warning("Frontend CloudFormation template not found, skipping frontend deployment");
    return;
  }

  logger.info("📦 Deploying frontend infrastructure...");

  const templateBody = readFileSync(templatePath, "utf-8");

  try {
    // Check if stack exists
    let stackExists = false;
    try {
      await cloudformation.send(
        new DescribeStacksCommand({ StackName: stackName })
      );
      stackExists = true;
    } catch (error: unknown) {
      if (!(error instanceof Error) || !error.message?.includes("does not exist")) {
        throw error;
      }
    }

    if (stackExists) {
      logger.info(`Updating existing stack: ${stackName}`);
      try {
        await cloudformation.send(
          new UpdateStackCommand({
            StackName: stackName,
            TemplateBody: templateBody,
            Parameters: [
              { ParameterKey: "Stage", ParameterValue: CONFIG.STAGE },
              { ParameterKey: "AppName", ParameterValue: CONFIG.APP_NAME },
            ],
            Capabilities: ["CAPABILITY_IAM"],
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
      await cloudformation.send(
        new CreateStackCommand({
          StackName: stackName,
          TemplateBody: templateBody,
          Parameters: [
            { ParameterKey: "Stage", ParameterValue: CONFIG.STAGE },
            { ParameterKey: "AppName", ParameterValue: CONFIG.APP_NAME },
          ],
          Capabilities: ["CAPABILITY_IAM"],
        })
      );
      await waitForStackComplete(stackName, "CREATE");
    }

    // Get stack outputs
    const stackData = await cloudformation.send(
      new DescribeStacksCommand({ StackName: stackName })
    );

    const outputs = stackData.Stacks?.[0]?.Outputs || [];
    const bucketName = outputs.find((o) => o.OutputKey === "WebsiteBucket")?.OutputValue;
    const distributionId = outputs.find((o) => o.OutputKey === "CloudFrontDistributionId")?.OutputValue;
    const cloudFrontDomain = outputs.find((o) => o.OutputKey === "CloudFrontDomainName")?.OutputValue;

    if (bucketName && distributionId) {
      logger.success("✅ Frontend infrastructure ready");
      logger.info(`   S3 Bucket: ${bucketName}`);
      logger.info(`   CloudFront Distribution: ${distributionId}`);
      logger.info(`   URL: https://${cloudFrontDomain}`);

      // Save to .env file
      await saveToEnvFile(bucketName, distributionId, cloudFrontDomain || "");

      // Save deployment outputs
      await saveDeploymentOutputs({
        s3Bucket: bucketName,
        cloudFrontDistributionId: distributionId,
        cloudFrontDomain: cloudFrontDomain || "",
        websiteUrl: `https://${cloudFrontDomain}`,
      });

      // Build and upload frontend
      await buildAndUploadFrontend(bucketName, distributionId);
    }
  } catch (error: unknown) {
    logger.error(`Frontend infrastructure deployment failed: ${getErrorMessage(error)}`);
    throw error;
  }
}

async function waitForStackComplete(stackName: string, operation: "CREATE" | "UPDATE") {
  const successStatus = operation === "CREATE" ? "CREATE_COMPLETE" : "UPDATE_COMPLETE";
  const failureStatuses = [
    `${operation}_FAILED`,
    "ROLLBACK_COMPLETE",
    "ROLLBACK_FAILED",
    `${operation}_ROLLBACK_COMPLETE`,
  ];

  console.log(`⏳ Waiting for stack ${operation.toLowerCase()}...`);

  const maxAttempts = 60; // 10 minutes
  for (let i = 0; i < maxAttempts; i++) {
    const response = await cloudformation.send(
      new DescribeStacksCommand({ StackName: stackName })
    );

    const status = response.Stacks?.[0]?.StackStatus;
    process.stdout.write(`\r   Status: ${status} (${i * 10}s elapsed)`);

    if (status === successStatus) {
      console.log(`\n✅ Stack ${operation.toLowerCase()} complete`);
      return;
    }

    if (failureStatuses.some((s) => status?.includes(s))) {
      // Get failure reason
      const events = await cloudformation.send(
        new DescribeStackEventsCommand({ StackName: stackName })
      );
      const failedEvent = events.StackEvents?.find((e) =>
        e.ResourceStatus?.includes("FAILED")
      );
      throw new Error(
        `Stack ${operation.toLowerCase()} failed: ${failedEvent?.ResourceStatusReason || status}`
      );
    }

    await new Promise((resolve) => setTimeout(resolve, 10000));
  }

  throw new Error(`Timeout waiting for stack ${operation.toLowerCase()}`);
}

async function saveToEnvFile(bucketName: string, distributionId: string, cloudFrontDomain: string) {
  const envPath = join(__dirname, "../../../.env");
  const suffix = CONFIG.STAGE === "prod" ? "_PROD" : "_DEV";

  // Read existing content
  let existingContent = "";
  if (existsSync(envPath)) {
    existingContent = readFileSync(envPath, "utf-8");
  }

  // Check if values already exist
  const bucketKey = `S3_BUCKET${suffix}`;
  const cfIdKey = `CLOUDFRONT_DISTRIBUTION_ID${suffix}`;
  const cfDomainKey = `CLOUDFRONT_DOMAIN${suffix}`;

  if (existingContent.includes(bucketKey) && !existingContent.includes(`# ${bucketKey}`)) {
    logger.info("Environment variables already configured");
    return;
  }

  const newVars = `
# ${CONFIG.STAGE.toUpperCase()} Frontend Infrastructure (auto-generated)
${bucketKey}=${bucketName}
${cfIdKey}=${distributionId}
${cfDomainKey}=${cloudFrontDomain}
`;

  await appendFile(envPath, newVars);
  logger.success("✅ Saved infrastructure details to .env");
}

async function buildAndUploadFrontend(bucketName: string, distributionId: string) {
  const frontendPath = join(__dirname, "../../../frontend");
  const outPath = join(frontendPath, "out");

  logger.info("🔨 Building frontend...");

  try {
    execSync(`yarn build`, {
      cwd: frontendPath,
      stdio: "inherit",
      env: { ...process.env, NEXT_PUBLIC_ENVIRONMENT: CONFIG.STAGE },
    });
    logger.success("✅ Frontend build complete");
  } catch (error) {
    logger.error("❌ Frontend build failed");
    throw error;
  }

  // Check if out directory exists
  if (!existsSync(outPath)) {
    logger.warning("No 'out' directory found - is 'output: export' configured in next.config.js?");
    return;
  }

  logger.info("📤 Uploading to S3...");

  try {
    const awsCli = process.env.AWS_CLI_PATH || "aws";
    execSync(`${awsCli} s3 sync ${outPath} s3://${bucketName}/ --delete --region ${CONFIG.REGION}`, {
      stdio: "inherit",
    });
    logger.success("✅ Upload complete");
  } catch (error) {
    logger.error("❌ S3 upload failed");
    throw error;
  }

  // Invalidate CloudFront
  logger.info("🔄 Creating CloudFront invalidation...");

  try {
    const invalidation = await cloudfront.send(
      new CreateInvalidationCommand({
        DistributionId: distributionId,
        InvalidationBatch: {
          CallerReference: Date.now().toString(),
          Paths: {
            Quantity: 1,
            Items: ["/*"],
          },
        },
      })
    );

    const invalidationId = invalidation.Invalidation?.Id;
    logger.info(`   Invalidation ID: ${invalidationId}`);

    // Wait for invalidation to complete
    const stopSpinner = logger.infoWithSpinner("Waiting for CloudFront invalidation...");
    await waitForInvalidation(distributionId, invalidationId!);
    stopSpinner();
    logger.success("✅ CloudFront invalidation complete");
  } catch (error) {
    logger.warning(`CloudFront invalidation failed (site may still work): ${getErrorMessage(error)}`);
  }
}

async function waitForInvalidation(distributionId: string, invalidationId: string) {
  const maxAttempts = 60; // 5 minutes

  for (let i = 0; i < maxAttempts; i++) {
    const response = await cloudfront.send(
      new GetInvalidationCommand({
        DistributionId: distributionId,
        Id: invalidationId,
      })
    );

    const status = response.Invalidation?.Status;

    if (status === "Completed") {
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 5000));
  }

  logger.warning("Invalidation still in progress (continuing anyway)");
}

async function saveDeploymentOutputs(outputs: Record<string, string>) {
  const outputsPath = join(__dirname, "../../deployment-outputs.json");

  interface DeploymentOutputs {
    stages: Record<string, {
      lastUpdated: string;
      outputs: Record<string, string>;
    }>;
  }

  let deploymentOutputs: DeploymentOutputs = { stages: {} };

  // Load existing outputs
  if (existsSync(outputsPath)) {
    try {
      const content = readFileSync(outputsPath, "utf-8");
      deploymentOutputs = JSON.parse(content);
    } catch {
      // Start fresh if file is corrupted
    }
  }

  // Update stage outputs
  deploymentOutputs.stages[CONFIG.STAGE] = {
    lastUpdated: new Date().toISOString(),
    outputs,
  };

  await writeFile(outputsPath, JSON.stringify(deploymentOutputs, null, 2));
  logger.success(`✅ Saved deployment outputs to deployment-outputs.json`);
}

createResources()
  .then(() => {
    closeLogFile();
    logger.success("🎉 Deployment complete!");
    process.exit(0);
  })
  .catch((error) => {
    logger.error(`Deployment failed: ${getErrorMessage(error)}`);
    closeLogFile();
    process.exit(1);
  });
