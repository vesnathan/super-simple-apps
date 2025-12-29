/**
 * GraphQL resolver: Mutation.updateInvoice
 *
 * Updates an existing invoice for the authenticated user.
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

interface UpdateInvoiceInput {
  id: string;
  invoiceNumber?: string;
  clientId?: string;
  clientName?: string;
  clientEmail?: string;
  clientAddress?: string;
  issueDate?: number;
  dueDate?: number;
  status?: string;
  lineItems?: LineItemInput[];
  subtotal?: number;
  taxRate?: number;
  taxAmount?: number;
  total?: number;
  notes?: string;
  paymentTerms?: string;
  sentAt?: number;
  viewedAt?: number;
  paidAt?: number;
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
  lineItems: LineItemInput[];
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

type CTX = Context<{ input: UpdateInvoiceInput }, object, object, object, InvoiceItem>;

/**
 * Prepares DynamoDB UpdateItem request for updating an invoice.
 *
 * @param ctx - AppSync context containing invoice input
 * @returns DynamoDB UpdateItem request configuration
 */
export function request(ctx: CTX) {
  const userId = ctx.identity?.sub;

  if (!userId) {
    return util.error("Unauthorized", "UnauthorizedException");
  }

  const { input } = ctx.args;

  if (!input.id) {
    return util.error("Invoice ID is required", "ValidationException");
  }

  const now = util.time.nowEpochMilliSeconds();

  // Build update expression dynamically
  const expressionNames: Record<string, string> = {};
  const expressionValues: Record<string, unknown> = {
    ":updatedAt": now,
    ":syncedAt": now,
    ":userId": userId,
  };

  const updateParts: string[] = ["updatedAt = :updatedAt", "syncedAt = :syncedAt"];

  if (input.invoiceNumber !== undefined) {
    expressionNames["#invoiceNumber"] = "invoiceNumber";
    expressionValues[":invoiceNumber"] = input.invoiceNumber;
    updateParts.push("#invoiceNumber = :invoiceNumber");
  }

  if (input.clientId !== undefined) {
    expressionNames["#clientId"] = "clientId";
    expressionValues[":clientId"] = input.clientId;
    updateParts.push("#clientId = :clientId");
  }

  if (input.clientName !== undefined) {
    expressionNames["#clientName"] = "clientName";
    expressionValues[":clientName"] = input.clientName;
    updateParts.push("#clientName = :clientName");
  }

  if (input.clientEmail !== undefined) {
    expressionNames["#clientEmail"] = "clientEmail";
    expressionValues[":clientEmail"] = input.clientEmail;
    updateParts.push("#clientEmail = :clientEmail");
  }

  if (input.clientAddress !== undefined) {
    expressionNames["#clientAddress"] = "clientAddress";
    expressionValues[":clientAddress"] = input.clientAddress;
    updateParts.push("#clientAddress = :clientAddress");
  }

  if (input.issueDate !== undefined) {
    expressionNames["#issueDate"] = "issueDate";
    expressionValues[":issueDate"] = input.issueDate;
    updateParts.push("#issueDate = :issueDate");
  }

  if (input.dueDate !== undefined) {
    expressionNames["#dueDate"] = "dueDate";
    expressionValues[":dueDate"] = input.dueDate;
    updateParts.push("#dueDate = :dueDate");
  }

  if (input.status !== undefined) {
    expressionNames["#status"] = "status";
    expressionValues[":status"] = input.status;
    updateParts.push("#status = :status");
  }

  if (input.lineItems !== undefined) {
    expressionNames["#lineItems"] = "lineItems";
    expressionValues[":lineItems"] = input.lineItems;
    updateParts.push("#lineItems = :lineItems");
  }

  if (input.subtotal !== undefined) {
    expressionNames["#subtotal"] = "subtotal";
    expressionValues[":subtotal"] = input.subtotal;
    updateParts.push("#subtotal = :subtotal");
  }

  if (input.taxRate !== undefined) {
    expressionNames["#taxRate"] = "taxRate";
    expressionValues[":taxRate"] = input.taxRate;
    updateParts.push("#taxRate = :taxRate");
  }

  if (input.taxAmount !== undefined) {
    expressionNames["#taxAmount"] = "taxAmount";
    expressionValues[":taxAmount"] = input.taxAmount;
    updateParts.push("#taxAmount = :taxAmount");
  }

  if (input.total !== undefined) {
    expressionNames["#total"] = "total";
    expressionValues[":total"] = input.total;
    updateParts.push("#total = :total");
  }

  if (input.notes !== undefined) {
    expressionNames["#notes"] = "notes";
    expressionValues[":notes"] = input.notes;
    updateParts.push("#notes = :notes");
  }

  if (input.paymentTerms !== undefined) {
    expressionNames["#paymentTerms"] = "paymentTerms";
    expressionValues[":paymentTerms"] = input.paymentTerms;
    updateParts.push("#paymentTerms = :paymentTerms");
  }

  if (input.sentAt !== undefined) {
    expressionNames["#sentAt"] = "sentAt";
    expressionValues[":sentAt"] = input.sentAt;
    updateParts.push("#sentAt = :sentAt");
  }

  if (input.viewedAt !== undefined) {
    expressionNames["#viewedAt"] = "viewedAt";
    expressionValues[":viewedAt"] = input.viewedAt;
    updateParts.push("#viewedAt = :viewedAt");
  }

  if (input.paidAt !== undefined) {
    expressionNames["#paidAt"] = "paidAt";
    expressionValues[":paidAt"] = input.paidAt;
    updateParts.push("#paidAt = :paidAt");
  }

  return {
    operation: "UpdateItem",
    key: util.dynamodb.toMapValues({
      PK: `USER#${userId}#INVOICE#${input.id}`,
      SK: "METADATA",
    }),
    update: {
      expression: `SET ${updateParts.join(", ")}`,
      expressionNames: Object.keys(expressionNames).length > 0 ? expressionNames : undefined,
      expressionValues: util.dynamodb.toMapValues(expressionValues),
    },
    condition: {
      expression: "attribute_exists(PK) AND userId = :userId",
      expressionValues: util.dynamodb.toMapValues({ ":userId": userId }),
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
      return util.error("Invoice not found or unauthorized", "NotFoundException") as never;
    }
    return util.error(ctx.error.message, ctx.error.type) as never;
  }

  const item = ctx.result;

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
