/**
 * GraphQL resolver: Query.listInvoices
 *
 * Lists all invoices for the authenticated user.
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

interface InvoiceConnection {
  items: Invoice[];
  nextToken: string | null;
}

interface QueryResult {
  items: InvoiceItem[];
  nextToken?: string;
}

type CTX = Context<{ limit?: number; nextToken?: string }, object, object, object, QueryResult>;

/**
 * Prepares DynamoDB Query request for listing invoices.
 *
 * @param ctx - AppSync context containing pagination params
 * @returns DynamoDB Query request configuration
 */
export function request(ctx: CTX) {
  const userId = ctx.identity?.sub;

  if (!userId) {
    return util.error("Unauthorized", "UnauthorizedException");
  }

  const limit = ctx.args.limit || 50;

  const query: Record<string, unknown> = {
    operation: "Query",
    index: "GSI1",
    query: {
      expression: "GSI1PK = :pk",
      expressionValues: util.dynamodb.toMapValues({
        ":pk": `USER#${userId}#TYPE#INVOICE`,
      }),
    },
    limit,
    scanIndexForward: false, // Newest first
  };

  if (ctx.args.nextToken) {
    query.nextToken = ctx.args.nextToken;
  }

  return query;
}

/**
 * Processes DynamoDB response and returns formatted InvoiceConnection.
 *
 * @param ctx - AppSync context containing DynamoDB result
 * @returns Formatted InvoiceConnection response object
 */
export function response(ctx: CTX): InvoiceConnection {
  if (ctx.error) {
    return util.error(ctx.error.message, ctx.error.type) as never;
  }

  const items: Invoice[] = [];

  if (ctx.result?.items) {
    for (const item of ctx.result.items) {
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
      items.push(invoice);
    }
  }

  return {
    items,
    nextToken: ctx.result?.nextToken || null,
  };
}
