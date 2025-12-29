/**
 * GraphQL resolver: Query.listClients
 *
 * Lists all clients for the authenticated user with pagination support.
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

interface ClientConnection {
  __typename: "ClientConnection";
  items: Client[];
  nextToken: string | null;
}

interface QueryResult {
  items: ClientItem[];
  nextToken?: string;
}

type CTX = Context<{ limit?: number; nextToken?: string }, object, object, object, QueryResult>;

/**
 * Prepares DynamoDB Query request for listing user's clients.
 *
 * @param ctx - AppSync context containing pagination args
 * @returns DynamoDB Query request configuration
 */
export function request(ctx: CTX) {
  const userId = ctx.identity?.sub;

  if (!userId) {
    return util.error("Unauthorized", "UnauthorizedException");
  }

  const limit = ctx.args.limit || 50;

  const queryRequest: Record<string, unknown> = {
    operation: "Query",
    index: "GSI1",
    query: {
      expression: "GSI1PK = :pk",
      expressionValues: util.dynamodb.toMapValues({
        ":pk": `USER#${userId}#TYPE#CLIENT`,
      }),
    },
    limit,
    scanIndexForward: true,
  };

  if (ctx.args.nextToken) {
    queryRequest.nextToken = ctx.args.nextToken;
  }

  return queryRequest;
}

/**
 * Processes DynamoDB response and returns formatted ClientConnection.
 *
 * @param ctx - AppSync context containing DynamoDB result
 * @returns Formatted ClientConnection with items and pagination token
 */
export function response(ctx: CTX): ClientConnection {
  if (ctx.error) {
    return util.error(ctx.error.message, ctx.error.type) as never;
  }

  const result = ctx.result;
  const items = result?.items || [];
  const clients: Client[] = [];

  for (const item of items) {
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
    clients.push(client);
  }

  return {
    __typename: "ClientConnection",
    items: clients,
    nextToken: result?.nextToken || null,
  };
}
