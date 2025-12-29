import { env } from "./env";

export const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: env.auth.userPoolId,
      userPoolClientId: env.auth.clientId,
      identityPoolId: env.auth.identityPoolId,
      signUpVerificationMethod: "code" as const,
      loginWith: {
        email: true,
      },
    },
  },
  API: {
    GraphQL: {
      endpoint: env.api.graphqlEndpoint,
      region: env.api.region,
      defaultAuthMode: "userPool" as const,
    },
  },
};
