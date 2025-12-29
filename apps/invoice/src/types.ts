import { z } from "zod";

// Invoice status enum
export const InvoiceStatusSchema = z.enum([
  "draft",
  "sent",
  "viewed",
  "paid",
  "overdue",
  "cancelled",
]);
export type InvoiceStatus = z.infer<typeof InvoiceStatusSchema>;

// Line item schema
export const LineItemSchema = z.object({
  id: z.string(),
  description: z.string().min(1, "Description is required"),
  quantity: z.number().min(0.01, "Quantity must be positive"),
  unitPrice: z.number().min(0, "Unit price must be non-negative"),
  amount: z.number(), // quantity * unitPrice
  // Optional: link to timer session
  timerSessionId: z.string().optional(),
});
export type LineItem = z.infer<typeof LineItemSchema>;

// Invoice schema
export const InvoiceSchema = z.object({
  id: z.string(),
  invoiceNumber: z.string().min(1, "Invoice number is required"),

  // Client info (denormalized for offline use)
  clientId: z.string().optional(),
  clientName: z.string().min(1, "Client name is required"),
  clientEmail: z.string().email().optional().or(z.literal("")),
  clientAddress: z.string().optional(),

  // Invoice details
  issueDate: z.number(), // timestamp
  dueDate: z.number(), // timestamp
  status: InvoiceStatusSchema,

  // Line items
  lineItems: z.array(LineItemSchema),

  // Totals
  subtotal: z.number(),
  taxRate: z.number().min(0).max(100).optional(),
  taxAmount: z.number().optional(),
  total: z.number(),

  // Payment info
  notes: z.string().optional(),
  paymentTerms: z.string().optional(),

  // Metadata
  createdAt: z.number(),
  updatedAt: z.number(),
  userId: z.string().optional(),
  syncedAt: z.number().optional(),

  // Sent info
  sentAt: z.number().optional(),
  viewedAt: z.number().optional(),
  paidAt: z.number().optional(),
});
export type Invoice = z.infer<typeof InvoiceSchema>;

// Create invoice input
export const CreateInvoiceInputSchema = InvoiceSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  userId: true,
  syncedAt: true,
}).partial({
  invoiceNumber: true,
  subtotal: true,
  total: true,
  taxAmount: true,
  status: true,
});
export type CreateInvoiceInput = z.infer<typeof CreateInvoiceInputSchema>;

// Update invoice input
export const UpdateInvoiceInputSchema = InvoiceSchema.partial().required({ id: true });
export type UpdateInvoiceInput = z.infer<typeof UpdateInvoiceInputSchema>;

// Business settings (for invoice customization)
export const BusinessSettingsSchema = z.object({
  businessName: z.string().optional(),
  businessEmail: z.string().email().optional().or(z.literal("")),
  businessPhone: z.string().optional(),
  businessAddress: z.string().optional(),
  logoUrl: z.string().optional(),
  defaultTaxRate: z.number().min(0).max(100).optional(),
  defaultPaymentTerms: z.string().optional(),
  invoicePrefix: z.string().optional(),
  nextInvoiceNumber: z.number().optional(),
  currency: z.string().optional(),
  currencySymbol: z.string().optional(),
});
export type BusinessSettings = z.infer<typeof BusinessSettingsSchema>;

// Invoice state for the hook
export interface InvoiceState {
  invoices: Invoice[];
  settings: BusinessSettings;
  selectedInvoiceId: string | null;
  filterStatus: InvoiceStatus | "all";
  searchQuery: string;
}

// Client reference (for importing from CRM)
export interface ClientReference {
  id: string;
  name: string;
  email?: string;
  address?: string;
  hourlyRate?: number;
}

// Timer session reference (for importing from Job Timer)
export interface TimerSessionReference {
  id: string;
  clientId?: string;
  clientName?: string;
  description: string;
  durationMinutes: number;
  hourlyRate?: number;
  date: number;
}
