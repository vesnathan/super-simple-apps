import { Context, util } from "@aws-appsync/utils";

interface IncrementDeckViewsArgs {
  deckId: string;
}

interface IncrementViewsResult {
  success: boolean;
  views: number;
}

type CTX = Context<IncrementDeckViewsArgs>;

export function request(ctx: CTX) {
  const { deckId } = ctx.args;

  if (!deckId) {
    return util.error("deckId is required", "ValidationException");
  }

  // Atomic increment of views counter
  return {
    operation: "UpdateItem",
    key: util.dynamodb.toMapValues({
      PK: `DECK#${deckId}`,
      SK: `DECK#${deckId}`,
    }),
    update: {
      expression: "SET #views = if_not_exists(#views, :zero) + :inc",
      expressionNames: {
        "#views": "views",
      },
      expressionValues: util.dynamodb.toMapValues({
        ":zero": 0,
        ":inc": 1,
      }),
    },
    // Only increment if deck is public
    condition: {
      expression: "isPublic = :public",
      expressionValues: util.dynamodb.toMapValues({ ":public": "true" }),
    },
  };
}

export function response(ctx: CTX): IncrementViewsResult {
  if (ctx.error) {
    // If condition failed, deck is not public or doesn't exist
    if (ctx.error.type === "DynamoDB:ConditionalCheckFailedException") {
      return { success: false, views: 0 };
    }
    return util.error(ctx.error.message, ctx.error.type);
  }

  const deck = ctx.result;
  const views = typeof deck?.views === "number" ? deck.views : 0;

  return {
    success: true,
    views,
  };
}
