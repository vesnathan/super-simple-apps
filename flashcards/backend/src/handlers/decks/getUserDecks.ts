import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";

import { verifyToken } from "../../utils/auth";
import { corsHeaders } from "../../utils/cors";

const ddb = DynamoDBDocument.from(new DynamoDB({}));
const TABLE_NAME = process.env.DECKS_TABLE || "";

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: corsHeaders, body: "" };
  }

  try {
    const userId = await verifyToken(event);

    // Use UserDecksIndex GSI for efficient querying by userId
    const result = await ddb.query({
      TableName: TABLE_NAME,
      IndexName: "UserDecksIndex",
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: { ":userId": userId },
      ScanIndexForward: false, // Most recent first
    });

    // Convert isPublic from string to boolean for frontend compatibility
    const decks = (result.Items || []).map((item) => ({
      ...item,
      isPublic: item.isPublic === "true",
    }));

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(decks),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        message: "Failed to fetch user decks",
        error: process.env.STAGE === "dev" ? String(error) : undefined,
      }),
    };
  }
};
