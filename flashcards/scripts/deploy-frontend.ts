#!/usr/bin/env ts-node

/**
 * Deploy frontend script
 *
 * Builds the frontend, uploads to S3, invalidates CloudFront,
 * and waits for invalidation to complete.
 *
 * Usage: npx ts-node scripts/deploy-frontend.ts [stage]
 * Example: npx ts-node scripts/deploy-frontend.ts dev
 */

import {
  CloudFrontClient,
  CreateInvalidationCommand,
  GetInvalidationCommand,
} from "@aws-sdk/client-cloudfront";
import { execSync } from "child_process";
import { join } from "path";
import { config } from "dotenv";

// Load environment variables from root .env
config({ path: join(__dirname, "../.env") });

const REGION = "ap-southeast-2";

interface DeployConfig {
  bucketName: string;
  distributionId: string;
}

function getDeployConfig(stage: string): DeployConfig {
  const bucketName =
    stage === "prod"
      ? process.env.S3_BUCKET_PROD
      : process.env.S3_BUCKET_DEV || process.env.S3_BUCKET;

  const distributionId =
    stage === "prod"
      ? process.env.CLOUDFRONT_DISTRIBUTION_ID_PROD
      : process.env.CLOUDFRONT_DISTRIBUTION_ID_DEV ||
        process.env.CLOUDFRONT_DISTRIBUTION_ID;

  if (!bucketName) {
    throw new Error(
      `Missing S3_BUCKET${stage === "prod" ? "_PROD" : "_DEV"} in .env file`
    );
  }

  if (!distributionId) {
    throw new Error(
      `Missing CLOUDFRONT_DISTRIBUTION_ID${stage === "prod" ? "_PROD" : "_DEV"} in .env file`
    );
  }

  return { bucketName, distributionId };
}

async function buildFrontend(stage: string): Promise<void> {
  console.log("🔨 Building frontend...");

  const frontendPath = join(process.cwd(), "frontend");
  const buildCommand = `cd ${frontendPath} && NEXT_PUBLIC_ENVIRONMENT=${stage} yarn build`;

  try {
    execSync(buildCommand, { stdio: "inherit" });
    console.log("✅ Frontend build completed");
  } catch (error) {
    console.error("❌ Frontend build failed");
    throw error;
  }
}

async function uploadToS3(bucketName: string): Promise<void> {
  console.log(`📤 Uploading to S3 bucket: ${bucketName}...`);

  const frontendPath = join(process.cwd(), "frontend");
  const outPath = join(frontendPath, "out");

  // Use AWS CLI for efficient sync
  const awsCli = process.env.AWS_CLI_PATH || "aws";
  const syncCommand = `${awsCli} s3 sync ${outPath} s3://${bucketName}/ --delete --region ${REGION}`;

  try {
    execSync(syncCommand, { stdio: "inherit" });
    console.log("✅ Upload completed");
  } catch (error) {
    console.error("❌ Upload failed");
    throw error;
  }
}

async function invalidateCloudFront(distributionId: string): Promise<string> {
  console.log(`🔄 Creating CloudFront invalidation for ${distributionId}...`);

  const cfClient = new CloudFrontClient({ region: REGION });

  const response = await cfClient.send(
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

  const invalidationId = response.Invalidation?.Id;
  if (!invalidationId) {
    throw new Error("Failed to create invalidation");
  }

  console.log(`✅ Invalidation created: ${invalidationId}`);
  return invalidationId;
}

async function waitForInvalidation(
  distributionId: string,
  invalidationId: string
): Promise<void> {
  console.log(`⏳ Waiting for invalidation to complete...`);

  const cfClient = new CloudFrontClient({ region: REGION });
  const maxAttempts = 60; // 5 minutes max (60 * 5 seconds)
  let attempts = 0;

  while (attempts < maxAttempts) {
    const response = await cfClient.send(
      new GetInvalidationCommand({
        DistributionId: distributionId,
        Id: invalidationId,
      })
    );

    const status = response.Invalidation?.Status;
    process.stdout.write(
      `\r⏳ Invalidation status: ${status} (${attempts * 5}s elapsed)`
    );

    if (status === "Completed") {
      console.log("\n✅ Invalidation completed!");
      return;
    }

    // Wait 5 seconds before checking again
    await new Promise((resolve) => setTimeout(resolve, 5000));
    attempts++;
  }

  throw new Error("Invalidation timed out after 5 minutes");
}

async function main() {
  const stage = process.argv[2] || "dev";

  console.log(`\n🚀 Deploying frontend for stage: ${stage}\n`);

  try {
    // Get config from env
    const { bucketName, distributionId } = getDeployConfig(stage);
    console.log(`📋 Using bucket: ${bucketName}`);
    console.log(`📋 Using distribution: ${distributionId}\n`);

    // Build frontend
    await buildFrontend(stage);

    // Upload to S3
    await uploadToS3(bucketName);

    // Invalidate CloudFront
    const invalidationId = await invalidateCloudFront(distributionId);

    // Wait for invalidation to complete
    await waitForInvalidation(distributionId, invalidationId);

    console.log(`\n🎉 Frontend deployment completed successfully!\n`);
    process.exit(0);
  } catch (error) {
    console.error(
      `\n❌ Deployment failed: ${error instanceof Error ? error.message : "Unknown error"}\n`
    );
    process.exit(1);
  }
}

main();
