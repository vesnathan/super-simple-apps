import { ResourcesConfig } from "aws-amplify";
import { env } from "./env";

export const amplifyConfig: ResourcesConfig = {
  Auth: {
    Cognito: {
      userPoolId: env.auth.userPoolId,
      userPoolClientId: env.auth.clientId,
      identityPoolId: env.auth.identityPoolId,
      allowGuestAccess: true,
    },
  },
};
