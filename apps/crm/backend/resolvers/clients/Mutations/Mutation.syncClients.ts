/**
 * GraphQL resolver: Mutation.syncClients
 *
 * Bulk syncs multiple clients from local storage to cloud.
 * Uses BatchWriteItem for efficient bulk operations.
 *
 * @module resolvers/clients/Mutations
 */

import { util, Context } from "@aws-appsync/utils";

interface SyncClientInput {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  address?: string;
  notes?: string;
  tags?: string[];
  hourlyRate?: number;
  createdAt: string;
  updatedAt: string;
}

interface SyncClientsInput {
  clients: SyncClientInput[];
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

interface SyncClientsResult {
  __typename: "SyncClientsResult";
  synced: number;
  clients: Client[];
}

interface BatchWriteResult {
  data: {
    [tableName: string]: Array<Record<string, unknown>>;
  };
  unprocessedItems?: {
    [tableName: string]: Array<Record<string, unknown>>;
  };
}

type CTX = Context<{ input: SyncClientsInput }, object, object, object, BatchWriteResult>;

/**
 * Prepares DynamoDB BatchWriteItem request for syncing multiple clients.
 *
 * @param ctx - AppSync context containing clients to sync
 * @returns DynamoDB BatchWriteItem request configuration
 */
export function request(ctx: CTX) {
  const userId = ctx.identity?.sub;

  if (!userId) {
    return util.error("Unauthorized", "UnauthorizedException");
  }

  const { input } = ctx.args;

  if (!input.clients || input.clients.length === 0) {
    return util.error("At least one client is required", "ValidationException");
  }

  if (input.clients.length > 25) {
    return util.error("Maximum 25 clients can be synced at once", "ValidationException");
  }

  const now = util.time.nowISO8601();
  const putItems: Array<Record<string, unknown>> = [];

  for (const client of input.clients) {
    if (!client.id || !client.name) {
      return util.error("Each client must have an id and name", "ValidationException");
    }

    const item: Record<string, unknown> = {
      PK: `USER#${userId}#CLIENT#${client.id}`,
      SK: "METADATA",
      GSI1PK: `USER#${userId}#TYPE#CLIENT`,
      GSI1SK: `NAME#${client.name}`,
      id: client.id,
      userId,
      name: client.name,
      tags: client.tags || [],
      createdAt: client.createdAt || now,
      updatedAt: client.updatedAt || now,
      syncedAt: now,
    };

    if (client.email) {
      item.email = client.email;
    }
    if (client.phone) {
      item.phone = client.phone;
    }
    if (client.company) {
      item.company = client.company;
    }
    if (client.address) {
      item.address = client.address;
    }
    if (client.notes) {
      item.notes = client.notes;
    }
    if (client.hourlyRate !== undefined && client.hourlyRate !== null) {
      item.hourlyRate = client.hourlyRate;
    }

    putItems.push({
      table: "#tableName#",
      operation: "PutItem",
      key: util.dynamodb.toMapValues({
        PK: item.PK,
        SK: item.SK,
      }),
      attributeValues: util.dynamodb.toMapValues(item),
    });
  }

  return {
    operation: "TransactWriteItems",
    transactItems: putItems,
  };
}

/**
 * Processes DynamoDB response and returns sync result.
 *
 * @param ctx - AppSync context containing DynamoDB result
 * @returns Sync result with count and synced clients
 */
export function response(ctx: CTX): SyncClientsResult {
  if (ctx.error) {
    return util.error(ctx.error.message, ctx.error.type) as never;
  }

  const userId = ctx.identity?.sub;
  const { input } = ctx.args;
  const now = util.time.nowISO8601();

  const clients: Client[] = [];

  for (const clientInput of input.clients) {
    const client: Client = {
      __typename: "Client",
      id: clientInput.id,
      userId: userId || "",
      name: clientInput.name,
      email: clientInput.email || null,
      phone: clientInput.phone || null,
      company: clientInput.company || null,
      address: clientInput.address || null,
      notes: clientInput.notes || null,
      tags: clientInput.tags || [],
      hourlyRate: clientInput.hourlyRate !== undefined ? clientInput.hourlyRate : null,
      createdAt: clientInput.createdAt || now,
      updatedAt: clientInput.updatedAt || now,
      syncedAt: now,
    };
    clients.push(client);
  }

  return {
    __typename: "SyncClientsResult",
    synced: clients.length,
    clients,
  };
}
