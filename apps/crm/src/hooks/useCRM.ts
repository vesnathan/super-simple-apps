"use client";

import { useState, useEffect, useCallback } from "react";
import { Client, CRMState, CreateClientInput, UpdateClientInput } from "@/types";

const STORAGE_KEY = "super-simple-apps-crm";

const COLORS = [
  "#3b82f6", // blue
  "#10b981", // green
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#f97316", // orange
];

function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function loadState(): CRMState {
  if (typeof window === "undefined") {
    return { clients: [], selectedClientId: null, searchQuery: "", selectedTags: [] };
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const state = JSON.parse(stored) as CRMState;
      // Reset UI state on load
      state.selectedClientId = null;
      state.searchQuery = "";
      state.selectedTags = [];
      return state;
    }
  } catch {
    // ignore
  }
  return { clients: [], selectedClientId: null, searchQuery: "", selectedTags: [] };
}

function saveState(state: CRMState): void {
  if (typeof window === "undefined") return;
  try {
    // Only persist clients, not UI state
    const toSave: CRMState = {
      clients: state.clients,
      selectedClientId: null,
      searchQuery: "",
      selectedTags: [],
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch {
    // ignore
  }
}

export function useCRM() {
  const [state, setState] = useState<CRMState>(() => loadState());

  // Load state on mount
  useEffect(() => {
    setState(loadState());
  }, []);

  // Save state on changes (only clients)
  useEffect(() => {
    saveState(state);
  }, [state.clients]);

  // Create a new client
  const createClient = useCallback((input: CreateClientInput): Client => {
    const now = Date.now();
    const newClient: Client = {
      ...input,
      id: generateId(),
      email: input.email || "",
      phone: input.phone || "",
      company: input.company || "",
      address: input.address || "",
      notes: input.notes || "",
      tags: input.tags || [],
      createdAt: now,
      updatedAt: now,
    };

    setState((prev) => ({
      ...prev,
      clients: [...prev.clients, newClient],
    }));

    return newClient;
  }, []);

  // Update an existing client
  const updateClient = useCallback((input: UpdateClientInput): void => {
    setState((prev) => ({
      ...prev,
      clients: prev.clients.map((client) =>
        client.id === input.id
          ? { ...client, ...input, updatedAt: Date.now() }
          : client
      ),
    }));
  }, []);

  // Delete a client
  const deleteClient = useCallback((clientId: string): void => {
    setState((prev) => ({
      ...prev,
      clients: prev.clients.filter((c) => c.id !== clientId),
      selectedClientId: prev.selectedClientId === clientId ? null : prev.selectedClientId,
    }));
  }, []);

  // Select a client
  const selectClient = useCallback((clientId: string | null): void => {
    setState((prev) => ({
      ...prev,
      selectedClientId: clientId,
    }));
  }, []);

  // Set search query
  const setSearchQuery = useCallback((query: string): void => {
    setState((prev) => ({
      ...prev,
      searchQuery: query,
    }));
  }, []);

  // Toggle tag filter
  const toggleTagFilter = useCallback((tag: string): void => {
    setState((prev) => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(tag)
        ? prev.selectedTags.filter((t) => t !== tag)
        : [...prev.selectedTags, tag],
    }));
  }, []);

  // Clear all tag filters
  const clearTagFilters = useCallback((): void => {
    setState((prev) => ({
      ...prev,
      selectedTags: [],
    }));
  }, []);

  // Get the selected client
  const getSelectedClient = useCallback((): Client | null => {
    return state.clients.find((c) => c.id === state.selectedClientId) || null;
  }, [state.clients, state.selectedClientId]);

  // Get all unique tags
  const getAllTags = useCallback((): string[] => {
    const tags = new Set<string>();
    state.clients.forEach((client) => {
      client.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [state.clients]);

  // Get filtered clients based on search and tags
  const getFilteredClients = useCallback((): Client[] => {
    let filtered = state.clients;

    // Filter by search query
    if (state.searchQuery.trim()) {
      const query = state.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (client) =>
          client.name.toLowerCase().includes(query) ||
          client.email?.toLowerCase().includes(query) ||
          client.company?.toLowerCase().includes(query) ||
          client.phone?.includes(query)
      );
    }

    // Filter by selected tags
    if (state.selectedTags.length > 0) {
      filtered = filtered.filter((client) =>
        state.selectedTags.some((tag) => client.tags.includes(tag))
      );
    }

    // Sort by name
    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  }, [state.clients, state.searchQuery, state.selectedTags]);

  // Add a tag to a client
  const addTagToClient = useCallback((clientId: string, tag: string): void => {
    setState((prev) => ({
      ...prev,
      clients: prev.clients.map((client) =>
        client.id === clientId && !client.tags.includes(tag)
          ? { ...client, tags: [...client.tags, tag], updatedAt: Date.now() }
          : client
      ),
    }));
  }, []);

  // Remove a tag from a client
  const removeTagFromClient = useCallback((clientId: string, tag: string): void => {
    setState((prev) => ({
      ...prev,
      clients: prev.clients.map((client) =>
        client.id === clientId
          ? { ...client, tags: client.tags.filter((t) => t !== tag), updatedAt: Date.now() }
          : client
      ),
    }));
  }, []);

  // Get a random color for new clients
  const getRandomColor = useCallback((): string => {
    return COLORS[Math.floor(Math.random() * COLORS.length)];
  }, []);

  // Import clients (for cloud sync or file import)
  const importClients = useCallback((clients: Client[]): void => {
    setState((prev) => {
      const existingIds = new Set(prev.clients.map((c) => c.id));
      const newClients = clients.filter((c) => !existingIds.has(c.id));
      const updatedClients = prev.clients.map((existing) => {
        const imported = clients.find((c) => c.id === existing.id);
        if (imported && imported.updatedAt > existing.updatedAt) {
          return imported;
        }
        return existing;
      });
      return {
        ...prev,
        clients: [...updatedClients, ...newClients],
      };
    });
  }, []);

  // Export clients (for backup or sync)
  const exportClients = useCallback((): Client[] => {
    return state.clients;
  }, [state.clients]);

  return {
    // State
    clients: state.clients,
    selectedClientId: state.selectedClientId,
    searchQuery: state.searchQuery,
    selectedTags: state.selectedTags,

    // Actions
    createClient,
    updateClient,
    deleteClient,
    selectClient,
    setSearchQuery,
    toggleTagFilter,
    clearTagFilters,
    addTagToClient,
    removeTagFromClient,
    importClients,
    exportClients,

    // Getters
    getSelectedClient,
    getAllTags,
    getFilteredClients,
    getRandomColor,
  };
}
