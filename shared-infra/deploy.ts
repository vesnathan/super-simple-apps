import {
  CloudFormationClient,
  CreateStackCommand,
  UpdateStackCommand,
  DescribeStacksCommand,
  Parameter,
  Capability,
} from "@aws-sdk/client-cloudformation";
import { S3Client, PutObjectCommand, HeadBucketCommand, CreateBucketCommand } from "@aws-sdk/client-s3";
import { readFileSync, existsSync } from "fs";
import * as path from "path";

const REGION_MAIN = process.env.AWS_REGION || "ap-southeast-2";
const REGION_US_EAST_1 = "us-east-1"; // Required for CloudFront certificates

// Configuration - update these for your environment
const CONFIG = {
  rootDomain: "super-simple-apps.com",
  hostedZoneId: process.env.HOSTED_ZONE_ID || "", // Set this or pass as env var
  templateBucket: "super-simple-apps-templates",
};

interface ErrorWithMessage {
  message?: string;
  name?: string;
  Code?: string;
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function ensureBucketExists(s3: S3Client, bucketName: string, region: string): Promise<void> {
  try {
    await s3.send(new HeadBucketCommand({ Bucket: bucketName }));
    console.log(`✓ Bucket ${bucketName} exists`);
  } catch (error: unknown) {
    const err = error as ErrorWithMessage;
    if (err.name === "NotFound" || err.Code === "NotFound" || err.name === "NoSuchBucket") {
      console.log(`Creating bucket ${bucketName}...`);
      await s3.send(new CreateBucketCommand({
        Bucket: bucketName,
        CreateBucketConfiguration: region === "us-east-1" ? undefined : {
          LocationConstraint: region as any,
        },
      }));
      console.log(`✓ Bucket ${bucketName} created`);
    } else {
      throw error;
    }
  }
}

async function uploadTemplate(s3: S3Client, bucketName: string, templatePath: string, key: string): Promise<string> {
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

async function waitForStackCompletion(
  cfn: CloudFormationClient,
  stackName: string,
  operation: "CREATE" | "UPDATE"
): Promise<void> {
  const maxAttempts = 120; // 20 minutes
  const delay = 10000; // 10 seconds

  const inProgressStatuses = operation === "CREATE"
    ? ["CREATE_IN_PROGRESS", "REVIEW_IN_PROGRESS"]
    : ["UPDATE_IN_PROGRESS", "UPDATE_COMPLETE_CLEANUP_IN_PROGRESS"];

  const successStatus = operation === "CREATE" ? "CREATE_COMPLETE" : "UPDATE_COMPLETE";
  const failureStatuses = operation === "CREATE"
    ? ["CREATE_FAILED", "ROLLBACK_COMPLETE", "ROLLBACK_FAILED", "ROLLBACK_IN_PROGRESS"]
    : ["UPDATE_FAILED", "UPDATE_ROLLBACK_FAILED", "UPDATE_ROLLBACK_IN_PROGRESS", "UPDATE_ROLLBACK_COMPLETE"];

  for (let i = 0; i < maxAttempts; i++) {
    const response = await cfn.send(new DescribeStacksCommand({ StackName: stackName }));
    const stack = response.Stacks?.[0];
    const status = stack?.StackStatus;

    if (status === successStatus) {
      console.log(`✓ Stack ${stackName} ${operation.toLowerCase()} completed`);
      return;
    }

    if (status && failureStatuses.includes(status)) {
      const reason = stack?.StackStatusReason || "No reason provided";
      throw new Error(`Stack ${stackName} failed: ${status} - ${reason}`);
    }

    if (status && !inProgressStatuses.includes(status)) {
      console.log(`Stack status: ${status}`);
    }

    await sleep(delay);
  }

  throw new Error(`Timeout waiting for stack ${stackName}`);
}

async function deployOrUpdateStack(
  cfn: CloudFormationClient,
  stackName: string,
  templateUrl: string,
  parameters: Parameter[]
): Promise<{ outputs: Record<string, string> }> {
  // Check if stack exists
  let stackExists = false;
  try {
    const response = await cfn.send(new DescribeStacksCommand({ StackName: stackName }));
    stackExists = !!(response.Stacks && response.Stacks.length > 0);
  } catch (error: unknown) {
    const err = error as ErrorWithMessage;
    if (!err.message?.includes("does not exist")) {
      throw error;
    }
  }

  if (stackExists) {
    console.log(`Updating stack ${stackName}...`);
    try {
      await cfn.send(new UpdateStackCommand({
        StackName: stackName,
        TemplateURL: templateUrl,
        Parameters: parameters,
        Capabilities: [Capability.CAPABILITY_NAMED_IAM],
      }));
      await waitForStackCompletion(cfn, stackName, "UPDATE");
    } catch (error: unknown) {
      const err = error as ErrorWithMessage;
      if (err.message?.includes("No updates are to be performed")) {
        console.log(`✓ Stack ${stackName} is already up to date`);
      } else {
        throw error;
      }
    }
  } else {
    console.log(`Creating stack ${stackName}...`);
    await cfn.send(new CreateStackCommand({
      StackName: stackName,
      TemplateURL: templateUrl,
      Parameters: parameters,
      Capabilities: [Capability.CAPABILITY_NAMED_IAM],
    }));
    await waitForStackCompletion(cfn, stackName, "CREATE");
  }

  // Get outputs
  const stackData = await cfn.send(new DescribeStacksCommand({ StackName: stackName }));
  const outputs: Record<string, string> = {};
  stackData.Stacks?.[0]?.Outputs?.forEach((output) => {
    if (output.OutputKey && output.OutputValue) {
      outputs[output.OutputKey] = output.OutputValue;
    }
  });

  return { outputs };
}

async function deploySharedInfra(stage: string): Promise<void> {
  console.log("\n🚀 Deploying Super Simple Apps Shared Infrastructure\n");
  console.log(`Stage: ${stage}`);
  console.log(`Root Domain: ${CONFIG.rootDomain}`);
  console.log(`Hosted Zone ID: ${CONFIG.hostedZoneId || "NOT SET"}`);

  if (!CONFIG.hostedZoneId) {
    console.error("\n❌ Error: HOSTED_ZONE_ID environment variable is required");
    console.error("   Set it with: export HOSTED_ZONE_ID=your-zone-id");
    process.exit(1);
  }

  const templateDir = path.join(__dirname, "resources");

  // Step 1: Deploy DNS/Certificate stack to us-east-1
  console.log("\n📋 Step 1: Deploying DNS & Certificate to us-east-1...");
  console.log("   (ACM certificates for CloudFront must be in us-east-1)");
  console.log("   ⏳ This may take 5-10 minutes for certificate validation...\n");

  const s3UsEast1 = new S3Client({ region: REGION_US_EAST_1 });
  const cfnUsEast1 = new CloudFormationClient({ region: REGION_US_EAST_1 });

  // Ensure template bucket exists in us-east-1
  const templateBucketUsEast1 = `${CONFIG.templateBucket}-us-east-1`;
  await ensureBucketExists(s3UsEast1, templateBucketUsEast1, REGION_US_EAST_1);

  // Upload DNS certificate template
  const dnsCertTemplatePath = path.join(templateDir, "dns-certificate.yaml");
  if (!existsSync(dnsCertTemplatePath)) {
    throw new Error(`Template not found: ${dnsCertTemplatePath}`);
  }
  const dnsCertTemplateUrl = await uploadTemplate(
    s3UsEast1,
    templateBucketUsEast1,
    dnsCertTemplatePath,
    "dns-certificate.yaml"
  );

  // Deploy DNS/Certificate stack
  const dnsStackName = `super-simple-apps-dns-certificate`;
  const { outputs: dnsOutputs } = await deployOrUpdateStack(cfnUsEast1, dnsStackName, dnsCertTemplateUrl, [
    { ParameterKey: "RootDomainName", ParameterValue: CONFIG.rootDomain },
    { ParameterKey: "HostedZoneId", ParameterValue: CONFIG.hostedZoneId },
  ]);

  const certificateArn = dnsOutputs.WildcardCertificateArn;
  console.log(`\n✓ Certificate ARN: ${certificateArn}`);

  // Step 2: Deploy Cognito stack to main region (only for prod)
  if (stage === "prod") {
    console.log("\n📋 Step 2: Deploying Cognito to main region...");

    const s3Main = new S3Client({ region: REGION_MAIN });
    const cfnMain = new CloudFormationClient({ region: REGION_MAIN });

    // Ensure template bucket exists in main region
    const templateBucketMain = `${CONFIG.templateBucket}-${REGION_MAIN}`;
    await ensureBucketExists(s3Main, templateBucketMain, REGION_MAIN);

    // Upload Cognito template
    const cognitoTemplatePath = path.join(templateDir, "cognito.yaml");
    if (!existsSync(cognitoTemplatePath)) {
      throw new Error(`Template not found: ${cognitoTemplatePath}`);
    }
    const cognitoTemplateUrl = await uploadTemplate(
      s3Main,
      templateBucketMain,
      cognitoTemplatePath,
      "cognito.yaml"
    );

    // Deploy Cognito stack
    const cognitoStackName = `super-simple-apps-cognito-${stage}`;
    const { outputs: cognitoOutputs } = await deployOrUpdateStack(cfnMain, cognitoStackName, cognitoTemplateUrl, [
      { ParameterKey: "Stage", ParameterValue: stage },
      { ParameterKey: "RootDomainName", ParameterValue: CONFIG.rootDomain },
      { ParameterKey: "WildcardCertificateArn", ParameterValue: certificateArn },
      { ParameterKey: "HostedZoneId", ParameterValue: CONFIG.hostedZoneId },
    ]);

    console.log("\n✓ Cognito Outputs:");
    console.log(`  User Pool ID: ${cognitoOutputs.UserPoolId}`);
    console.log(`  Flashcards Client ID: ${cognitoOutputs.FlashcardsClientId}`);
    console.log(`  Identity Pool ID: ${cognitoOutputs.IdentityPoolId}`);
    console.log(`  Auth Domain: ${cognitoOutputs.UserPoolDomainUrl}`);
  } else {
    console.log("\n⏭️  Skipping Cognito deployment (dev stage uses Cognito prefix domain)");
  }

  console.log("\n✅ Shared infrastructure deployment complete!\n");
  console.log("Next steps:");
  console.log("  1. Deploy individual apps (flashcards, invoices, etc.)");
  console.log("  2. Each app will use the shared certificate and Cognito");
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
