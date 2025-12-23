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
    const decks = JSON.parse(event.body || "[]");

    if (!Array.isArray(decks)) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          message: "Invalid request body - expected array of decks",
        }),
      };
    }

    // Process each deck in sequence
    for (const deck of decks) {
      const timestamp = Date.now();
      const createdAt = deck.createdAt || timestamp;

      await ddb.put({
        TableName: TABLE_NAME,
        Item: {
          ...deck,
          userId,
          lastModified: timestamp,
          // Store as ISO string for GSI compatibility (GSI key is String type)
          createdAt:
            typeof createdAt === "number"
              ? new Date(createdAt).toISOString()
              : createdAt,
          // Store as string for GSI compatibility (PublicDecksIndex uses isPublic as HASH key with String type)
          isPublic: deck.isPublic ? "true" : "false",
        },
      });
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: "Sync completed successfully" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        message: "Failed to sync decks",
        error: process.env.STAGE === "dev" ? String(error) : undefined,
      }),
    };
  }
};
