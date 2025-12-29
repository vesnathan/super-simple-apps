/**
 * GraphQL resolver: Mutation.deleteClient
 *
 * Deletes a client for the authenticated user.
 *
 * @module resolvers/clients/Mutations
 */

import { util, Context } from "@aws-appsync/utils";

interface ClientItem {
  PK: string;
  SK: string;
  id: string;
  userId: string;
}

type CTX = Context<{ id: string }, object, object, object, ClientItem | null>;

/**
 * Prepares DynamoDB DeleteItem request for deleting a client.
 *
 * @param ctx - AppSync context containing client ID
 * @returns DynamoDB DeleteItem request configuration
 */
export function request(ctx: CTX) {
  const userId = ctx.identity?.sub;

  if (!userId) {
    return util.error("Unauthorized", "UnauthorizedException");
  }

  const { id } = ctx.args;

  if (!id) {
    return util.error("Client ID is required", "ValidationException");
  }

  return {
    operation: "DeleteItem",
    key: util.dynamodb.toMapValues({
      PK: `USER#${userId}#CLIENT#${id}`,
      SK: "METADATA",
    }),
    condition: {
      expression: "attribute_exists(PK) AND userId = :userId",
      expressionValues: util.dynamodb.toMapValues({
        ":userId": userId,
      }),
    },
  };
}

/**
 * Processes DynamoDB response and returns success boolean.
 *
 * @param ctx - AppSync context containing DynamoDB result
 * @returns Boolean indicating success
 */
export function response(ctx: CTX): boolean {
  if (ctx.error) {
    if (ctx.error.type === "DynamoDB:ConditionalCheckFailedException") {
      return util.error("Client not found or access denied", "NotFoundException") as never;
    }
    return util.error(ctx.error.message, ctx.error.type) as never;
  }

  return true;
}
