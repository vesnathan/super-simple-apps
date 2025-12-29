const fs = require("fs");
const path = require("path");

// Load deployment outputs if available
let deploymentOutputs = {};
const outputsPath = path.join(__dirname, "deploy/deployment-outputs.json");
if (fs.existsSync(outputsPath)) {
  try {
    deploymentOutputs = JSON.parse(fs.readFileSync(outputsPath, "utf8"));
  } catch (e) {
    console.warn("Failed to parse deployment-outputs.json:", e.message);
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  env: {
    // Auth - from deployment outputs or fallback to env vars
    NEXT_PUBLIC_USER_POOL_ID:
      deploymentOutputs.cognito?.UserPoolId || process.env.NEXT_PUBLIC_USER_POOL_ID || "",
    NEXT_PUBLIC_USER_POOL_CLIENT_ID:
      deploymentOutputs.cognito?.UserPoolClientId || process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID || "",
    NEXT_PUBLIC_IDENTITY_POOL_ID:
      deploymentOutputs.cognito?.IdentityPoolId || process.env.NEXT_PUBLIC_IDENTITY_POOL_ID || "",

    // API - from deployment outputs or fallback to env vars
    NEXT_PUBLIC_GRAPHQL_ENDPOINT:
      deploymentOutputs.appsync?.GraphQLApiUrl || process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "",
    NEXT_PUBLIC_API_REGION:
      deploymentOutputs.region || process.env.NEXT_PUBLIC_API_REGION || "ap-southeast-2",
  },
};

module.exports = nextConfig;
