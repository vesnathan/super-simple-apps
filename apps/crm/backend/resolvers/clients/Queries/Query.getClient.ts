/**
 * GraphQL resolver: Query.getClient
 *
 * Fetches a single client by ID for the authenticated user.
 *
 * @module resolvers/clients/Queries
 */

import { util, Context } from "@aws-appsync/utils";

interface ClientItem {
  PK: string;
  SK: string;
  id: string;
  userId: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  address?: string;
  notes?: string;
  tags: string[];
  hourlyRate?: number;
  createdAt: string;
  updatedAt: string;
  syncedAt?: string;
}

interface Client {
  __typename: "Client";
  id: string;
  userId: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  address: string | null;
  notes: string | null;
  tags: string[];
  hourlyRate: number | null;
  createdAt: string;
  updatedAt: string;
  syncedAt: string | null;
}

type CTX = Context<{ id: string }, object, object, object, ClientItem | null>;

/**
 * Prepares DynamoDB GetItem request for fetching a client.
 *
 * @param ctx - AppSync context containing client ID
 * @returns DynamoDB GetItem request configuration
 */
export function request(ctx: CTX) {
  const { id } = ctx.args;
  const userId = ctx.identity?.sub;

  if (!userId) {
    return util.error("Unauthorized", "UnauthorizedException");
  }

  if (!id) {
    return util.error("Client ID is required", "ValidationException");
  }

  return {
    operation: "GetItem",
    key: util.dynamodb.toMapValues({
      PK: `USER#${userId}#CLIENT#${id}`,
      SK: "METADATA",
    }),
  };
}

/**
 * Processes DynamoDB response and returns formatted Client object.
 *
 * @param ctx - AppSync context containing DynamoDB result
 * @returns Formatted Client response object or null if not found
 */
export function response(ctx: CTX): Client | null {
  if (ctx.error) {
    return util.error(ctx.error.message, ctx.error.type) as never;
  }

  const item = ctx.result;
  if (!item) {
    return null;
  }

  // Verify ownership
  const userId = ctx.identity?.sub;
  if (item.userId !== userId) {
    return util.error("Unauthorized", "UnauthorizedException") as never;
  }

  const client: Client = {
    __typename: "Client",
    id: item.id,
    userId: item.userId,
    name: item.name,
    email: item.email || null,
    phone: item.phone || null,
    company: item.company || null,
    address: item.address || null,
    notes: item.notes || null,
    tags: item.tags || [],
    hourlyRate: item.hourlyRate || null,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    syncedAt: item.syncedAt || null,
  };

  return client;
}
