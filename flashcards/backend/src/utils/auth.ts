import { APIGatewayProxyEvent } from "aws-lambda";
import { CognitoJwtVerifier } from "aws-jwt-verify";

const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.COGNITO_USER_POOL_ID || "",
  tokenUse: "access",
  clientId: process.env.COGNITO_CLIENT_ID || "",
});

export const verifyToken = async (
  event: APIGatewayProxyEvent,
): Promise<string> => {
  const token = event.headers.Authorization?.split(" ")[1];

  if (!token) {
    throw new Error("No authorization token provided");
  }

  try {
    const payload = await verifier.verify(token);

    return payload.sub;
  } catch {
    throw new Error("Invalid token");
  }
};
