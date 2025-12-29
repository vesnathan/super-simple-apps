/**
 * GraphQL resolver: Mutation.deleteInvoice
 *
 * Deletes an invoice for the authenticated user.
 *
 * @module resolvers/invoices/Mutations
 */

import { util, Context } from "@aws-appsync/utils";

interface InvoiceItem {
  PK: string;
  SK: string;
  userId: string;
}

type CTX = Context<{ id: string }, object, object, object, InvoiceItem | null>;

/**
 * Prepares DynamoDB DeleteItem request for deleting an invoice.
 *
 * @param ctx - AppSync context containing invoice ID
 * @returns DynamoDB DeleteItem request configuration
 */
export function request(ctx: CTX) {
  const userId = ctx.identity?.sub;

  if (!userId) {
    return util.error("Unauthorized", "UnauthorizedException");
  }

  const { id } = ctx.args;

  if (!id) {
    return util.error("Invoice ID is required", "ValidationException");
  }

  return {
    operation: "DeleteItem",
    key: util.dynamodb.toMapValues({
      PK: `USER#${userId}#INVOICE#${id}`,
      SK: "METADATA",
    }),
    condition: {
      expression: "attribute_exists(PK) AND userId = :userId",
      expressionValues: util.dynamodb.toMapValues({ ":userId": userId }),
    },
  };
}

/**
 * Processes DynamoDB response and returns success status.
 *
 * @param ctx - AppSync context containing DynamoDB result
 * @returns Boolean indicating success
 */
export function response(ctx: CTX): boolean {
  if (ctx.error) {
    if (ctx.error.type === "DynamoDB:ConditionalCheckFailedException") {
      return util.error("Invoice not found or unauthorized", "NotFoundException") as never;
    }
    return util.error(ctx.error.message, ctx.error.type) as never;
  }

  return true;
}
