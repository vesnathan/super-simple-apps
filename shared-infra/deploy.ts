/**
 * Super Simple Apps - Shared Infrastructure Deployment
 *
 * Deploys:
 *   1. DNS/Certificate stack (us-east-1) - wildcard cert for *.super-simple-apps.com
 *   2. Cognito stack (ap-southeast-2) - shared user pool for all apps
 *   3. DynamoDB stack (ap-southeast-2) - shared data table for CRM, Invoice, Job Timer
 *
 * SECURITY MODEL:
 *   - Deploy user has minimal permissions (see bootstrap-check.ts)
 *   - CloudFormation uses a service role to create resources
 *   - App-specific deploy roles are created by CloudFormation for S3/CloudFront access
 */

import { config } from "dotenv";
import * as path from "path";
import { readFileSync, existsSync } from "fs";

config({ path: path.resolve(__dirname, "../.env") });

import {
  CloudFormationClient,
  CreateStackCommand,
  UpdateStackCommand,
  DescribeStacksCommand,
  Capability,
} from "@aws-sdk/client-cloudformation";
import {
  S3Client,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

import {
  checkBootstrapResources,
  printBootstrapInstructions,
  getBootstrapConfig,
} from "../deploy/bootstrap-check";

const REGION_MAIN = process.env.AWS_REGION || "ap-southeast-2";
const REGION_US_EAST_1 = "us-east-1";
const DEPLOY_USER_ARN = process.env.DEPLOY_USER_ARN || "arn:aws:iam::430118819356:user/ssa-deploy";

const CONFIG = {
  rootDomain: "super-simple-apps.com",
  hostedZoneId: process.env.HOSTED_ZONE_ID || "",
};

interface StackError {
  message?: string;
  name?: string;
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function uploadTemplate(
  s3: S3Client,
  bucketName: string,
  templatePath: string,
  key: string
): Promise<string> {
  const templateContent = readFileSync(templatePath, "utf8");

  await s3.send(new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: templateContent,
    ContentType: "application/x-yaml",
  }));

  console.log(`✓ Uploaded ${key}`);
  return `https://s3.amazonaws.com/${bucketName}/${key}`;
}

async function waitForStack(
  cfn: CloudFormationClient,
  stackName: string,
  operation: "CREATE" | "UPDATE"
): Promise<void> {
  const maxAttempts = 120;
  const delay = 10000;

  const successStatus = `${operation}_COMPLETE`;
  const failurePatterns = ["FAILED", "ROLLBACK"];

  console.log(`   Waiting for stack ${operation.toLowerCase()}...`);

  for (let i = 0; i < maxAttempts; i++) {
    const response = await cfn.send(new DescribeStacksCommand({ StackName: stackName }));
    const status = response.Stacks?.[0]?.StackStatus || "";

    if (status === successStatus) {
      console.log(`✓ Stack ${operation.toLowerCase()} complete`);
      return;
    }

    if (failurePatterns.some((p) => status.includes(p))) {
      const reason = response.Stacks?.[0]?.StackStatusReason || "No reason provided";
      throw new Error(`Stack ${operation.toLowerCase()} failed: ${status} - ${reason}`);
    }

    if (i % 6 === 0 && i > 0) {
      console.log(`   Still waiting... (${Math.floor(i * delay / 60000)} min)`);
    }

    await sleep(delay);
  }

  throw new Error(`Timeout waiting for stack ${operation.toLowerCase()}`);
}

