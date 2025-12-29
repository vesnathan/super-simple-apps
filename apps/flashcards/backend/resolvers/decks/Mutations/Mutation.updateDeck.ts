import { Context, util } from "@aws-appsync/utils";
import { Deck } from "@simple-flashcards/shared";

interface UpdateDeckInput {
  title?: string;
  isPublic?: boolean;
}

type CTX = Context<{
  deckId: string;
  input: UpdateDeckInput;
}>;

export function request(ctx: CTX) {
  const userId = ctx.identity?.sub;

  if (!userId) {
    return util.error("Unauthorized", "UnauthorizedException");
  }

  const { deckId, input } = ctx.args;

  if (!deckId) {
    return util.error("deckId is required", "ValidationException");
  }

  if (input.title === undefined && input.isPublic === undefined) {
    return util.error("At least one field must be provided to update", "ValidationException");
  }

  // Store userId for condition expression
  ctx.stash.userId = userId;

  // Build update expression dynamically
  const expressionNames: Record<string, string> = {};
  const expressionValues: Record<string, unknown> = {};
  const updateParts: string[] = [];

  if (input.title !== undefined) {
    expressionNames["#title"] = "title";
    expressionValues[":title"] = input.title;
    updateParts.push("#title = :title");
  }

  if (input.isPublic !== undefined) {
    expressionNames["#isPublic"] = "isPublic";
    // Store as string "true"/"false" for DynamoDB GSI compatibility
    expressionValues[":isPublic"] = input.isPublic ? "true" : "false";
    updateParts.push("#isPublic = :isPublic");

    // Update GSI2 attributes for public decks index
    if (input.isPublic) {
      expressionNames["#GSI2PK"] = "GSI2PK";
      expressionNames["#GSI2SK"] = "GSI2SK";
      expressionValues[":GSI2PK"] = "PUBLIC";
      // Use current time for GSI2SK since we don't have createdAt here
      expressionValues[":GSI2SK"] = `DECK#${util.time.nowISO8601()}`;
      updateParts.push("#GSI2PK = :GSI2PK");
      updateParts.push("#GSI2SK = :GSI2SK");
    }
    // Note: Removing GSI2 attributes when making private requires REMOVE clause
    // which would need different handling - for now, public→private won't remove from GSI2
  }

  // Always update lastModified
  expressionNames["#lastModified"] = "lastModified";
  expressionValues[":lastModified"] = util.time.nowEpochMilliSeconds();
  updateParts.push("#lastModified = :lastModified");

  // Add condition to verify ownership
  expressionValues[":userId"] = userId;

  return {
    operation: "UpdateItem",
    key: util.dynamodb.toMapValues({
      PK: `DECK#${deckId}`,
      SK: `DECK#${deckId}`,
    }),
    update: {
      expression: `SET ${updateParts.join(", ")}`,
      expressionNames,
      expressionValues: util.dynamodb.toMapValues(expressionValues),
    },
    condition: {
      expression: "userId = :userId",
      expressionValues: util.dynamodb.toMapValues({ ":userId": userId }),
    },
  };
}

export function response(ctx: CTX): Deck {
  if (ctx.error) {
    // Check for condition failure (unauthorized)
    if (ctx.error.type === "DynamoDB:ConditionalCheckFailedException") {
      return util.error("Deck not found or you don't have permission to edit it", "UnauthorizedException");
    }
    return util.error(ctx.error.message, ctx.error.type);
  }

  const deck = ctx.result;

  if (!deck) {
    return util.error("Deck not found", "NotFoundException");
  }

  // Return deck with isPublic as boolean
  return {
    ...deck,
    isPublic: deck.isPublic === "true",
  } as Deck;
}
