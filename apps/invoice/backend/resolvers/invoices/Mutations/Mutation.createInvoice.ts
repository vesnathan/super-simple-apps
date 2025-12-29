/**
 * GraphQL resolver: Mutation.createInvoice
 *
 * Creates a new invoice for the authenticated user.
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

interface CreateInvoiceInput {
  id?: string;
  invoiceNumber?: string;
  clientId?: string;
  clientName: string;
  clientEmail?: string;
  clientAddress?: string;
  issueDate: number;
  dueDate: number;
  status?: string;
  lineItems: LineItemInput[];
  subtotal?: number;
  taxRate?: number;
  taxAmount?: number;
  total?: number;
  notes?: string;
  paymentTerms?: string;
  createdAt?: number;
  updatedAt?: number;
  sentAt?: number;
  viewedAt?: number;
  paidAt?: number;
}

interface InvoiceItem {
  PK: string;
  SK: string;
  GSI1PK: string;
  GSI1SK: string;
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
  lineItems: LineItemInput[];
  subtotal: number;
  taxRate?: number;
  taxAmount?: number;
  total: number;
  notes?: string;
  paymentTerms?: string;
  createdAt: number;
  updatedAt: number;
  syncedAt: number;
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

type CTX = Context<{ input: CreateInvoiceInput }, object, object, object, InvoiceItem>;

/**
 * Prepares DynamoDB PutItem request for creating an invoice.
 *
 * @param ctx - AppSync context containing invoice input
 * @returns DynamoDB PutItem request configuration
 */
export function request(ctx: CTX) {
  const userId = ctx.identity?.sub;

  if (!userId) {
    return util.error("Unauthorized", "UnauthorizedException");
  }

  const { input } = ctx.args;

  if (!input.clientName) {
    return util.error("Client name is required", "ValidationException");
  }

  if (!input.lineItems || input.lineItems.length === 0) {
    return util.error("At least one line item is required", "ValidationException");
  }

  const id = input.id || util.autoId();
  const now = util.time.nowEpochMilliSeconds();
  const invoiceNumber = input.invoiceNumber || `INV-${util.autoId().substring(0, 8).toUpperCase()}`;

  // Calculate totals if not provided
  let subtotal = input.subtotal || 0;
  if (!input.subtotal) {
    for (const item of input.lineItems) {
      subtotal = subtotal + item.amount;
    }
  }

  const taxRate = input.taxRate || 0;
  const taxAmount = input.taxAmount !== undefined ? input.taxAmount : (subtotal * taxRate / 100);
  const total = input.total !== undefined ? input.total : (subtotal + taxAmount);

  const item: InvoiceItem = {
    PK: `USER#${userId}#INVOICE#${id}`,
    SK: "METADATA",
    GSI1PK: `USER#${userId}#TYPE#INVOICE`,
    GSI1SK: `DATE#${input.issueDate}`,
    id,
    userId,
    invoiceNumber,
    clientName: input.clientName,
    issueDate: input.issueDate,
    dueDate: input.dueDate,
    status: input.status || "draft",
    lineItems: input.lineItems,
    subtotal,
    total,
    createdAt: input.createdAt || now,
    updatedAt: input.updatedAt || now,
    syncedAt: now,
  };

  // Add optional fields if provided
  if (input.clientId) {
    item.clientId = input.clientId;
  }
  if (input.clientEmail) {
    item.clientEmail = input.clientEmail;
  }
  if (input.clientAddress) {
    item.clientAddress = input.clientAddress;
  }
  if (taxRate > 0) {
    item.taxRate = taxRate;
    item.taxAmount = taxAmount;
  }
  if (input.notes) {
    item.notes = input.notes;
  }
  if (input.paymentTerms) {
    item.paymentTerms = input.paymentTerms;
  }
  if (input.sentAt) {
    item.sentAt = input.sentAt;
  }
  if (input.viewedAt) {
    item.viewedAt = input.viewedAt;
  }
  if (input.paidAt) {
    item.paidAt = input.paidAt;
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
 * Processes DynamoDB response and returns formatted Invoice object.
 *
 * @param ctx - AppSync context containing DynamoDB result
 * @returns Formatted Invoice response object
 */
export function response(ctx: CTX): Invoice {
  if (ctx.error) {
    if (ctx.error.type === "DynamoDB:ConditionalCheckFailedException") {
      return util.error("Invoice already exists", "ConflictException") as never;
    }
    return util.error(ctx.error.message, ctx.error.type) as never;
  }

  const userId = ctx.identity?.sub;
  const { input } = ctx.args;
  const id = input.id || ctx.result?.id;
  const now = util.time.nowEpochMilliSeconds();

  // Calculate totals
  let subtotal = input.subtotal || 0;
  if (!input.subtotal) {
    for (const item of input.lineItems) {
      subtotal = subtotal + item.amount;
    }
  }
  const taxRate = input.taxRate || 0;
  const taxAmount = input.taxAmount !== undefined ? input.taxAmount : (subtotal * taxRate / 100);
  const total = input.total !== undefined ? input.total : (subtotal + taxAmount);

  const invoice: Invoice = {
    __typename: "Invoice",
    id: id || "",
    userId: userId || "",
    invoiceNumber: input.invoiceNumber || `INV-${(id || "").substring(0, 8).toUpperCase()}`,
    clientId: input.clientId || null,
    clientName: input.clientName,
    clientEmail: input.clientEmail || null,
    clientAddress: input.clientAddress || null,
    issueDate: input.issueDate,
    dueDate: input.dueDate,
    status: input.status || "draft",
    lineItems: input.lineItems,
    subtotal,
    taxRate: taxRate > 0 ? taxRate : null,
    taxAmount: taxRate > 0 ? taxAmount : null,
    total,
    notes: input.notes || null,
    paymentTerms: input.paymentTerms || null,
    createdAt: input.createdAt || now,
    updatedAt: input.updatedAt || now,
    syncedAt: now,
    sentAt: input.sentAt || null,
    viewedAt: input.viewedAt || null,
    paidAt: input.paidAt || null,
  };

  return invoice;
}
