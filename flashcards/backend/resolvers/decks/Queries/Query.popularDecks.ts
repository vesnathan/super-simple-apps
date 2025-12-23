import { Context, util } from "@aws-appsync/utils";
import { Deck } from "shared";

interface PopularDecksArgs {
  limit?: number;
}

type CTX = Context<PopularDecksArgs>;

export function request(ctx: CTX) {
  const limit = ctx.args.limit ?? 10;

  // Query GSI2 for public decks, then we'll sort by views in response
  // Note: For true popularity sorting, you'd need a GSI on views
  // For now, we fetch all public decks and sort client-side
  return {
    operation: "Query",
    index: "GSI2",
    query: {
      expression: "GSI2PK = :pk",
      expressionValues: util.dynamodb.toMapValues({ ":pk": "PUBLIC" }),
    },
    scanIndexForward: false,
    limit: 100, // Fetch more than needed to sort properly
  };
}

export function response(ctx: CTX): Deck[] {
  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type);
  }

  const limit = ctx.args.limit ?? 10;
  const items = ctx.result?.items ?? [];

  // Sort by views (descending) and take top N
  const sorted = items
    .sort((a: Record<string, unknown>, b: Record<string, unknown>) => {
      const viewsA = typeof a.views === "number" ? a.views : 0;
      const viewsB = typeof b.views === "number" ? b.views : 0;
      return viewsB - viewsA;
    })
    .slice(0, limit);

  // Transform isPublic from string "true"/"false" to boolean
  return sorted.map((item: Record<string, unknown>) => ({
    ...item,
    isPublic: item.isPublic === "true",
    views: typeof item.views === "number" ? item.views : 0,
  })) as Deck[];
}
