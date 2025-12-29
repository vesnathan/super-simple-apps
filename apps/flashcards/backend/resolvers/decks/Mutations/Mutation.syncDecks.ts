import { Context, util } from "@aws-appsync/utils";
import { SyncDeckInput, SyncResult } from "@simple-flashcards/shared";

type CTX = Context<{ decks: SyncDeckInput[] }>;

export function request(ctx: CTX) {
  const userId = ctx.identity?.sub;

  if (!userId) {
    return util.error("Unauthorized", "UnauthorizedException");
  }

  const { decks } = ctx.args;

  if (!decks || !Array.isArray(decks)) {
    return util.error("Decks array is required", "ValidationException");
  }

  const now = util.time.nowISO8601();
  const timestamp = util.time.nowEpochMilliSeconds();

  // Build BatchPutItem request - items are directly in the array
  const putItems: unknown[] = [];

  for (const deck of decks) {
    const createdAt =
      typeof deck.createdAt === "string" ? deck.createdAt : now;
    const isPublicStr = deck.isPublic ? "true" : "false";

    const item: Record<string, unknown> = {
      // Primary key
      PK: `DECK#${deck.id}`,
      SK: `DECK#${deck.id}`,
      // Data attributes
      id: deck.id,
      userId, // Always use authenticated userId
      title: deck.title,
      cards: deck.cards || [],
      isPublic: isPublicStr,
      createdAt,
      lastModified: timestamp,
      // GSI1: User's decks
      GSI1PK: `USER#${userId}`,
      GSI1SK: `DECK#${createdAt}`,
    };

    // GSI2: Public decks (only set if public)
    if (deck.isPublic) {
      item.GSI2PK = "PUBLIC";
      item.GSI2SK = `DECK#${createdAt}`;
    }

    // For AppSync BatchPutItem, push the DynamoDB-formatted item directly
    putItems.push(util.dynamodb.toMapValues(item));
  }

  // Store deck count in stash for response
  ctx.stash.syncedCount = decks.length;

  return {
    operation: "BatchPutItem",
    tables: {
      // Table name will be injected by resolver compiler
      [ctx.env.TABLE_NAME]: putItems,
    },
  };
}

export function response(ctx: CTX): SyncResult {
  if (ctx.error) {
    return util.error(ctx.error.message, ctx.error.type);
  }

  return {
    success: true,
    syncedCount: ctx.stash.syncedCount as number,
  };
}
