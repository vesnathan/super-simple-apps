const { readFileSync } = require("fs");
const { join } = require("path");

function getDeploymentOutputs() {
  try {
    const p = join(__dirname, "../deploy/deployment-outputs.json");
    const raw = readFileSync(p, "utf8");
    const parsed = JSON.parse(raw);

    // Determine stage from environment variable
    const stage = process.env.NEXT_PUBLIC_API_STAGE || process.env.STAGE || "dev";

    // Get outputs for the stage
    const outputs = parsed.stages?.[stage]?.outputs || {};

    // Get AdSense config (stored at root level, not per-stage)
    const adsense = parsed.adsense || {};

    // IMPORTANT: Prioritize deployment-outputs.json over .env files
    // This ensures we always use the correct deployed infrastructure URLs
    return {
      NEXT_PUBLIC_GRAPHQL_URL: outputs.AppSyncApiUrl || process.env.NEXT_PUBLIC_GRAPHQL_URL || "",
      NEXT_PUBLIC_API_STAGE: stage,
      NEXT_PUBLIC_COGNITO_USER_POOL_ID:
        outputs.UserPoolId || process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || "",
      NEXT_PUBLIC_COGNITO_CLIENT_ID:
        outputs.UserPoolClientId || process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || "",
      NEXT_PUBLIC_IDENTITY_POOL_ID:
        outputs.IdentityPoolId || process.env.NEXT_PUBLIC_IDENTITY_POOL_ID || "",
      NEXT_PUBLIC_COGNITO_REGION:
        process.env.NEXT_PUBLIC_COGNITO_REGION || "ap-southeast-2",
      // Contact API endpoint
      NEXT_PUBLIC_CONTACT_API_URL:
        outputs.ContactApiEndpoint || process.env.NEXT_PUBLIC_CONTACT_API_URL || "",
      // AdSense configuration
      NEXT_PUBLIC_ADSENSE_CLIENT:
        adsense.client || process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "",
      NEXT_PUBLIC_ADSENSE_SLOT:
        adsense.slot || process.env.NEXT_PUBLIC_ADSENSE_SLOT || "",
      NEXT_PUBLIC_ADSENSE_ENABLED:
        adsense.enabled !== undefined
          ? String(adsense.enabled)
          : process.env.NEXT_PUBLIC_ADSENSE_ENABLED || "false",
    };
  } catch (e) {
    // Fallback to process.env when deployment-outputs.json doesn't exist
    return {
      NEXT_PUBLIC_GRAPHQL_URL: process.env.NEXT_PUBLIC_GRAPHQL_URL || "",
      NEXT_PUBLIC_API_STAGE: process.env.NEXT_PUBLIC_API_STAGE || "dev",
      NEXT_PUBLIC_COGNITO_USER_POOL_ID:
        process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || "",
      NEXT_PUBLIC_COGNITO_CLIENT_ID:
        process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || "",
      NEXT_PUBLIC_IDENTITY_POOL_ID:
        process.env.NEXT_PUBLIC_IDENTITY_POOL_ID || "",
      NEXT_PUBLIC_COGNITO_REGION:
        process.env.NEXT_PUBLIC_COGNITO_REGION || "ap-southeast-2",
      // Contact API endpoint
      NEXT_PUBLIC_CONTACT_API_URL: process.env.NEXT_PUBLIC_CONTACT_API_URL || "",
      // AdSense configuration
      NEXT_PUBLIC_ADSENSE_CLIENT: process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "",
      NEXT_PUBLIC_ADSENSE_SLOT: process.env.NEXT_PUBLIC_ADSENSE_SLOT || "",
      NEXT_PUBLIC_ADSENSE_ENABLED: process.env.NEXT_PUBLIC_ADSENSE_ENABLED || "false",
    };
  }
}

const deploymentEnvs = getDeploymentOutputs();

// Fail loudly in non-development when required NEXT_PUBLIC vars are missing
function assertRequiredDeploymentEnvs(envs) {
  const required = [
    "NEXT_PUBLIC_GRAPHQL_URL",
    "NEXT_PUBLIC_COGNITO_USER_POOL_ID",
    "NEXT_PUBLIC_COGNITO_CLIENT_ID",
    "NEXT_PUBLIC_IDENTITY_POOL_ID",
  ];
  const missing = required.filter((k) => !envs[k]);

  // Skip validation during lint, test, or in development
  const isLinting =
    process.env.npm_lifecycle_event === "lint" || process.argv.includes("lint");
  const isTesting =
    process.env.NODE_ENV === "test" ||
    process.env.npm_lifecycle_event === "test" ||
    process.argv.includes("jest");

  if (
    missing.length > 0 &&
    process.env.NODE_ENV !== "development" &&
    !isLinting &&
    !isTesting
  ) {
    throw new Error(
      `Missing required deployment envs: ${missing.join(", ")}. ` +
      `Run 'yarn deploy:dev' to populate deployment-outputs.json.`
    );
  }
}

// Assert required envs (skip during lint and test)
const isLinting =
  process.env.npm_lifecycle_event === "lint" || process.argv.includes("lint");
const isTesting =
  process.env.NODE_ENV === "test" ||
  process.env.npm_lifecycle_event === "test" ||
  process.argv.includes("jest");

if (!isLinting && !isTesting) {
  assertRequiredDeploymentEnvs(deploymentEnvs);
}

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
