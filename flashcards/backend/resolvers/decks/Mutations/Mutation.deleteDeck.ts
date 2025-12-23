import { Context, util } from "@aws-appsync/utils";

interface DeleteDeckResult {
  success: boolean;
  deletedId: string;
}

type CTX = Context<{
  deckId: string;
}>;

export function request(ctx: CTX) {
  const userId = ctx.identity?.sub;

  if (!userId) {
    return util.error("Unauthorized", "UnauthorizedException");
  }

  const { deckId } = ctx.args;

  if (!deckId) {
    return util.error("deckId is required", "ValidationException");
  }

  // DeleteItem with condition ensures user can only delete their own decks
  return {
    operation: "DeleteItem",
    key: util.dynamodb.toMapValues({
      PK: `DECK#${deckId}`,
      SK: `DECK#${deckId}`,
    }),
    condition: {
      expression: "userId = :userId",
      expressionValues: util.dynamodb.toMapValues({ ":userId": userId }),
    },
  };
}

export function response(ctx: CTX): DeleteDeckResult {
  if (ctx.error) {
    // Check for condition failure (unauthorized or not found)
    if (ctx.error.type === "DynamoDB:ConditionalCheckFailedException") {
      return util.error("Deck not found or you don't have permission to delete it", "UnauthorizedException");
    }
    return util.error(ctx.error.message, ctx.error.type);
  }

  return {
    success: true,
    deletedId: ctx.args.deckId,
  };
}
