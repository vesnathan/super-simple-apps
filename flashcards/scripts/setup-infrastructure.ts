#!/usr/bin/env ts-node

/**
 * Setup S3 and CloudFront infrastructure for frontend hosting
 *
 * Usage: npx ts-node scripts/setup-infrastructure.ts [stage]
 * Example: npx ts-node scripts/setup-infrastructure.ts dev
 */

import {
  S3Client,
  CreateBucketCommand,
  PutBucketPolicyCommand,
  PutPublicAccessBlockCommand,
  DeletePublicAccessBlockCommand,
  HeadBucketCommand,
} from "@aws-sdk/client-s3";
import {
  CloudFrontClient,
  CreateDistributionCommand,
  CreateFunctionCommand,
  DescribeFunctionCommand,
  PublishFunctionCommand,
  FunctionRuntime,
} from "@aws-sdk/client-cloudfront";
import { join } from "path";
import { config } from "dotenv";
import { appendFileSync } from "fs";

// Load environment variables
config({ path: join(__dirname, "../.env") });

const REGION = "ap-southeast-2";
const APP_NAME = "simple-flashcards";

const s3Client = new S3Client({ region: REGION });
const cfClient = new CloudFrontClient({ region: REGION });

async function bucketExists(bucketName: string): Promise<boolean> {
  try {
    await s3Client.send(new HeadBucketCommand({ Bucket: bucketName }));
    return true;
  } catch {
    return false;
  }
}

async function createS3Bucket(stage: string): Promise<string> {
  const bucketName = `${APP_NAME}-frontend-${stage}`;

  console.log(`\n📦 Creating S3 bucket: ${bucketName}...`);

  // Check if bucket already exists
  if (await bucketExists(bucketName)) {
    console.log(`✅ Bucket ${bucketName} already exists`);
    return bucketName;
  }

  // Create bucket
  await s3Client.send(
    new CreateBucketCommand({
      Bucket: bucketName,
      CreateBucketConfiguration: {
        LocationConstraint: REGION,
      },
    })
  );
  console.log(`✅ Bucket created: ${bucketName}`);

  // Remove public access block to allow public reads
  console.log(`🔓 Configuring public access...`);
  await s3Client.send(
    new DeletePublicAccessBlockCommand({
      Bucket: bucketName,
    })
  );

  // Add bucket policy for public read access
  const bucketPolicy = {
    Version: "2012-10-17",
    Statement: [
      {
        Sid: "PublicReadGetObject",
        Effect: "Allow",
        Principal: "*",
        Action: "s3:GetObject",
        Resource: `arn:aws:s3:::${bucketName}/*`,
      },
    ],
  };

  await s3Client.send(
    new PutBucketPolicyCommand({
      Bucket: bucketName,
      Policy: JSON.stringify(bucketPolicy),
    })
  );
  console.log(`✅ Bucket policy configured for public read access`);

  return bucketName;
}

async function createCloudFrontFunction(stage: string): Promise<string> {
  const functionName = `${APP_NAME}-spa-router-${stage}`;

  console.log(`\n⚡ Creating CloudFront function: ${functionName}...`);

  // SPA routing function code
  const functionCode = `
function handler(event) {
  var request = event.request;
  var uri = request.uri;

  // If URI ends with /, append index.html
  if (uri.endsWith('/')) {
    request.uri += 'index.html';
  }
  // If URI doesn't have an extension, assume it's a route and serve index.html
  else if (!uri.includes('.')) {
    request.uri = '/index.html';
  }

  return request;
}
`;

  try {
    // Check if function exists
    await cfClient.send(
      new DescribeFunctionCommand({ Name: functionName })
    );
    console.log(`✅ CloudFront function ${functionName} already exists`);
    return functionName;
  } catch {
    // Create function
    const createResponse = await cfClient.send(
      new CreateFunctionCommand({
        Name: functionName,
        FunctionConfig: {
          Comment: `SPA routing for ${APP_NAME} ${stage}`,
          Runtime: FunctionRuntime.cloudfront_js_2_0,
        },
        FunctionCode: Buffer.from(functionCode.trim()),
      })
    );

    // Publish function
    await cfClient.send(
      new PublishFunctionCommand({
        Name: functionName,
        IfMatch: createResponse.ETag!,
      })
    );

    console.log(`✅ CloudFront function created and published`);
    return functionName;
  }
}

