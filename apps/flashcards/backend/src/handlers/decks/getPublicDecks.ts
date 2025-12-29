import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";

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
    // Use the GSI for efficient querying of public decks
    // isPublic is stored as String "true"/"false" to match GSI key type
    const result = await ddb.query({
      TableName: TABLE_NAME,
      IndexName: "PublicDecksIndex",
      KeyConditionExpression: "isPublic = :isPublic",
      ExpressionAttributeValues: { ":isPublic": "true" },
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
        message: "Failed to fetch public decks",
        error: process.env.STAGE === "dev" ? String(error) : undefined,
      }),
    };
  }
};
