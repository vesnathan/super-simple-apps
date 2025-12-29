// Environment configuration for Invoice
// Uses shared Cognito user pool from Super Simple Apps

export const env = {
  auth: {
    region: process.env.NEXT_PUBLIC_COGNITO_REGION || "ap-southeast-2",
    userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || "ap-southeast-2_8DuTrT3yi",
    clientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || "16s1f2187tqikp7lvn8tqcubcv",
    identityPoolId: process.env.NEXT_PUBLIC_IDENTITY_POOL_ID || "ap-southeast-2:e5812b93-8202-454e-acb6-0b2b04f1ce67",
  },
  api: {
    graphqlEndpoint: process.env.NEXT_PUBLIC_APPSYNC_GRAPHQL_ENDPOINT || "",
    region: process.env.NEXT_PUBLIC_AWS_REGION || "ap-southeast-2",
  },
  dynamodb: {
    tableName: process.env.NEXT_PUBLIC_DYNAMODB_TABLE || "super-simple-apps-business-prod",
    region: process.env.NEXT_PUBLIC_AWS_REGION || "ap-southeast-2",
  },
};
