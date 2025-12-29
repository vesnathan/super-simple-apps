/**
 * Sync service for CRM
 *
 * Handles syncing local data with the cloud when user signs in/out
 */

import { fetchClients, syncClients, mergeClients, cloudToLocalClient } from "./api";
import type { Client } from "@/types";

const STORAGE_KEY = "super-simple-apps-crm";

interface CRMState {
  clients: Client[];
  selectedClientId: string | null;
  searchQuery: string;
  selectedTags: string[];
}

/**
 * Load clients from localStorage
 */
function loadLocalClients(): Client[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const state = JSON.parse(stored) as CRMState;
      return state.clients || [];
    }
  } catch {
    // ignore
  }
  return [];
}

/**
 * Save clients to localStorage
 */
function saveLocalClients(clients: Client[]): void {
  if (typeof window === "undefined") return;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    let state: CRMState = {
      clients: [],
      selectedClientId: null,
      searchQuery: "",
      selectedTags: [],
    };

    if (stored) {
      state = JSON.parse(stored) as CRMState;
    }

    state.clients = clients;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

    // Dispatch storage event for other tabs/components to update
    window.dispatchEvent(new StorageEvent("storage", {
      key: STORAGE_KEY,
      newValue: JSON.stringify(state),
    }));
  } catch {
    // ignore
  }
}

/**
 * Sync local data to cloud when user signs in
 *
 * Strategy:
 * 1. Fetch all clients from cloud
 * 2. Merge with local clients (prefer newer versions)
 * 3. Upload any local-only clients to cloud
 * 4. Update local storage with merged data
 */
export async function syncOnSignIn(): Promise<{ synced: number; merged: number }> {
  console.log("[CRM Sync] Starting sync on sign in...");

  try {
    // 1. Get local clients
    const localClients = loadLocalClients();
    console.log(`[CRM Sync] Found ${localClients.length} local clients`);

    // 2. Fetch cloud clients
    const cloudClients = await fetchClients();
    console.log(`[CRM Sync] Found ${cloudClients.length} cloud clients`);

    // 3. Find local clients that aren't in the cloud or are newer
    const cloudIds = new Set(cloudClients.map((c) => c.id));
    const localOnlyClients = localClients.filter((c) => !cloudIds.has(c.id));
    const newerLocalClients = localClients.filter((c) => {
      const cloudClient = cloudClients.find((cc) => cc.id === c.id);
      if (!cloudClient) return false;
      const cloudUpdatedAt = new Date(cloudClient.updatedAt).getTime();
      return c.updatedAt > cloudUpdatedAt;
    });

    const clientsToSync = [...localOnlyClients, ...newerLocalClients];
    console.log(`[CRM Sync] ${clientsToSync.length} clients need to be synced to cloud`);

    // 4. Sync local clients to cloud
    let synced = 0;
    if (clientsToSync.length > 0) {
      const result = await syncClients(clientsToSync);
      synced = result.synced;
      console.log(`[CRM Sync] Synced ${synced} clients to cloud`);
    }

    // 5. Merge all clients (local + cloud, preferring newer)
    const mergedClients = mergeClients(localClients, cloudClients);
    console.log(`[CRM Sync] Merged to ${mergedClients.length} total clients`);

    // 6. Save merged clients to local storage
    saveLocalClients(mergedClients);

    return {
      synced,
      merged: mergedClients.length,
    };
  } catch (error) {
    console.error("[CRM Sync] Sync failed:", error);
    throw error;
  }
}

/**
 * Handle sign out
 *
 * Keep local data so user can still use the app offline.
 * Data will sync again when they sign back in.
 */
export async function handleSignOut(): Promise<void> {
  console.log("[CRM Sync] User signed out - keeping local data");
  // We intentionally keep local data so the app works offline
  // Data will sync when user signs back in
}

/**
 * Force pull from cloud (overwrites local data)
 */
export async function pullFromCloud(): Promise<Client[]> {
  console.log("[CRM Sync] Pulling all data from cloud...");

  const cloudClients = await fetchClients();
  const localClients = cloudClients.map(cloudToLocalClient);

  saveLocalClients(localClients);
  console.log(`[CRM Sync] Pulled ${localClients.length} clients from cloud`);

  return localClients;
}

/**
 * Force push to cloud (uploads all local data)
 */
export async function pushToCloud(): Promise<number> {
  console.log("[CRM Sync] Pushing all local data to cloud...");

  const localClients = loadLocalClients();
  if (localClients.length === 0) {
    console.log("[CRM Sync] No local clients to push");
    return 0;
  }

  const result = await syncClients(localClients);
  console.log(`[CRM Sync] Pushed ${result.synced} clients to cloud`);

  return result.synced;
}
