import { z } from "zod";

// Zod schemas for validation
export const ClientSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  company: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()),
  hourlyRate: z.number().optional(),
  createdAt: z.number(),
  updatedAt: z.number(),
  // Cloud-only fields
  userId: z.string().optional(),
  syncedAt: z.number().optional(),
});

export type Client = z.infer<typeof ClientSchema>;

// For creating new clients (without id, timestamps)
export const CreateClientSchema = ClientSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  userId: true,
  syncedAt: true,
});

export type CreateClientInput = z.infer<typeof CreateClientSchema>;

// Form schema with string tags input (for React Hook Form)
export const ClientFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  phone: z.string().optional(),
  company: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
  hourlyRate: z.string().optional(),
  tagsInput: z.string().optional(),
});

export type ClientFormInput = z.infer<typeof ClientFormSchema>;

// For updating clients
export const UpdateClientSchema = ClientSchema.partial().required({ id: true });

export type UpdateClientInput = z.infer<typeof UpdateClientSchema>;

// CRM State
export interface CRMState {
  clients: Client[];
  selectedClientId: string | null;
  searchQuery: string;
  selectedTags: string[];
}

// Sync status for cloud integration
export type SyncStatus = "idle" | "syncing" | "synced" | "error";

export interface SyncState {
  status: SyncStatus;
  lastSyncedAt: number | null;
  error: string | null;
}
