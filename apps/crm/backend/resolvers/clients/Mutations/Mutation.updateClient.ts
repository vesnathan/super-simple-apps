/**
 * GraphQL resolver: Mutation.updateClient
 *
 * Updates an existing client for the authenticated user.
 *
 * @module resolvers/clients/Mutations
 */

import { util, Context } from "@aws-appsync/utils";

interface UpdateClientInput {
  id: string;
  name?: string;
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

type CTX = Context<{ input: UpdateClientInput }, object, object, object, ClientItem>;

/**
 * Prepares DynamoDB UpdateItem request for updating a client.
 *
 * @param ctx - AppSync context containing update input
 * @returns DynamoDB UpdateItem request configuration
 */
export function request(ctx: CTX) {
  const userId = ctx.identity?.sub;

  if (!userId) {
    return util.error("Unauthorized", "UnauthorizedException");
  }

  const { input } = ctx.args;

  if (!input.id) {
    return util.error("Client ID is required", "ValidationException");
  }

  const now = util.time.nowISO8601();

  // Build update expression dynamically
  const expressionNames: Record<string, string> = {
    "#updatedAt": "updatedAt",
    "#syncedAt": "syncedAt",
  };
  const expressionValues: Record<string, unknown> = {
    ":updatedAt": now,
    ":syncedAt": now,
    ":userId": userId,
  };

  const updateParts: string[] = ["#updatedAt = :updatedAt", "#syncedAt = :syncedAt"];

  if (input.name !== undefined) {
    expressionNames["#name"] = "name";
    expressionValues[":name"] = input.name;
    updateParts.push("#name = :name");

    // Also update GSI1SK for name-based sorting
    expressionNames["#gsi1sk"] = "GSI1SK";
    expressionValues[":gsi1sk"] = `NAME#${input.name}`;
    updateParts.push("#gsi1sk = :gsi1sk");
  }

  if (input.email !== undefined) {
    expressionNames["#email"] = "email";
    expressionValues[":email"] = input.email;
    updateParts.push("#email = :email");
  }

  if (input.phone !== undefined) {
    expressionNames["#phone"] = "phone";
    expressionValues[":phone"] = input.phone;
    updateParts.push("#phone = :phone");
  }

  if (input.company !== undefined) {
    expressionNames["#company"] = "company";
    expressionValues[":company"] = input.company;
    updateParts.push("#company = :company");
  }

  if (input.address !== undefined) {
    expressionNames["#address"] = "address";
    expressionValues[":address"] = input.address;
    updateParts.push("#address = :address");
  }

  if (input.notes !== undefined) {
    expressionNames["#notes"] = "notes";
    expressionValues[":notes"] = input.notes;
    updateParts.push("#notes = :notes");
  }

  if (input.tags !== undefined) {
    expressionNames["#tags"] = "tags";
    expressionValues[":tags"] = input.tags;
    updateParts.push("#tags = :tags");
  }

  if (input.hourlyRate !== undefined) {
    expressionNames["#hourlyRate"] = "hourlyRate";
    expressionValues[":hourlyRate"] = input.hourlyRate;
    updateParts.push("#hourlyRate = :hourlyRate");
  }

  return {
    operation: "UpdateItem",
    key: util.dynamodb.toMapValues({
      PK: `USER#${userId}#CLIENT#${input.id}`,
      SK: "METADATA",
    }),
    update: {
      expression: `SET ${updateParts.join(", ")}`,
      expressionNames,
      expressionValues: util.dynamodb.toMapValues(expressionValues),
    },
    condition: {
      expression: "attribute_exists(PK) AND userId = :userId",
      expressionValues: util.dynamodb.toMapValues({
        ":userId": userId,
      }),
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
      return util.error("Client not found or access denied", "NotFoundException") as never;
    }
    return util.error(ctx.error.message, ctx.error.type) as never;
  }

  const item = ctx.result;
  if (!item) {
    return util.error("Client not found", "NotFoundException") as never;
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
    hourlyRate: item.hourlyRate !== undefined ? item.hourlyRate : null,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    syncedAt: item.syncedAt || null,
  };

  return client;
}
