import { Context, util } from "@aws-appsync/utils";
import { CreateDeckInput, Deck } from "@simple-flashcards/shared";

type CTX = Context<{ input: CreateDeckInput }>;

export function request(ctx: CTX) {
  const userId = ctx.identity?.sub;

  if (!userId) {
    return util.error("Unauthorized", "UnauthorizedException");
  }

  const { input } = ctx.args;

  if (!input.title) {
    return util.error("Title is required", "ValidationException");
  }

  const now = util.time.nowISO8601();
  const timestamp = util.time.nowEpochMilliSeconds();
  const isPublicStr = input.isPublic ? "true" : "false";

  const deck: Record<string, unknown> = {
    // Primary key
    PK: `DECK#${input.id}`,
    SK: `DECK#${input.id}`,
    // Data attributes
    id: input.id,
    userId,
    title: input.title,
    cards: input.cards || [],
    isPublic: isPublicStr,
    createdAt: now,
    lastModified: timestamp,
    // GSI1: User's decks
    GSI1PK: `USER#${userId}`,
    GSI1SK: `DECK#${now}`,
    // GSI2: Public decks (only set if public)
    ...(input.isPublic && {
      GSI2PK: "PUBLIC",
      GSI2SK: `DECK#${now}`,
    }),
  };

  return {
    operation: "PutItem",
    key: util.dynamodb.toMapValues({
      PK: deck.PK,
      SK: deck.SK,
    }),
    attributeValues: util.dynamodb.toMapValues(deck),
  };
}

export function response(ctx: CTX): Deck {
  if (ctx.error) {
    return util.error(ctx.error.message, ctx.error.type);
  }

  const result = ctx.result;

  // Transform isPublic back to boolean for response
  return {
    ...result,
    isPublic: result.isPublic === "true",
  } as Deck;
}
