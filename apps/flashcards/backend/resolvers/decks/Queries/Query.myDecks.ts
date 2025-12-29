import { Context, util } from "@aws-appsync/utils";
import { Deck } from "@simple-flashcards/shared";

type CTX = Context<Record<string, never>>;

export function request(ctx: CTX) {
  // Get userId from Cognito identity
  const userId = ctx.identity?.sub;

  if (!userId) {
    return util.error("Unauthorized", "UnauthorizedException");
  }

  // Query GSI1 for user's decks (GSI1PK = "USER#{userId}")
  return {
    operation: "Query",
    index: "GSI1",
    query: {
      expression: "GSI1PK = :pk",
      expressionValues: util.dynamodb.toMapValues({ ":pk": `USER#${userId}` }),
    },
    scanIndexForward: false, // Most recent first
  };
}

export function response(ctx: CTX): Deck[] {
  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type);
  }

  const items = ctx.result?.items ?? [];

  // Transform isPublic from string "true"/"false" to boolean
  return items.map((item: Record<string, unknown>) => ({
    ...item,
    isPublic: item.isPublic === "true",
  })) as Deck[];
}
