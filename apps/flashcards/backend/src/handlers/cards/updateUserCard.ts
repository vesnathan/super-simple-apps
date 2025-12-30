import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";

import { verifyToken } from "../../utils/auth";
import { corsHeaders } from "../../utils/cors";
import type { Card } from "../../data/decks/types";

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
    const { deckId, cardId } = event.pathParameters || {};
    const updates = JSON.parse(event.body || "{}");

    if (!deckId || !cardId) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ message: "Missing deckId or cardId" }),
      };
    }

    // Get existing deck
    const deck = await ddb.get({
      TableName: TABLE_NAME,
      Key: { id: deckId, userId },
    });

    if (!deck.Item) {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({ message: "Deck not found" }),
      };
    }

    // Find and update the specific card
    const updatedDeck = {
      ...deck.Item,
      cards: deck.Item.cards.map((card: Card) =>
        card.id === cardId ? { ...card, ...updates } : card,
      ),
      lastModified: Date.now(),
    };

    await ddb.put({
      TableName: TABLE_NAME,
      Item: updatedDeck,
    });

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(updatedDeck),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        message: "Failed to update card",
        error: process.env.STAGE === "dev" ? String(error) : undefined,
      }),
    };
  }
};