async function deployStack(
  cfn: CloudFormationClient,
  stackName: string,
  templateUrl: string,
  parameters: { ParameterKey: string; ParameterValue: string }[],
  roleArn: string
): Promise<Record<string, string>> {
  // Check if stack exists
  let stackExists = false;
  try {
    const response = await cfn.send(new DescribeStacksCommand({ StackName: stackName }));
    stackExists = !!(response.Stacks && response.Stacks.length > 0);
  } catch (error: unknown) {
    const err = error as StackError;
    if (!err.message?.includes("does not exist")) {
      throw error;
    }
  }

  if (stackExists) {
    console.log(`Updating stack: ${stackName}`);
    try {
      await cfn.send(new UpdateStackCommand({
        StackName: stackName,
        TemplateURL: templateUrl,
        Parameters: parameters,
        Capabilities: [Capability.CAPABILITY_NAMED_IAM],
        RoleARN: roleArn,
      }));
      await waitForStack(cfn, stackName, "UPDATE");
    } catch (error: unknown) {
      const err = error as StackError;
      if (err.message?.includes("No updates are to be performed")) {
        console.log(`✓ Stack ${stackName} is already up to date`);
      } else {
        throw error;
      }
    }
  } else {
    console.log(`Creating stack: ${stackName}`);
    await cfn.send(new CreateStackCommand({
      StackName: stackName,
      TemplateURL: templateUrl,
      Parameters: parameters,
      Capabilities: [Capability.CAPABILITY_NAMED_IAM],
      RoleARN: roleArn,
    }));
    await waitForStack(cfn, stackName, "CREATE");
  }

  // Get outputs
  const stackData = await cfn.send(new DescribeStacksCommand({ StackName: stackName }));
  const outputs: Record<string, string> = {};
  stackData.Stacks?.[0]?.Outputs?.forEach((output) => {
    if (output.OutputKey && output.OutputValue) {
      outputs[output.OutputKey] = output.OutputValue;
    }
  });

  return outputs;
}

