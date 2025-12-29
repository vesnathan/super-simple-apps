/**
 * GraphQL resolver: Mutation.syncInvoices
 *
 * Bulk syncs invoices from local storage to cloud.
 * Uses TransactWriteItems for atomic batch operations.
 *
 * @module resolvers/invoices/Mutations
 */

import { util, Context } from "@aws-appsync/utils";

interface LineItemInput {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  timerSessionId?: string;
}

interface SyncInvoiceInput {
  id: string;
  invoiceNumber: string;
  clientId?: string;
  clientName: string;
  clientEmail?: string;
  clientAddress?: string;
  issueDate: number;
  dueDate: number;
  status: string;
  lineItems: LineItemInput[];
  subtotal: number;
  taxRate?: number;
  taxAmount?: number;
  total: number;
  notes?: string;
  paymentTerms?: string;
  createdAt: number;
  updatedAt: number;
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
  lineItems: LineItemInput[];
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

interface SyncResult {
  synced: number;
  failed: number;
  invoices: Invoice[];
}

type CTX = Context<{ invoices: SyncInvoiceInput[] }, object, object, object, unknown>;

/**
 * Prepares DynamoDB TransactWriteItems request for bulk syncing invoices.
 *
 * @param ctx - AppSync context containing invoices to sync
 * @returns DynamoDB TransactWriteItems request configuration
 */
export function request(ctx: CTX) {
  const userId = ctx.identity?.sub;

  if (!userId) {
    return util.error("Unauthorized", "UnauthorizedException");
  }

  const { invoices } = ctx.args;

  if (!invoices || invoices.length === 0) {
    return util.error("No invoices to sync", "ValidationException");
  }

  // DynamoDB TransactWriteItems has a limit of 25 items
  if (invoices.length > 25) {
    return util.error("Maximum 25 invoices can be synced at once", "ValidationException");
  }

  const now = util.time.nowEpochMilliSeconds();

  const transactItems: unknown[] = [];

  for (const invoice of invoices) {
    const item = {
      PK: `USER#${userId}#INVOICE#${invoice.id}`,
      SK: "METADATA",
      GSI1PK: `USER#${userId}#TYPE#INVOICE`,
      GSI1SK: `DATE#${invoice.issueDate}`,
      id: invoice.id,
      userId,
      invoiceNumber: invoice.invoiceNumber,
      clientId: invoice.clientId,
      clientName: invoice.clientName,
      clientEmail: invoice.clientEmail,
      clientAddress: invoice.clientAddress,
      issueDate: invoice.issueDate,
      dueDate: invoice.dueDate,
      status: invoice.status,
      lineItems: invoice.lineItems,
      subtotal: invoice.subtotal,
      taxRate: invoice.taxRate,
      taxAmount: invoice.taxAmount,
      total: invoice.total,
      notes: invoice.notes,
      paymentTerms: invoice.paymentTerms,
      createdAt: invoice.createdAt,
      updatedAt: invoice.updatedAt,
      syncedAt: now,
      sentAt: invoice.sentAt,
      viewedAt: invoice.viewedAt,
      paidAt: invoice.paidAt,
    };

    transactItems.push({
      table: ctx.stash.tableName,
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
    transactItems,
  };
}

/**
 * Processes DynamoDB response and returns sync result.
 *
 * @param ctx - AppSync context containing DynamoDB result
 * @returns SyncResult with synced count and invoices
 */
export function response(ctx: CTX): SyncResult {
  if (ctx.error) {
    return util.error(ctx.error.message, ctx.error.type) as never;
  }

  const userId = ctx.identity?.sub;
  const { invoices } = ctx.args;
  const now = util.time.nowEpochMilliSeconds();

  const syncedInvoices: Invoice[] = [];

  for (const invoice of invoices) {
    const syncedInvoice: Invoice = {
      __typename: "Invoice",
      id: invoice.id,
      userId: userId || "",
      invoiceNumber: invoice.invoiceNumber,
      clientId: invoice.clientId || null,
      clientName: invoice.clientName,
      clientEmail: invoice.clientEmail || null,
      clientAddress: invoice.clientAddress || null,
      issueDate: invoice.issueDate,
      dueDate: invoice.dueDate,
      status: invoice.status,
      lineItems: invoice.lineItems,
      subtotal: invoice.subtotal,
      taxRate: invoice.taxRate !== undefined ? invoice.taxRate : null,
      taxAmount: invoice.taxAmount !== undefined ? invoice.taxAmount : null,
      total: invoice.total,
      notes: invoice.notes || null,
      paymentTerms: invoice.paymentTerms || null,
      createdAt: invoice.createdAt,
      updatedAt: invoice.updatedAt,
      syncedAt: now,
      sentAt: invoice.sentAt || null,
      viewedAt: invoice.viewedAt || null,
      paidAt: invoice.paidAt || null,
    };
    syncedInvoices.push(syncedInvoice);
  }

  return {
    synced: invoices.length,
    failed: 0,
    invoices: syncedInvoices,
  };
}
