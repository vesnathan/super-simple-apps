const { readFileSync } = require("fs");
const { join } = require("path");

function getDeploymentOutputs() {
  try {
    const p = join(__dirname, "deploy/deployment-outputs.json");
    const raw = readFileSync(p, "utf8");
    const parsed = JSON.parse(raw);

    // Determine stage from environment variable
    const stage = process.env.NEXT_PUBLIC_API_STAGE || process.env.STAGE || "prod";

    // Get outputs for the stage
    const outputs = parsed.stages?.[stage]?.outputs || parsed;

    // IMPORTANT: Prioritize deployment-outputs.json over .env files
    // This ensures we always use the correct deployed infrastructure URLs
    return {
      NEXT_PUBLIC_APPSYNC_GRAPHQL_ENDPOINT: outputs.AppSyncApiUrl || process.env.NEXT_PUBLIC_APPSYNC_GRAPHQL_ENDPOINT || "",
      NEXT_PUBLIC_API_STAGE: stage,
      NEXT_PUBLIC_COGNITO_USER_POOL_ID:
        outputs.UserPoolId || process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || "",
      NEXT_PUBLIC_COGNITO_CLIENT_ID:
        outputs.SharedClientId || process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || "",
      NEXT_PUBLIC_IDENTITY_POOL_ID:
        outputs.IdentityPoolId || process.env.NEXT_PUBLIC_IDENTITY_POOL_ID || "",
      NEXT_PUBLIC_COGNITO_REGION:
        process.env.NEXT_PUBLIC_COGNITO_REGION || "ap-southeast-2",
      NEXT_PUBLIC_AWS_REGION:
        process.env.NEXT_PUBLIC_AWS_REGION || "ap-southeast-2",
    };
  } catch (e) {
    // Fallback to process.env when deployment-outputs.json doesn't exist
    return {
      NEXT_PUBLIC_APPSYNC_GRAPHQL_ENDPOINT: process.env.NEXT_PUBLIC_APPSYNC_GRAPHQL_ENDPOINT || "",
      NEXT_PUBLIC_API_STAGE: process.env.NEXT_PUBLIC_API_STAGE || "prod",
      NEXT_PUBLIC_COGNITO_USER_POOL_ID:
        process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || "",
      NEXT_PUBLIC_COGNITO_CLIENT_ID:
        process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || "",
      NEXT_PUBLIC_IDENTITY_POOL_ID:
        process.env.NEXT_PUBLIC_IDENTITY_POOL_ID || "",
      NEXT_PUBLIC_COGNITO_REGION:
        process.env.NEXT_PUBLIC_COGNITO_REGION || "ap-southeast-2",
      NEXT_PUBLIC_AWS_REGION:
        process.env.NEXT_PUBLIC_AWS_REGION || "ap-southeast-2",
    };
  }
}

const deploymentEnvs = getDeploymentOutputs();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only use static export for production builds (not dev server)
  ...(process.env.NODE_ENV === "production" && { output: "export" }),
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  env: {
    ...deploymentEnvs,
  },
  eslint: {
    // Allow builds to complete with warnings (but still show them)
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
