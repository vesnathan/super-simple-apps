/**
 * GraphQL resolver: Query.getInvoice
 *
 * Fetches a single invoice by ID for the authenticated user.
 *
 * @module resolvers/invoices/Queries
 */

import { util, Context } from "@aws-appsync/utils";

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  timerSessionId?: string;
}

interface InvoiceItem {
  PK: string;
  SK: string;
  id: string;
  userId: string;
  invoiceNumber: string;
  clientId?: string;
  clientName: string;
  clientEmail?: string;
  clientAddress?: string;
  issueDate: number;
  dueDate: number;
  status: string;
  lineItems: LineItem[];
  subtotal: number;
  taxRate?: number;
  taxAmount?: number;
  total: number;
  notes?: string;
  paymentTerms?: string;
  createdAt: number;
  updatedAt: number;
  syncedAt?: number;
  sentAt?: number;
  viewedAt?: number;
  paidAt?: number;
}

interface Invoice {
  __typename: "Invoice";
  id: string;
  userId: string;
  invoiceNumber: string;
  clientId: string | null;
  clientName: string;
  clientEmail: string | null;
  clientAddress: string | null;
  issueDate: number;
  dueDate: number;
  status: string;
  lineItems: LineItem[];
  subtotal: number;
  taxRate: number | null;
  taxAmount: number | null;
  total: number;
  notes: string | null;
  paymentTerms: string | null;
  createdAt: number;
  updatedAt: number;
  syncedAt: number | null;
  sentAt: number | null;
  viewedAt: number | null;
  paidAt: number | null;
}

type CTX = Context<{ id: string }, object, object, object, InvoiceItem | null>;

/**
 * Prepares DynamoDB GetItem request for fetching an invoice.
 *
 * @param ctx - AppSync context containing invoice ID
 * @returns DynamoDB GetItem request configuration
 */
export function request(ctx: CTX) {
  const { id } = ctx.args;
  const userId = ctx.identity?.sub;

  if (!userId) {
    return util.error("Unauthorized", "UnauthorizedException");
  }

  if (!id) {
    return util.error("Invoice ID is required", "ValidationException");
  }

  return {
    operation: "GetItem",
    key: util.dynamodb.toMapValues({
      PK: `USER#${userId}#INVOICE#${id}`,
      SK: "METADATA",
    }),
  };
}

/**
 * Processes DynamoDB response and returns formatted Invoice object.
 *
 * @param ctx - AppSync context containing DynamoDB result
 * @returns Formatted Invoice response object or null if not found
 */
export function response(ctx: CTX): Invoice | null {
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

  const invoice: Invoice = {
    __typename: "Invoice",
    id: item.id,
    userId: item.userId,
    invoiceNumber: item.invoiceNumber,
    clientId: item.clientId || null,
    clientName: item.clientName,
    clientEmail: item.clientEmail || null,
    clientAddress: item.clientAddress || null,
    issueDate: item.issueDate,
    dueDate: item.dueDate,
    status: item.status,
    lineItems: item.lineItems || [],
    subtotal: item.subtotal,
    taxRate: item.taxRate !== undefined ? item.taxRate : null,
    taxAmount: item.taxAmount !== undefined ? item.taxAmount : null,
    total: item.total,
    notes: item.notes || null,
    paymentTerms: item.paymentTerms || null,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    syncedAt: item.syncedAt || null,
    sentAt: item.sentAt || null,
    viewedAt: item.viewedAt || null,
    paidAt: item.paidAt || null,
  };

  return invoice;
}