async function deploySharedInfra(stage: string): Promise<void> {
  console.log("\n" + "=".repeat(60));
  console.log("  Super Simple Apps - Shared Infrastructure Deployment");
  console.log("=".repeat(60));
  console.log(`\nStage: ${stage}`);
  console.log(`Root Domain: ${CONFIG.rootDomain}`);
  console.log(`Hosted Zone ID: ${CONFIG.hostedZoneId || "NOT SET"}\n`);

  if (!CONFIG.hostedZoneId) {
    console.error("❌ Error: HOSTED_ZONE_ID environment variable is required");
    console.error("   Set it in .env file or: export HOSTED_ZONE_ID=your-zone-id");
    process.exit(1);
  }

  // Check bootstrap resources (single bucket in ap-southeast-2, IAM is global)
  console.log("Checking bootstrap resources...\n");

  const bootstrapCheck = await checkBootstrapResources();

  if (!bootstrapCheck.ready) {
    printBootstrapInstructions(
      bootstrapCheck.missingBucket,
      bootstrapCheck.missingRole,
      bootstrapCheck.config,
      DEPLOY_USER_ARN
    );
    process.exit(1);
  }

  console.log("✓ Bootstrap resources verified\n");

  const templateDir = path.join(__dirname, "resources");
  const cfnRoleArn = bootstrapCheck.config.cfnRoleArn;
  const templateBucketName = bootstrapCheck.config.templateBucketName;

  // Step 1: Deploy DNS/Certificate stack to us-east-1
  console.log("─".repeat(60));
  console.log("Step 1: DNS & Certificate (us-east-1)");
  console.log("─".repeat(60));
  console.log("(ACM certificates for CloudFront must be in us-east-1)");
  console.log("⏳ Certificate validation may take 5-10 minutes...\n");

  // S3 client for template uploads (always ap-southeast-2)
  const s3Main = new S3Client({ region: REGION_MAIN });
  // CloudFormation client for us-east-1 (DNS/cert stack)
  const cfnUsEast1 = new CloudFormationClient({ region: REGION_US_EAST_1 });

  const dnsCertTemplatePath = path.join(templateDir, "dns-certificate.yaml");
  if (!existsSync(dnsCertTemplatePath)) {
    throw new Error(`Template not found: ${dnsCertTemplatePath}`);
  }

  const dnsCertTemplateUrl = await uploadTemplate(
    s3Main,
    templateBucketName,
    dnsCertTemplatePath,
    `shared-infra/${stage}/dns-certificate.yaml`
  );

  const dnsOutputs = await deployStack(
    cfnUsEast1,
    `super-simple-apps-dns-certificate`,
    dnsCertTemplateUrl,
    [
      { ParameterKey: "RootDomainName", ParameterValue: CONFIG.rootDomain },
      { ParameterKey: "HostedZoneId", ParameterValue: CONFIG.hostedZoneId },
    ],
    cfnRoleArn
  );

  const certificateArn = dnsOutputs.WildcardCertificateArn;
  console.log(`\n✓ Certificate ARN: ${certificateArn}\n`);

  const cfnMain = new CloudFormationClient({ region: REGION_MAIN });

  // Step 2: Deploy Cognito stack to main region (only for prod)
  if (stage === "prod") {
    console.log("─".repeat(60));
    console.log("Step 2: Cognito User Pool (ap-southeast-2)");
    console.log("─".repeat(60) + "\n");

    const cognitoTemplatePath = path.join(templateDir, "cognito.yaml");
    if (!existsSync(cognitoTemplatePath)) {
      throw new Error(`Template not found: ${cognitoTemplatePath}`);
    }

    const cognitoTemplateUrl = await uploadTemplate(
      s3Main,
      templateBucketName,
      cognitoTemplatePath,
      `shared-infra/${stage}/cognito.yaml`
    );

    const cognitoOutputs = await deployStack(
      cfnMain,
      `super-simple-apps-cognito-${stage}`,
      cognitoTemplateUrl,
      [
        { ParameterKey: "Stage", ParameterValue: stage },
        { ParameterKey: "RootDomainName", ParameterValue: CONFIG.rootDomain },
        { ParameterKey: "WildcardCertificateArn", ParameterValue: certificateArn },
        { ParameterKey: "HostedZoneId", ParameterValue: CONFIG.hostedZoneId },
      ],
      cfnRoleArn
    );

    console.log("\n✓ Cognito Outputs:");
    console.log(`   User Pool ID: ${cognitoOutputs.UserPoolId}`);
    console.log(`   Flashcards Client ID: ${cognitoOutputs.FlashcardsClientId}`);
    console.log(`   Identity Pool ID: ${cognitoOutputs.IdentityPoolId}`);
    console.log(`   Auth Domain: ${cognitoOutputs.UserPoolDomainUrl}`);
  } else {
    console.log("\n⏭️  Skipping Cognito deployment (dev stage uses prefix domain)\n");
  }

  // Step 3: Deploy DynamoDB table for business apps (CRM, Invoice, Job Timer)
  console.log("─".repeat(60));
  console.log("Step 3: Business Apps DynamoDB Table (ap-southeast-2)");
  console.log("─".repeat(60) + "\n");

  const dynamodbTemplatePath = path.join(templateDir, "dynamodb.yaml");
  if (!existsSync(dynamodbTemplatePath)) {
    throw new Error(`Template not found: ${dynamodbTemplatePath}`);
  }

  const dynamodbTemplateUrl = await uploadTemplate(
    s3Main,
    templateBucketName,
    dynamodbTemplatePath,
    `shared-infra/${stage}/dynamodb.yaml`
  );

  const dynamodbOutputs = await deployStack(
    cfnMain,
    `super-simple-apps-business-db-${stage}`,
    dynamodbTemplateUrl,
    [
      { ParameterKey: "Stage", ParameterValue: stage },
    ],
    cfnRoleArn
  );

  console.log("\n✓ DynamoDB Outputs:");
  console.log(`   Table Name: ${dynamodbOutputs.TableName}`);
  console.log(`   Table ARN: ${dynamodbOutputs.TableArn}`);

  console.log("\n" + "=".repeat(60));
  console.log("  ✅ Shared infrastructure deployment complete!");
  console.log("=".repeat(60));
  console.log("\nNext steps:");
  console.log("  yarn deploy:all:prod   # Deploy all apps");
  console.log("  yarn deploy:landing:prod   # Deploy just the landing page");
  console.log("");
}

// Main entry point
const stage = process.argv[2] || "prod";
if (!["dev", "prod"].includes(stage)) {
  console.error("Usage: npx tsx deploy.ts [dev|prod]");
  process.exit(1);
}

deploySharedInfra(stage).catch((error) => {
  console.error("\n❌ Deployment failed:", error.message || error);
  process.exit(1);
});
