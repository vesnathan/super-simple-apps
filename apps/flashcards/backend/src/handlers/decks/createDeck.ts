/* eslint-disable no-console */
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
    const deck = JSON.parse(event.body || "{}");

    if (!deck.title) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ message: "Deck title is required" }),
      };
    }

    const timestamp = Date.now();
    const newDeck = {
      ...deck,
      userId,
      // Store as ISO string for GSI compatibility (GSI key is String type)
      createdAt: new Date(timestamp).toISOString(),
      lastModified: timestamp,
      cards: deck.cards || [],
      // Store as string for GSI compatibility (PublicDecksIndex uses isPublic as HASH key with String type)
      isPublic: deck.isPublic ? "true" : "false",
    };

    await ddb.put({
      TableName: TABLE_NAME,
      Item: newDeck,
    });

    return {
      statusCode: 201,
      headers: corsHeaders,
      body: JSON.stringify(newDeck),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        message: "Failed to create deck",
        error: process.env.STAGE === "dev" ? String(error) : undefined,
      }),
    };
  }
};
