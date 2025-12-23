import { Context, util } from "@aws-appsync/utils";

interface GetDeckArgs {
  id: string;
}

interface DeckItem {
  id: string;
  userId: string;
  title: string;
  cards: Array<{ id: string; question: string; answer: string }>;
  isPublic: string; // Stored as string in DynamoDB
  createdAt: string;
  lastModified: number;
}

type CTX = Context<GetDeckArgs>;

export function request(ctx: CTX) {
  const { id } = ctx.args;

  // Use GetItem with PK/SK pattern
  return {
    operation: "GetItem",
    key: util.dynamodb.toMapValues({
      PK: `DECK#${id}`,
      SK: `DECK#${id}`,
    }),
  };
}

export function response(ctx: Context<GetDeckArgs, object, object, object, DeckItem | null>) {
  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type);
  }

  const item = ctx.result;

  // Return null if deck not found
  if (!item) {
    return null;
  }

  // Check access: deck must be public OR belong to the current user
  const currentUserId = ctx.identity?.sub;
  const isPublic = item.isPublic === "true";
  const isOwner = currentUserId && item.userId === currentUserId;

  if (!isPublic && !isOwner) {
    // Private deck that doesn't belong to the user - treat as not found
    return null;
  }

  // Transform isPublic from string to boolean
  return {
    ...item,
    isPublic,
  };
}
