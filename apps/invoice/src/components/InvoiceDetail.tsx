"use client";

import { useState } from "react";
import { cn } from "@nextui-org/react";
import { Invoice, CreateInvoiceInput } from "@/types";
import { InvoiceForm } from "./InvoiceForm";

interface InvoiceDetailProps {
  invoice: Invoice;
  onUpdate: (data: CreateInvoiceInput) => void;
  onDelete: () => void;
  onMarkAsSent: () => void;
  onMarkAsPaid: () => void;
  onDuplicate: () => void;
  onClose: () => void;
  settings?: {
    defaultTaxRate?: number;
    defaultPaymentTerms?: string;
    currencySymbol?: string;
  };
}

const statusConfig = {
  draft: { label: "Draft", bg: "bg-gray-100", text: "text-gray-700", dot: "bg-gray-400" },
  sent: { label: "Sent", bg: "bg-blue-100", text: "text-blue-700", dot: "bg-blue-500" },
  viewed: { label: "Viewed", bg: "bg-purple-100", text: "text-purple-700", dot: "bg-purple-500" },
  paid: { label: "Paid", bg: "bg-green-100", text: "text-green-700", dot: "bg-green-500" },
  overdue: { label: "Overdue", bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500" },
  cancelled: { label: "Cancelled", bg: "bg-gray-100", text: "text-gray-500", dot: "bg-gray-400" },
};

function formatCurrency(amount: number, symbol = "$"): string {
  return `${symbol}${amount.toFixed(2)}`;
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function InvoiceDetail({
  invoice,
  onUpdate,
  onDelete,
  onMarkAsSent,
  onMarkAsPaid,
  onDuplicate,
  onClose,
  settings,
}: InvoiceDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const currencySymbol = settings?.currencySymbol || "$";
  const isOverdue = invoice.status !== "paid" && invoice.status !== "cancelled" && invoice.dueDate < Date.now();
  const displayStatus = isOverdue ? "overdue" : invoice.status;
  const status = statusConfig[displayStatus];

  const handleUpdate = (data: CreateInvoiceInput) => {
    onUpdate(data);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Edit Invoice</h2>
        <InvoiceForm
          invoice={invoice}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditing(false)}
          settings={settings}
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-gray-900">{invoice.invoiceNumber}</h2>
              <span
                className={cn(
                  "px-3 py-1 text-sm font-medium rounded-full flex items-center gap-1.5",
                  status.bg,
                  status.text
                )}
              >
                <span className={cn("w-2 h-2 rounded-full", status.dot)} />
                {status.label}
              </span>
            </div>
            <p className="text-gray-500 mt-1">Created {formatDate(invoice.createdAt)}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 mt-4">
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>

          {invoice.status === "draft" && (
            <button
              onClick={onMarkAsSent}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Mark as Sent
            </button>
          )}

          {(invoice.status === "sent" || invoice.status === "viewed" || isOverdue) && (
            <button
              onClick={onMarkAsPaid}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-green-700 bg-green-100 hover:bg-green-200 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Mark as Paid
            </button>
          )}

          <button
            onClick={onDuplicate}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Duplicate
          </button>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      </div>

      {/* Client Info */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Bill To
        </h3>
        <div className="text-gray-900">
          <p className="font-semibold text-lg">{invoice.clientName}</p>
          {invoice.clientEmail && <p className="text-gray-600">{invoice.clientEmail}</p>}
          {invoice.clientAddress && (
            <p className="text-gray-600 whitespace-pre-line mt-1">{invoice.clientAddress}</p>
          )}
        </div>
      </div>

      {/* Dates */}
      <div className="p-6 border-b border-gray-200 grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
            Issue Date
          </h3>
          <p className="text-gray-900">{formatDate(invoice.issueDate)}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
            Due Date
          </h3>
          <p className={cn("font-medium", isOverdue ? "text-red-600" : "text-gray-900")}>
            {formatDate(invoice.dueDate)}
            {isOverdue && <span className="text-sm ml-2">(Overdue)</span>}
          </p>
        </div>
      </div>

      {/* Line Items */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
          Items
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-200">
                <th className="pb-2">Description</th>
                <th className="pb-2 text-right">Qty</th>
                <th className="pb-2 text-right">Price</th>
                <th className="pb-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {invoice.lineItems.map((item) => (
                <tr key={item.id}>
                  <td className="py-3 text-gray-900">{item.description}</td>
                  <td className="py-3 text-right text-gray-600">{item.quantity}</td>
                  <td className="py-3 text-right text-gray-600">
                    {formatCurrency(item.unitPrice, currencySymbol)}
                  </td>
                  <td className="py-3 text-right font-medium text-gray-900">
                    {formatCurrency(item.amount, currencySymbol)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-col items-end space-y-1">
            <div className="flex items-center gap-8 text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium text-gray-900 w-28 text-right">
                {formatCurrency(invoice.subtotal, currencySymbol)}
              </span>
            </div>
            {invoice.taxRate && invoice.taxRate > 0 && (
              <div className="flex items-center gap-8 text-sm">
                <span className="text-gray-600">Tax ({invoice.taxRate}%):</span>
                <span className="font-medium text-gray-900 w-28 text-right">
                  {formatCurrency(invoice.taxAmount || 0, currencySymbol)}
                </span>
              </div>
            )}
            <div className="flex items-center gap-8 text-lg pt-2 border-t border-gray-200 mt-2">
              <span className="font-semibold text-gray-900">Total:</span>
              <span className="font-bold text-green-600 w-28 text-right">
                {formatCurrency(invoice.total, currencySymbol)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes & Terms */}
      {(invoice.notes || invoice.paymentTerms) && (
        <div className="p-6 space-y-4">
          {invoice.notes && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Notes
              </h3>
              <p className="text-gray-700 whitespace-pre-line">{invoice.notes}</p>
            </div>
          )}
          {invoice.paymentTerms && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Payment Terms
              </h3>
              <p className="text-gray-700">{invoice.paymentTerms}</p>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Invoice?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete invoice {invoice.invoiceNumber}? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete();
                  setShowDeleteConfirm(false);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
