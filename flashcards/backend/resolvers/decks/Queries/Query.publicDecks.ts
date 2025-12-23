import { Context, util } from "@aws-appsync/utils";
import { Deck } from "shared";

type CTX = Context<Record<string, never>>;

export function request(ctx: CTX) {
  // Query GSI2 for public decks (GSI2PK = "PUBLIC")
  return {
    operation: "Query",
    index: "GSI2",
    query: {
      expression: "GSI2PK = :pk",
      expressionValues: util.dynamodb.toMapValues({ ":pk": "PUBLIC" }),
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
