#!/usr/bin/env ts-node

/**
 * Seed script for Simple Flashcards
 * Populates DynamoDB with sample public decks
 *
 * Usage:
 *   TABLE_NAME=... AWS_REGION=... tsx backend/scripts/seed-db.ts
 *
 * Or via deploy script which sets env vars automatically
 */

import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  BatchWriteCommand,
} from "@aws-sdk/lib-dynamodb";

import { SEED_DECKS, SYSTEM_USER_ID } from "../../shared/src/data/seed-data";

// Configuration from environment
const REGION = process.env.AWS_REGION || "ap-southeast-2";
const TABLE_NAME = process.env.TABLE_NAME;
const STAGE = process.env.STAGE || "dev";
const FORCE_RESEED = process.argv.includes("--force");

if (!TABLE_NAME) {
  console.error("ERROR: TABLE_NAME environment variable is required");
  process.exit(1);
}

// Initialize DynamoDB client
const ddbClient = new DynamoDBClient({ region: REGION });
const docClient = DynamoDBDocumentClient.from(ddbClient);

/**
 * Check if table already has seed data
 */
async function hasSeedData(): Promise<boolean> {
  try {
    const result = await ddbClient.send(
      new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": { S: SYSTEM_USER_ID },
        },
        Limit: 1,
      })
    );
    return (result.Count ?? 0) > 0;
  } catch (error) {
    console.warn("Could not check for existing seed data:", error);
    return false;
  }
}

/**
 * Transform a deck for DynamoDB storage
 * Uses single-table design with PK/SK pattern
 */
function transformDeckForDB(
  deck: (typeof SEED_DECKS)[number]
): Record<string, unknown> {
  return {
    PK: `DECK#${deck.id}`,
    SK: `DECK#${deck.id}`,
    id: deck.id,
    userId: deck.userId,
    title: deck.title,
    cards: deck.cards,
    isPublic: "true", // Store as string for GSI querying
    createdAt: deck.createdAt,
    lastModified: deck.lastModified,
    // GSI for user's decks
    GSI1PK: `USER#${deck.userId}`,
    GSI1SK: `DECK#${deck.createdAt}`,
    // GSI for public decks
    GSI2PK: "PUBLIC",
    GSI2SK: `DECK#${deck.createdAt}`,
  };
}

/**
 * Batch insert items into DynamoDB
 */
async function batchInsertItems(
  items: Record<string, unknown>[],
  description: string
): Promise<void> {
  const BATCH_SIZE = 25;
  const batches: Record<string, unknown>[][] = [];

  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    batches.push(items.slice(i, i + BATCH_SIZE));
  }

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    const writeRequests = batch.map((item) => ({
      PutRequest: { Item: item },
    }));

    await docClient.send(
      new BatchWriteCommand({
        RequestItems: {
          [TABLE_NAME!]: writeRequests,
        },
      })
    );

    console.log(
      `  ${description} (batch ${i + 1}/${batches.length}, ${batch.length} items)`
    );

    // Small delay between batches to avoid throttling
    if (i < batches.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
}

/**
 * Main seed function
 */
async function seedDatabase(): Promise<void> {
  console.log("");
  console.log("Simple Flashcards - Database Seeding");
  console.log("=====================================");
  console.log(`Region: ${REGION}`);
  console.log(`Table: ${TABLE_NAME}`);
  console.log(`Stage: ${STAGE}`);
  console.log("");

  // Check for existing seed data
  if (!FORCE_RESEED) {
    const hasData = await hasSeedData();
    if (hasData) {
      console.log("Seed data already exists. Use --force to reseed.");
      console.log("");
      return;
    }
  } else {
    console.log("Force mode: will insert seed data even if it exists");
    console.log("");
  }

  // Transform and insert decks
  console.log(`Creating ${SEED_DECKS.length} public deck(s)...`);
  const deckItems = SEED_DECKS.map(transformDeckForDB);
  await batchInsertItems(deckItems, "Public Decks");

  // Summary
  const totalCards = SEED_DECKS.reduce((sum, d) => sum + d.cards.length, 0);
  console.log("");
  console.log("Seeding complete!");
  console.log(`  Decks: ${SEED_DECKS.length}`);
  console.log(`  Total Cards: ${totalCards}`);
  console.log("");
}

// Run when executed directly
const isMainModule = process.argv[1]?.includes("seed-db");

if (isMainModule) {
  seedDatabase()
    .then(() => {
      console.log("Seeding completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Seeding failed:", error);
      process.exit(1);
    });
}

export { seedDatabase };