async function createCloudFrontDistribution(
  bucketName: string,
  functionName: string,
  stage: string
): Promise<{ distributionId: string; domainName: string }> {
  console.log(`\n🌐 Creating CloudFront distribution...`);

  const originId = `S3-${bucketName}`;
  const bucketDomainName = `${bucketName}.s3.${REGION}.amazonaws.com`;

  // Get function ARN
  const functionResponse = await cfClient.send(
    new DescribeFunctionCommand({ Name: functionName, Stage: "LIVE" })
  );
  const functionArn = functionResponse.FunctionSummary?.FunctionMetadata?.FunctionARN;

  const response = await cfClient.send(
    new CreateDistributionCommand({
      DistributionConfig: {
        CallerReference: `${APP_NAME}-${stage}-${Date.now()}`,
        Comment: `${APP_NAME} ${stage} frontend distribution`,
        Enabled: true,
        DefaultRootObject: "index.html",
        HttpVersion: "http2",
        PriceClass: "PriceClass_All",
        Origins: {
          Quantity: 1,
          Items: [
            {
              Id: originId,
              DomainName: bucketDomainName,
              S3OriginConfig: {
                OriginAccessIdentity: "",
              },
            },
          ],
        },
        DefaultCacheBehavior: {
          TargetOriginId: originId,
          ViewerProtocolPolicy: "redirect-to-https",
          AllowedMethods: {
            Quantity: 2,
            Items: ["GET", "HEAD"],
            CachedMethods: {
              Quantity: 2,
              Items: ["GET", "HEAD"],
            },
          },
          CachePolicyId: "658327ea-f89d-4fab-a63d-7e88639e58f6", // CachingOptimized
          Compress: true,
          FunctionAssociations: functionArn
            ? {
                Quantity: 1,
                Items: [
                  {
                    EventType: "viewer-request",
                    FunctionARN: functionArn,
                  },
                ],
              }
            : { Quantity: 0, Items: [] },
        },
        CustomErrorResponses: {
          Quantity: 2,
          Items: [
            {
              ErrorCode: 403,
              ResponsePagePath: "/index.html",
              ResponseCode: "200",
              ErrorCachingMinTTL: 10,
            },
            {
              ErrorCode: 404,
              ResponsePagePath: "/index.html",
              ResponseCode: "200",
              ErrorCachingMinTTL: 10,
            },
          ],
        },
      },
    })
  );

  const distributionId = response.Distribution?.Id!;
  const domainName = response.Distribution?.DomainName!;

  console.log(`✅ CloudFront distribution created!`);
  console.log(`   Distribution ID: ${distributionId}`);
  console.log(`   Domain Name: ${domainName}`);

  return { distributionId, domainName };
}

function updateEnvFile(
  stage: string,
  bucketName: string,
  distributionId: string,
  domainName: string
) {
  console.log(`\n📝 Updating .env file...`);

  const envPath = join(__dirname, "../.env");
  const suffix = stage === "prod" ? "_PROD" : "_DEV";

  const envContent = `
# ${stage.toUpperCase()} Frontend Infrastructure (auto-generated)
S3_BUCKET${suffix}=${bucketName}
CLOUDFRONT_DISTRIBUTION_ID${suffix}=${distributionId}
CLOUDFRONT_DOMAIN${suffix}=${domainName}
`;

  appendFileSync(envPath, envContent);
  console.log(`✅ Environment variables added to .env`);
}

async function main() {
  const stage = process.argv[2] || "dev";

  console.log(`\n🚀 Setting up infrastructure for stage: ${stage}`);
  console.log(`   Region: ${REGION}`);
  console.log(`   App: ${APP_NAME}\n`);

  try {
    // Create S3 bucket
    const bucketName = await createS3Bucket(stage);

    // Create CloudFront function for SPA routing
    const functionName = await createCloudFrontFunction(stage);

    // Create CloudFront distribution
    const { distributionId, domainName } = await createCloudFrontDistribution(
      bucketName,
      functionName,
      stage
    );

    // Update .env file
    updateEnvFile(stage, bucketName, distributionId, domainName);

    console.log(`\n🎉 Infrastructure setup complete!\n`);
    console.log(`Your frontend will be available at:`);
    console.log(`   https://${domainName}\n`);
    console.log(`Note: CloudFront distribution may take 5-10 minutes to deploy.\n`);
    console.log(`Next steps:`);
    console.log(`   1. Wait for CloudFront to finish deploying`);
    console.log(`   2. Run: yarn deploy:fe:${stage}\n`);

    process.exit(0);
  } catch (error) {
    console.error(
      `\n❌ Setup failed: ${error instanceof Error ? error.message : "Unknown error"}\n`
    );
    if (error instanceof Error && error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

main();
