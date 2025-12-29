/**
 * API service for CRM cloud operations
 */

import { generateClient } from "aws-amplify/api";
import { LIST_CLIENTS, GET_CLIENT } from "../graphql/queries";
import { CREATE_CLIENT, UPDATE_CLIENT, DELETE_CLIENT, SYNC_CLIENTS } from "../graphql/mutations";
import type { Client } from "../types";

const client = generateClient();

export interface CloudClient {
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

export interface ClientConnection {
  items: CloudClient[];
  nextToken: string | null;
}

export interface SyncClientsResult {
  synced: number;
  clients: CloudClient[];
}

/**
 * Fetch all clients from the cloud
 */
export async function fetchClients(limit = 100): Promise<CloudClient[]> {
  const allClients: CloudClient[] = [];
  let nextToken: string | null = null;

  do {
    const result = await client.graphql({
      query: LIST_CLIENTS,
      variables: { limit, nextToken },
      authMode: "userPool",
    });

    if (!("data" in result) || !result.data) {
      throw new Error("Failed to fetch clients");
    }
    const data = result.data as { listClients: ClientConnection };
    allClients.push(...data.listClients.items);
    nextToken = data.listClients.nextToken;
  } while (nextToken);

  return allClients;
}

/**
 * Fetch a single client by ID
 */
export async function fetchClient(id: string): Promise<CloudClient | null> {
  const result = await client.graphql({
    query: GET_CLIENT,
    variables: { id },
    authMode: "userPool",
  });

  if (!("data" in result) || !result.data) {
    throw new Error("Failed to fetch client");
  }
  const data = result.data as { getClient: CloudClient | null };
  return data.getClient;
}

/**
 * Create a new client in the cloud
 */
export async function createClient(input: {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  address?: string;
  notes?: string;
  tags?: string[];
  hourlyRate?: number;
}): Promise<CloudClient> {
  const result = await client.graphql({
    query: CREATE_CLIENT,
    variables: { input },
    authMode: "userPool",
  });

  if (!("data" in result) || !result.data) {
    throw new Error("Failed to create client");
  }
  const data = result.data as { createClient: CloudClient };
  return data.createClient;
}

/**
 * Update an existing client in the cloud
 */
export async function updateClient(input: {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  address?: string;
  notes?: string;
  tags?: string[];
  hourlyRate?: number;
}): Promise<CloudClient> {
  const result = await client.graphql({
    query: UPDATE_CLIENT,
    variables: { input },
    authMode: "userPool",
  });

  if (!("data" in result) || !result.data) {
    throw new Error("Failed to update client");
  }
  const data = result.data as { updateClient: CloudClient };
  return data.updateClient;
}

/**
 * Delete a client from the cloud
 */
export async function deleteClient(id: string): Promise<boolean> {
  const result = await client.graphql({
    query: DELETE_CLIENT,
    variables: { id },
    authMode: "userPool",
  });

  if (!("data" in result) || !result.data) {
    throw new Error("Failed to delete client");
  }
  const data = result.data as { deleteClient: boolean };
  return data.deleteClient;
}

/**
 * Sync multiple clients to the cloud (bulk upload)
 */
export async function syncClients(clients: Client[]): Promise<SyncClientsResult> {
  // Convert local clients to sync input format
  const syncInput = clients.map((c) => ({
    id: c.id,
    name: c.name,
    email: c.email || undefined,
    phone: c.phone || undefined,
    company: c.company || undefined,
    address: c.address || undefined,
    notes: c.notes || undefined,
    tags: c.tags,
    hourlyRate: c.hourlyRate,
    createdAt: new Date(c.createdAt).toISOString(),
    updatedAt: new Date(c.updatedAt).toISOString(),
  }));

  // Sync in batches of 25 (DynamoDB limit)
  const batchSize = 25;
  let totalSynced = 0;
  const allSyncedClients: CloudClient[] = [];

  for (let i = 0; i < syncInput.length; i += batchSize) {
    const batch = syncInput.slice(i, i + batchSize);

    const result = await client.graphql({
      query: SYNC_CLIENTS,
      variables: { input: { clients: batch } },
      authMode: "userPool",
    });

    if (!("data" in result) || !result.data) {
      throw new Error("Failed to sync clients");
    }
    const data = result.data as { syncClients: SyncClientsResult };
    totalSynced += data.syncClients.synced;
    allSyncedClients.push(...data.syncClients.clients);
  }

  return {
    synced: totalSynced,
    clients: allSyncedClients,
  };
}

/**
 * Convert cloud client to local client format
 */
export function cloudToLocalClient(cloud: CloudClient): Client {
  return {
    id: cloud.id,
    name: cloud.name,
    email: cloud.email || "",
    phone: cloud.phone || "",
    company: cloud.company || "",
    address: cloud.address || "",
    notes: cloud.notes || "",
    tags: cloud.tags,
    hourlyRate: cloud.hourlyRate ?? undefined,
    createdAt: new Date(cloud.createdAt).getTime(),
    updatedAt: new Date(cloud.updatedAt).getTime(),
    userId: cloud.userId,
    syncedAt: cloud.syncedAt ? new Date(cloud.syncedAt).getTime() : undefined,
  };
}

/**
 * Merge local and cloud clients, preferring newer versions
 */
export function mergeClients(localClients: Client[], cloudClients: CloudClient[]): Client[] {
  const clientMap = new Map<string, Client>();

  // Add local clients to map
  for (const client of localClients) {
    clientMap.set(client.id, client);
  }

  // Merge cloud clients, preferring newer versions
  for (const cloudClient of cloudClients) {
    const existing = clientMap.get(cloudClient.id);
    const cloudAsLocal = cloudToLocalClient(cloudClient);

    if (!existing || cloudAsLocal.updatedAt > existing.updatedAt) {
      clientMap.set(cloudClient.id, cloudAsLocal);
    }
  }

  return Array.from(clientMap.values());
}
