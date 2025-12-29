/**
 * GraphQL resolver: Mutation.createClient
 *
 * Creates a new client for the authenticated user.
 *
 * @module resolvers/clients/Mutations
 */

import { util, Context } from "@aws-appsync/utils";

interface CreateClientInput {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  address?: string;
  notes?: string;
  tags?: string[];
  hourlyRate?: number;
}

interface ClientItem {
  PK: string;
  SK: string;
  GSI1PK: string;
  GSI1SK: string;
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
  syncedAt: string;
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

type CTX = Context<{ input: CreateClientInput }, object, object, object, ClientItem>;

/**
 * Prepares DynamoDB PutItem request for creating a client.
 *
 * @param ctx - AppSync context containing client input
 * @returns DynamoDB PutItem request configuration
 */
export function request(ctx: CTX) {
  const userId = ctx.identity?.sub;

  if (!userId) {
    return util.error("Unauthorized", "UnauthorizedException");
  }

  const { input } = ctx.args;

  if (!input.name) {
    return util.error("Client name is required", "ValidationException");
  }

  const id = input.id || util.autoId();
  const now = util.time.nowISO8601();
  const tags = input.tags || [];

  const item: ClientItem = {
    PK: `USER#${userId}#CLIENT#${id}`,
    SK: "METADATA",
    GSI1PK: `USER#${userId}#TYPE#CLIENT`,
    GSI1SK: `NAME#${input.name}`,
    id,
    userId,
    name: input.name,
    tags,
    createdAt: now,
    updatedAt: now,
    syncedAt: now,
  };

  // Add optional fields if provided
  if (input.email) {
    item.email = input.email;
  }
  if (input.phone) {
    item.phone = input.phone;
  }
  if (input.company) {
    item.company = input.company;
  }
  if (input.address) {
    item.address = input.address;
  }
  if (input.notes) {
    item.notes = input.notes;
  }
  if (input.hourlyRate !== undefined && input.hourlyRate !== null) {
    item.hourlyRate = input.hourlyRate;
  }

  return {
    operation: "PutItem",
    key: util.dynamodb.toMapValues({
      PK: item.PK,
      SK: item.SK,
    }),
    attributeValues: util.dynamodb.toMapValues(item),
    condition: {
      expression: "attribute_not_exists(PK)",
    },
  };
}

/**
 * Processes DynamoDB response and returns formatted Client object.
 *
 * @param ctx - AppSync context containing DynamoDB result
 * @returns Formatted Client response object
 */
export function response(ctx: CTX): Client {
  if (ctx.error) {
    if (ctx.error.type === "DynamoDB:ConditionalCheckFailedException") {
      return util.error("Client already exists", "ConflictException") as never;
    }
    return util.error(ctx.error.message, ctx.error.type) as never;
  }

  const userId = ctx.identity?.sub;
  const { input } = ctx.args;
  const id = input.id || ctx.result?.id;
  const now = util.time.nowISO8601();

  const client: Client = {
    __typename: "Client",
    id: id || "",
    userId: userId || "",
    name: input.name,
    email: input.email || null,
    phone: input.phone || null,
    company: input.company || null,
    address: input.address || null,
    notes: input.notes || null,
    tags: input.tags || [],
    hourlyRate: input.hourlyRate !== undefined ? input.hourlyRate : null,
    createdAt: now,
    updatedAt: now,
    syncedAt: now,
  };

  return client;
}
