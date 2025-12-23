/* eslint-disable no-console */
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { APIGatewayClient } from "@aws-sdk/client-api-gateway";
import { LambdaClient } from "@aws-sdk/client-lambda";
import { CloudFrontClient } from "@aws-sdk/client-cloudfront";
import { CloudWatchLogsClient } from "@aws-sdk/client-cloudwatch-logs";

// Load env vars only for local development and deployment scripts
if (!process.env.LAMBDA_TASK_ROOT) {
  require("./env").loadEnv();
}

// Validate AWS_ACCOUNT_ID is set
if (!process.env.AWS_ACCOUNT_ID) {
  throw new Error("AWS_ACCOUNT_ID environment variable is required");
}

const region = "ap-southeast-2";
const clientConfig = {
  region,
};

export const dynamoDB = new DynamoDBClient(clientConfig);
export const apiGateway = new APIGatewayClient(clientConfig);
export const lambda = new LambdaClient(clientConfig);
export const cloudFront = new CloudFrontClient(clientConfig);
export const cloudWatchLogs = new CloudWatchLogsClient(clientConfig);

function validateEnv() {
  // Only validate in Lambda environment
  if (process.env.LAMBDA_TASK_ROOT) {
    const required = [
      "STAGE",
      "REGION",
      "DECKS_TABLE",
      "COGNITO_USER_POOL_ID",
      "COGNITO_CLIENT_ID",
    ];

    const missing = required.filter((key) => !process.env[key]);

    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variables in Lambda: ${missing.join(", ")}\nPlease check deployment configuration.`,
      );
    }
  }
}

validateEnv();

export const CONFIG = {
  STAGE: process.env.STAGE || "dev",
  REGION: process.env.REGION || "ap-southeast-2",
  AWS_ACCOUNT_ID: process.env.AWS_ACCOUNT_ID,
  DECKS_TABLE:
    process.env.DECKS_TABLE || `flashcards-${process.env.STAGE || "dev"}-decks`,
  COGNITO_USER_POOL_ID: process.env.COGNITO_USER_POOL_ID,
  COGNITO_CLIENT_ID: process.env.COGNITO_CLIENT_ID,
  APP_NAME: "simple-flashcards",
  LAMBDA_ROLE_ARN:
    process.env.LAMBDA_ROLE_ARN ||
    `arn:aws:iam::${process.env.AWS_ACCOUNT_ID}:role/flashcards-${process.env.STAGE || "dev"}`,
  COGNITO_AUTHORIZER_ID: process.env.COGNITO_AUTHORIZER_ID || "none",
}; // Removed 'as const' to make the object mutable
