// Environment configuration
// Values are injected at build time from deployment-outputs.json via next.config.js

export const env = {
  api: {
    graphqlUrl: process.env.NEXT_PUBLIC_GRAPHQL_URL || "",
    stage: process.env.NEXT_PUBLIC_API_STAGE || "dev",
  },
  auth: {
    region: process.env.NEXT_PUBLIC_COGNITO_REGION || "ap-southeast-2",
    userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || "",
    clientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || "",
    identityPoolId: process.env.NEXT_PUBLIC_IDENTITY_POOL_ID || "",
  },
  ads: {
    // Google AdSense Publisher ID (ca-pub-XXXXXXXXXX)
    adClient: process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "",
    // Default ad slot ID for the app
    adSlot: process.env.NEXT_PUBLIC_ADSENSE_SLOT || "",
    // Enable/disable ads (useful for dev mode)
    enabled: process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true",
  },
};
