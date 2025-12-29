import { Context, util } from "@aws-appsync/utils";
import { Deck } from "@simple-flashcards/shared";

interface PopularDecksArgs {
  limit?: number;
}

type CTX = Context<PopularDecksArgs>;

export function request(ctx: CTX) {
  // Query GSI2 for public decks, then we'll sort by views in response
  // Note: For true popularity sorting, you'd need a GSI on views
  // For now, we fetch all public decks and sort in response
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

  // AppSync doesn't support:
  // - .sort() with callbacks (arrow or function)
  // - .map() with callbacks
  // - traditional for loops (for (let i = 0; ...))
  // - while loops
  // ONLY for...of loops are allowed

  // Simple selection approach: find max N times using for...of
  // This is O(n*limit) but works within AppSync constraints
  const used: Record<string, boolean> = {};
  const result: Record<string, unknown>[] = [];
  let resultCount = 0;

  // Find the top N items by repeatedly finding the max
  // We use a simple approach: iterate limit times, each time finding the max unused item
  const indices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]; // For limit=10 default

  for (const _idx of indices) {
    if (resultCount >= limit) {
      break;
    }

    let maxItem: Record<string, unknown> | null = null;
    let maxViews = -1;
    let maxId = "";

    for (const item of items) {
      const itemId = item.id as string;
      // Can't use continue in AppSync, use positive condition instead
      if (!used[itemId]) {
        const itemViews = typeof item.views === "number" ? item.views : 0;
        if (itemViews > maxViews) {
          maxViews = itemViews;
          maxItem = item;
          maxId = itemId;
        }
      }
    }

    if (maxItem !== null) {
      used[maxId] = true;
      result.push({
        ...maxItem,
        isPublic: maxItem.isPublic === "true",
        views: typeof maxItem.views === "number" ? maxItem.views : 0,
      });
      resultCount = resultCount + 1;
    }
  }

  return result as Deck[];
}
