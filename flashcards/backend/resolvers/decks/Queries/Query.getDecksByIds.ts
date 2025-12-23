import { Context, util } from "@aws-appsync/utils";
import { Deck } from "shared";

interface GetDecksByIdsArgs {
  ids: string[];
}

type CTX = Context<GetDecksByIdsArgs>;

export function request(ctx: CTX) {
  const { ids } = ctx.args;

  if (!ids || ids.length === 0) {
    return { items: [] };
  }

  // Limit to 25 items (DynamoDB BatchGetItem limit)
  const limitedIds = ids.slice(0, 25);

  // Build keys for BatchGetItem
  const keys = limitedIds.map((id) =>
    util.dynamodb.toMapValues({
      PK: `DECK#${id}`,
      SK: `DECK#${id}`,
    })
  );

  return {
    operation: "BatchGetItem",
    tables: {
      "#{tableName}": {
        keys,
      },
    },
  };
}

export function response(ctx: CTX): Deck[] {
  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type);
  }

  // BatchGetItem returns results in tables map
  const tableName = Object.keys(ctx.result?.data ?? {})[0];
  const items = tableName ? ctx.result?.data[tableName] ?? [] : [];

  // Filter to only public decks (for security)
  const publicItems = items.filter(
    (item: Record<string, unknown>) => item.isPublic === "true"
  );

  // Transform isPublic from string to boolean and ensure views has default
  return publicItems.map((item: Record<string, unknown>) => ({
    ...item,
    isPublic: true,
    views: typeof item.views === "number" ? item.views : 0,
  })) as Deck[];
}
