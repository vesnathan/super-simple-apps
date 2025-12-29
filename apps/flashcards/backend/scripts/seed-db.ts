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
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { STSClient, AssumeRoleCommand } from "@aws-sdk/client-sts";

import { allDecks, type SeedDeck } from "../src/data/decks";

// System user ID for public sample decks
const SYSTEM_USER_ID = "system";

// Configuration from environment
const REGION = process.env.AWS_REGION || "ap-southeast-2";
const TABLE_NAME = process.env.TABLE_NAME;
const STAGE = process.env.STAGE || "dev";
const SEED_ROLE_ARN = process.env.SEED_ROLE_ARN;
const SEED_EXTERNAL_ID = process.env.SEED_EXTERNAL_ID;

if (!TABLE_NAME) {
  console.error("ERROR: TABLE_NAME environment variable is required");
  process.exit(1);
}

/**
 * Get DynamoDB client, optionally using assumed role credentials
 */
async function getDynamoDBClient(): Promise<DynamoDBDocumentClient> {
  let ddbClient: DynamoDBClient;

  if (SEED_ROLE_ARN) {
    console.log(`Assuming seed role: ${SEED_ROLE_ARN}`);
    const stsClient = new STSClient({ region: REGION });

    const assumeRoleResponse = await stsClient.send(
      new AssumeRoleCommand({
        RoleArn: SEED_ROLE_ARN,
        RoleSessionName: "flashcards-seed-session",
        ExternalId: SEED_EXTERNAL_ID,
        DurationSeconds: 900, // 15 minutes
      })
    );

    const credentials = assumeRoleResponse.Credentials;
    if (!credentials?.AccessKeyId || !credentials?.SecretAccessKey || !credentials?.SessionToken) {
      throw new Error("Failed to get credentials from assumed role");
    }

    ddbClient = new DynamoDBClient({
      region: REGION,
      credentials: {
        accessKeyId: credentials.AccessKeyId,
        secretAccessKey: credentials.SecretAccessKey,
        sessionToken: credentials.SessionToken,
      },
    });
    console.log("Successfully assumed seed role");
  } else {
    ddbClient = new DynamoDBClient({ region: REGION });
  }

  return DynamoDBDocumentClient.from(ddbClient);
}

// Will be initialized in main
let docClient: DynamoDBDocumentClient;

/**
 * Delete all existing system decks
 */
async function deleteSystemDecks(): Promise<number> {
  console.log("Deleting existing system decks...");
  let deletedCount = 0;
  let lastEvaluatedKey: Record<string, unknown> | undefined;

  do {
    const result = await docClient.send(
      new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": { S: SYSTEM_USER_ID },
        },
        ProjectionExpression: "PK, SK",
        ExclusiveStartKey: lastEvaluatedKey as Record<string, { S?: string; N?: string }> | undefined,
      })
    );

    if (result.Items && result.Items.length > 0) {
      for (const item of result.Items) {
        const pk = item.PK?.S;
        const sk = item.SK?.S;
        if (pk && sk) {
          await docClient.send(
            new DeleteCommand({
              TableName: TABLE_NAME!,
              Key: { PK: pk, SK: sk },
            })
          );
          deletedCount++;
        }
      }
    }

    lastEvaluatedKey = result.LastEvaluatedKey as Record<string, unknown> | undefined;
  } while (lastEvaluatedKey);

  console.log(`  Deleted ${deletedCount} existing system deck(s)`);
  return deletedCount;
}

/**
 * Generate searchText field for full-text search
 * Combines title, description, and tags into a lowercase string
 * Also adds spelling variations (license/licence) for better search
 */
function generateSearchText(deck: SeedDeck): string {
  const parts: string[] = [
    deck.title,
    deck.description || "",
    ...(deck.tags || []).map((tag) => tag.replace(/-/g, " ")),
  ];
  let text = parts.join(" ").toLowerCase();

  // Add spelling variations for common terms
  if (text.includes("license")) {
    text += " licence"; // British spelling
  }
  if (text.includes("licence")) {
    text += " license"; // American spelling
  }

  return text;
}

/**
 * Transform a deck for DynamoDB storage
 * Uses single-table design with PK/SK pattern
 */
function transformDeckForDB(deck: SeedDeck): Record<string, unknown> {
  return {
    PK: `DECK#${deck.id}`,
    SK: `DECK#${deck.id}`,
    id: deck.id,
    userId: deck.userId,
    title: deck.title,
    description: deck.description,
    tags: deck.tags,
    cards: deck.cards,
    isPublic: "true", // Store as string for GSI querying
    createdAt: deck.createdAt,
    lastModified: deck.lastModified,
    views: deck.views, // Include views for popular decks sorting
    searchText: generateSearchText(deck), // For full-text search
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

  // Initialize DynamoDB client (with assumed role if available)
  docClient = await getDynamoDBClient();

  // Always delete existing system decks first to ensure clean state
  console.log("Deleting any existing system decks before seeding...");
  await deleteSystemDecks();
  console.log("");

  // Transform and insert decks
  console.log(`Creating ${allDecks.length} public deck(s)...`);
  const deckItems = allDecks.map(transformDeckForDB);
  await batchInsertItems(deckItems, "Public Decks");

  // Summary
  const totalCards = allDecks.reduce((sum, d) => sum + d.cards.length, 0);
  console.log("");
  console.log("Seeding complete!");
  console.log(`  Decks: ${allDecks.length}`);
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
