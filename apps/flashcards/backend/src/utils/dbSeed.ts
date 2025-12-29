/* eslint-disable no-console */
/**
 * Database seed utilities for populating DynamoDB with sample flashcard decks
 *
 * Note: cardCount is computed by a field resolver from cards.length,
 * so we don't store it in DynamoDB.
 */
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import * as dotenv from "dotenv";
import * as path from "path";

// Load .env from project root
dotenv.config({ path: path.resolve(__dirname, "../../../../.env") });

// Import all decks from the modular structure
import { allDecks } from "../data/decks";
import type { SeedDeck } from "../data/decks";

// Get stage from environment or default to prod
const STAGE = process.env.STAGE || "prod";
const TABLE_NAME = `flashcards-${STAGE}-data`;

const ddb = DynamoDBDocument.from(
  new DynamoDBClient({
    region: "ap-southeast-2",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
  }),
);

export async function seedDatabase() {
  try {
    console.log(`Seeding ${allDecks.length} decks to table: ${TABLE_NAME}`);
    console.log("");

    let totalCards = 0;

    for (const deck of allDecks) {
      try {
        // Build the DynamoDB item with proper key structure
        const item = {
          // Primary key
          PK: `DECK#${deck.id}`,
          SK: `DECK#${deck.id}`,
          // GSI1 for user queries (USER#userId -> DECK#createdAt)
          GSI1PK: `USER#${deck.userId}`,
          GSI1SK: `DECK#${deck.createdAt}`,
          // GSI2 for public deck queries (PUBLIC -> DECK#createdAt)
          ...(deck.isPublic === "true" && {
            GSI2PK: "PUBLIC",
            GSI2SK: `DECK#${deck.createdAt}`,
          }),
          // Data fields
          id: deck.id,
          userId: deck.userId,
          title: deck.title,
          description: deck.description,
          isPublic: deck.isPublic,
          createdAt: deck.createdAt,
          lastModified: deck.lastModified,
          cards: deck.cards,
        };

        await ddb.put({
          TableName: TABLE_NAME,
          Item: item,
        });

        totalCards += deck.cards.length;
        console.log(`✓ ${deck.title} (${deck.cards.length} cards)`);
      } catch (err: unknown) {
        console.error(`✗ Error adding deck "${deck.title}":`, err);
        throw err;
      }
    }

    console.log("");
    console.log(`✓ Database seeded successfully!`);
    console.log(`  Total: ${allDecks.length} decks, ${totalCards} cards`);
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}
