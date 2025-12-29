"use client";

import { useState, useCallback } from "react";
import { cn } from "@nextui-org/react";
import { CreateInvoiceInput, LineItem, Invoice } from "@/types";

interface InvoiceFormProps {
  invoice?: Invoice;
  onSubmit: (data: CreateInvoiceInput) => void;
  onCancel: () => void;
  settings?: {
    defaultTaxRate?: number;
    defaultPaymentTerms?: string;
    currencySymbol?: string;
  };
}

interface LineItemInput {
  id: string;
  description: string;
  quantity: string;
  unitPrice: string;
}

function generateTempId(): string {
  return Math.random().toString(36).substring(2, 15);
}

function formatDateForInput(timestamp: number): string {
  return new Date(timestamp).toISOString().split("T")[0];
}

function parseDateToTimestamp(dateString: string): number {
  return new Date(dateString).getTime();
}

export function InvoiceForm({ invoice, onSubmit, onCancel, settings }: InvoiceFormProps) {
  const currencySymbol = settings?.currencySymbol || "$";
  const isEditing = !!invoice;

  const [clientName, setClientName] = useState(invoice?.clientName || "");
  const [clientEmail, setClientEmail] = useState(invoice?.clientEmail || "");
  const [clientAddress, setClientAddress] = useState(invoice?.clientAddress || "");
  const [issueDate, setIssueDate] = useState(
    formatDateForInput(invoice?.issueDate || Date.now())
  );
  const [dueDate, setDueDate] = useState(
    formatDateForInput(invoice?.dueDate || Date.now() + 30 * 24 * 60 * 60 * 1000)
  );
  const [taxRate, setTaxRate] = useState(
    String(invoice?.taxRate ?? settings?.defaultTaxRate ?? 0)
  );
  const [notes, setNotes] = useState(invoice?.notes || "");
  const [paymentTerms, setPaymentTerms] = useState(
    invoice?.paymentTerms || settings?.defaultPaymentTerms || ""
  );

  const [lineItems, setLineItems] = useState<LineItemInput[]>(() => {
    if (invoice?.lineItems && invoice.lineItems.length > 0) {
      return invoice.lineItems.map((item) => ({
        id: item.id,
        description: item.description,
        quantity: String(item.quantity),
        unitPrice: String(item.unitPrice),
      }));
    }
    return [{ id: generateTempId(), description: "", quantity: "1", unitPrice: "" }];
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const addLineItem = useCallback(() => {
    setLineItems((prev) => [
      ...prev,
      { id: generateTempId(), description: "", quantity: "1", unitPrice: "" },
    ]);
  }, []);

  const removeLineItem = useCallback((id: string) => {
    setLineItems((prev) => {
      if (prev.length === 1) return prev;
      return prev.filter((item) => item.id !== id);
    });
  }, []);

  const updateLineItem = useCallback(
    (id: string, field: keyof LineItemInput, value: string) => {
      setLineItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
      );
    },
    []
  );

  const calculateLineItemAmount = (item: LineItemInput): number => {
    const qty = parseFloat(item.quantity) || 0;
    const price = parseFloat(item.unitPrice) || 0;
    return Math.round(qty * price * 100) / 100;
  };

  const subtotal = lineItems.reduce((sum, item) => sum + calculateLineItemAmount(item), 0);
  const taxAmount = Math.round(subtotal * (parseFloat(taxRate) || 0) / 100 * 100) / 100;
  const total = Math.round((subtotal + taxAmount) * 100) / 100;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!clientName.trim()) {
      newErrors.clientName = "Client name is required";
    }

    if (!issueDate) {
      newErrors.issueDate = "Issue date is required";
    }

    if (!dueDate) {
      newErrors.dueDate = "Due date is required";
    }

    const validLineItems = lineItems.filter(
      (item) => item.description.trim() && parseFloat(item.unitPrice) > 0
    );

    if (validLineItems.length === 0) {
      newErrors.lineItems = "At least one line item with description and price is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const validLineItems: Omit<LineItem, "amount">[] = lineItems
      .filter((item) => item.description.trim() && parseFloat(item.unitPrice) > 0)
      .map((item) => ({
        id: item.id,
        description: item.description.trim(),
        quantity: parseFloat(item.quantity) || 1,
        unitPrice: parseFloat(item.unitPrice) || 0,
      }));

    onSubmit({
      clientName: clientName.trim(),
      clientEmail: clientEmail.trim(),
      clientAddress: clientAddress.trim(),
      issueDate: parseDateToTimestamp(issueDate),
      dueDate: parseDateToTimestamp(dueDate),
      lineItems: validLineItems as LineItem[],
      taxRate: parseFloat(taxRate) || undefined,
      notes: notes.trim(),
      paymentTerms: paymentTerms.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Client Information */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Client Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-1">
              Client Name *
            </label>
            <input
              id="clientName"
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className={cn(
                "w-full px-3 py-2 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500",
                errors.clientName ? "border-red-500" : "border-gray-300"
              )}
              placeholder="Enter client name"
            />
            {errors.clientName && (
              <p className="mt-1 text-sm text-red-500">{errors.clientName}</p>
            )}
          </div>
          <div>
            <label htmlFor="clientEmail" className="block text-sm font-medium text-gray-700 mb-1">
              Client Email
            </label>
            <input
              id="clientEmail"
              type="email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="client@example.com"
            />
          </div>
        </div>
        <div>
          <label htmlFor="clientAddress" className="block text-sm font-medium text-gray-700 mb-1">
            Client Address
          </label>
          <textarea
            id="clientAddress"
            value={clientAddress}
            onChange={(e) => setClientAddress(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            placeholder="Enter client address"
          />
        </div>
      </div>

      {/* Invoice Details */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Invoice Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700 mb-1">
              Issue Date *
            </label>
            <input
              id="issueDate"
              type="date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              className={cn(
                "w-full px-3 py-2 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500",
                errors.issueDate ? "border-red-500" : "border-gray-300"
              )}
            />
            {errors.issueDate && (
              <p className="mt-1 text-sm text-red-500">{errors.issueDate}</p>
            )}
          </div>
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
              Due Date *
            </label>
            <input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className={cn(
                "w-full px-3 py-2 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500",
                errors.dueDate ? "border-red-500" : "border-gray-300"
              )}
            />
            {errors.dueDate && (
              <p className="mt-1 text-sm text-red-500">{errors.dueDate}</p>
            )}
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Line Items
          </h3>
          <button
            type="button"
            onClick={addLineItem}
            className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700 font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Item
          </button>
        </div>

        {errors.lineItems && (
          <p className="text-sm text-red-500">{errors.lineItems}</p>
        )}

        <div className="space-y-3">
          {/* Header */}
          <div className="hidden md:grid md:grid-cols-12 gap-2 text-xs font-medium text-gray-500 uppercase px-1">
            <div className="col-span-5">Description</div>
            <div className="col-span-2 text-right">Qty</div>
            <div className="col-span-2 text-right">Price</div>
            <div className="col-span-2 text-right">Amount</div>
            <div className="col-span-1"></div>
          </div>

          {lineItems.map((item, index) => (
            <div
              key={item.id}
              className="grid grid-cols-12 gap-2 items-start p-3 bg-gray-50 rounded-lg"
            >
              <div className="col-span-12 md:col-span-5">
                <label className="md:hidden text-xs text-gray-500 mb-1 block">Description</label>
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => updateLineItem(item.id, "description", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Service or product description"
                />
              </div>
              <div className="col-span-4 md:col-span-2">
                <label className="md:hidden text-xs text-gray-500 mb-1 block">Qty</label>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateLineItem(item.id, "quantity", e.target.value)}
                  min="0.01"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm text-right focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="col-span-4 md:col-span-2">
                <label className="md:hidden text-xs text-gray-500 mb-1 block">Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                    {currencySymbol}
                  </span>
                  <input
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) => updateLineItem(item.id, "unitPrice", e.target.value)}
                    min="0"
                    step="0.01"
                    className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm text-right focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="col-span-3 md:col-span-2 flex items-center justify-end">
                <span className="text-sm font-medium text-gray-900 py-2">
                  {currencySymbol}{calculateLineItemAmount(item).toFixed(2)}
                </span>
              </div>
              <div className="col-span-1 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => removeLineItem(item.id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  disabled={lineItems.length === 1}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Totals */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex flex-col items-end space-y-2">
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium text-gray-900 w-24 text-right">
              {currencySymbol}{subtotal.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <label htmlFor="taxRate" className="text-gray-600">
              Tax Rate (%):
            </label>
            <input
              id="taxRate"
              type="number"
              value={taxRate}
              onChange={(e) => setTaxRate(e.target.value)}
              min="0"
              max="100"
              step="0.1"
              className="w-20 px-2 py-1 border border-gray-300 rounded text-gray-900 text-sm text-right focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          {parseFloat(taxRate) > 0 && (
            <div className="flex items-center gap-4 text-sm">
              <span className="text-gray-600">Tax:</span>
              <span className="font-medium text-gray-900 w-24 text-right">
                {currencySymbol}{taxAmount.toFixed(2)}
              </span>
            </div>
          )}
          <div className="flex items-center gap-4 text-lg border-t border-gray-200 pt-2 mt-2">
            <span className="font-semibold text-gray-900">Total:</span>
            <span className="font-bold text-green-600 w-24 text-right">
              {currencySymbol}{total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Notes & Terms */}
      <div className="space-y-4">
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            placeholder="Additional notes or instructions"
          />
        </div>
        <div>
          <label htmlFor="paymentTerms" className="block text-sm font-medium text-gray-700 mb-1">
            Payment Terms
          </label>
          <input
            id="paymentTerms"
            type="text"
            value={paymentTerms}
            onChange={(e) => setPaymentTerms(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="e.g., Net 30, Due on receipt"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
        >
          {isEditing ? "Update Invoice" : "Create Invoice"}
        </button>
      </div>
    </form>
  );
}
