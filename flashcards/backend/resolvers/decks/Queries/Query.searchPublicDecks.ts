import { Context, util } from "@aws-appsync/utils";
import { Deck } from "shared";

interface Args {
  search?: string;
  limit?: number;
  nextToken?: string;
}

interface PublicDecksResult {
  decks: Deck[];
  nextToken: string | null;
}

type CTX = Context<Args>;

export function request(ctx: CTX) {
  const { search, limit = 10, nextToken } = ctx.args;

  // Get current user ID if authenticated (to exclude their own decks)
  const currentUserId = ctx.identity?.sub;

  const expressionValues: Record<string, string> = {};
  const expressionNames: Record<string, string> = {};
  const filterParts: string[] = [];

  // Exclude current user's decks from Browse
  if (currentUserId) {
    filterParts.push("userId <> :currentUserId");
    expressionValues[":currentUserId"] = currentUserId;
  }

  // Add filter for search if provided
  if (search && search.trim()) {
    filterParts.push("contains(#title, :search)");
    expressionNames["#title"] = "title";
    expressionValues[":search"] = search.trim();
  }

  const request: Record<string, unknown> = {
    operation: "Query",
    index: "GSI2",
    query: {
      expression: "GSI2PK = :pk",
      expressionValues: util.dynamodb.toMapValues({ ":pk": "PUBLIC" }),
    },
    scanIndexForward: false, // Most recent first
    limit,
  };

  // Add combined filter if any conditions exist
  if (filterParts.length > 0) {
    request.filter = {
      expression: filterParts.join(" AND "),
      expressionValues: util.dynamodb.toMapValues(expressionValues),
      ...(Object.keys(expressionNames).length > 0 && { expressionNames }),
    };
  }

  // Add pagination token if provided
  if (nextToken) {
    request.nextToken = nextToken;
  }

  return request;
}

export function response(ctx: CTX): PublicDecksResult {
  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type);
  }

  const items = ctx.result?.items ?? [];

  // Transform isPublic from string "true"/"false" to boolean
  const decks = items.map((item: Record<string, unknown>) => ({
    ...item,
    isPublic: item.isPublic === "true",
  })) as Deck[];

  return {
    decks,
    nextToken: ctx.result?.nextToken ?? null,
  };
}
