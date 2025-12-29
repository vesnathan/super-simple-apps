"use client";

import { cn } from "@nextui-org/react";
import { Invoice, InvoiceStatus } from "@/types";

interface InvoiceSidebarProps {
  invoices: Invoice[];
  selectedInvoiceId: string | null;
  filterStatus: InvoiceStatus | "all";
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFilterChange: (status: InvoiceStatus | "all") => void;
  onSelectInvoice: (invoiceId: string | null) => void;
}

const statusColors: Record<InvoiceStatus, { bg: string; text: string; dot: string }> = {
  draft: { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" },
  sent: { bg: "bg-blue-100", text: "text-blue-600", dot: "bg-blue-500" },
  viewed: { bg: "bg-purple-100", text: "text-purple-600", dot: "bg-purple-500" },
  paid: { bg: "bg-green-100", text: "text-green-600", dot: "bg-green-500" },
  overdue: { bg: "bg-red-100", text: "text-red-600", dot: "bg-red-500" },
  cancelled: { bg: "bg-gray-100", text: "text-gray-500", dot: "bg-gray-400" },
};

const filterOptions: { value: InvoiceStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "draft", label: "Draft" },
  { value: "sent", label: "Sent" },
  { value: "paid", label: "Paid" },
  { value: "overdue", label: "Overdue" },
];

function formatCurrency(amount: number, symbol = "$"): string {
  return `${symbol}${amount.toFixed(2)}`;
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function InvoiceSidebarContent({
  invoices,
  selectedInvoiceId,
  filterStatus,
  searchQuery,
  onSearchChange,
  onFilterChange,
  onSelectInvoice,
}: InvoiceSidebarProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="p-3 border-b border-gray-100">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search invoices..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-3 py-2 border-b border-gray-100">
        <div className="flex gap-1 overflow-x-auto">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onFilterChange(option.value)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors",
                filterStatus === option.value
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices Section Header */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="font-medium text-sm">Invoices</span>
          {invoices.length > 0 && (
            <span className="ml-auto text-xs text-gray-400">{invoices.length}</span>
          )}
        </div>
      </div>

      {/* Invoices List */}
      <div className="flex-1 overflow-y-auto">
        {invoices.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">
            {searchQuery || filterStatus !== "all" ? "No invoices found" : "No invoices yet"}
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {invoices.map((invoice) => {
              const colors = statusColors[invoice.status];
              const isOverdue = invoice.status !== "paid" && invoice.status !== "cancelled" && invoice.dueDate < Date.now();
              const displayStatus = isOverdue && invoice.status !== "paid" ? "overdue" : invoice.status;
              const displayColors = statusColors[displayStatus];

              return (
                <li key={invoice.id}>
                  <button
                    onClick={() => onSelectInvoice(invoice.id)}
                    className={cn(
                      "w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors",
                      selectedInvoiceId === invoice.id && "bg-green-50 border-l-4 border-green-600"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900 text-sm">{invoice.invoiceNumber}</p>
                          <span
                            className={cn(
                              "px-2 py-0.5 text-xs rounded-full flex items-center gap-1",
                              displayColors.bg,
                              displayColors.text
                            )}
                          >
                            <span className={cn("w-1.5 h-1.5 rounded-full", displayColors.dot)} />
                            {displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 truncate mt-0.5">{invoice.clientName}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{formatCurrency(invoice.total)}</p>
                        <p className="text-xs text-gray-500">{formatDate(invoice.issueDate)}</p>
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
