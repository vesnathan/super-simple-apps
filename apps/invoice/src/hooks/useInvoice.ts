"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Invoice,
  InvoiceState,
  CreateInvoiceInput,
  UpdateInvoiceInput,
  BusinessSettings,
  LineItem,
  InvoiceStatus,
  ClientReference,
  TimerSessionReference,
} from "@/types";

const STORAGE_KEY = "super-simple-apps-invoice";
const SETTINGS_KEY = "super-simple-apps-invoice-settings";

function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function loadState(): InvoiceState {
  if (typeof window === "undefined") {
    return {
      invoices: [],
      settings: {},
      selectedInvoiceId: null,
      filterStatus: "all",
      searchQuery: "",
    };
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const settingsStored = localStorage.getItem(SETTINGS_KEY);

    const invoices = stored ? JSON.parse(stored) : [];
    const settings = settingsStored ? JSON.parse(settingsStored) : {};

    return {
      invoices,
      settings,
      selectedInvoiceId: null,
      filterStatus: "all",
      searchQuery: "",
    };
  } catch {
    return {
      invoices: [],
      settings: {},
      selectedInvoiceId: null,
      filterStatus: "all",
      searchQuery: "",
    };
  }
}

function saveInvoices(invoices: Invoice[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
  } catch {
    // ignore
  }
}

function saveSettings(settings: BusinessSettings): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // ignore
  }
}

function calculateLineItemAmount(item: Omit<LineItem, "amount">): number {
  return Math.round(item.quantity * item.unitPrice * 100) / 100;
}

function calculateInvoiceTotals(
  lineItems: LineItem[],
  taxRate?: number
): { subtotal: number; taxAmount: number; total: number } {
  const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = taxRate ? Math.round(subtotal * (taxRate / 100) * 100) / 100 : 0;
  const total = Math.round((subtotal + taxAmount) * 100) / 100;
  return { subtotal, taxAmount, total };
}

export function useInvoice() {
  const [state, setState] = useState<InvoiceState>(() => loadState());

  // Load state on mount
  useEffect(() => {
    setState(loadState());
  }, []);

  // Save invoices on changes
  useEffect(() => {
    saveInvoices(state.invoices);
  }, [state.invoices]);

  // Save settings on changes
  useEffect(() => {
    saveSettings(state.settings);
  }, [state.settings]);

  // Generate next invoice number
  const generateInvoiceNumber = useCallback((): string => {
    const prefix = state.settings.invoicePrefix || "INV";
    const nextNumber = state.settings.nextInvoiceNumber || 1;
    const paddedNumber = String(nextNumber).padStart(4, "0");
    return `${prefix}-${paddedNumber}`;
  }, [state.settings]);

  // Create a new invoice
  const createInvoice = useCallback((input: CreateInvoiceInput): Invoice => {
    const now = Date.now();
    const invoiceNumber = input.invoiceNumber || generateInvoiceNumber();

    // Calculate totals
    const lineItems = input.lineItems.map((item) => ({
      ...item,
      amount: calculateLineItemAmount(item),
    }));
    const { subtotal, taxAmount, total } = calculateInvoiceTotals(
      lineItems,
      input.taxRate ?? state.settings.defaultTaxRate
    );

    const newInvoice: Invoice = {
      id: generateId(),
      invoiceNumber,
      clientId: input.clientId,
      clientName: input.clientName,
      clientEmail: input.clientEmail || "",
      clientAddress: input.clientAddress || "",
      issueDate: input.issueDate,
      dueDate: input.dueDate,
      status: input.status || "draft",
      lineItems,
      subtotal,
      taxRate: input.taxRate ?? state.settings.defaultTaxRate,
      taxAmount,
      total,
      notes: input.notes || "",
      paymentTerms: input.paymentTerms || state.settings.defaultPaymentTerms || "",
      createdAt: now,
      updatedAt: now,
    };

    setState((prev) => {
      // Increment next invoice number
      const newSettings = {
        ...prev.settings,
        nextInvoiceNumber: (prev.settings.nextInvoiceNumber || 1) + 1,
      };
      saveSettings(newSettings);

      return {
        ...prev,
        invoices: [...prev.invoices, newInvoice],
        settings: newSettings,
      };
    });

    return newInvoice;
  }, [generateInvoiceNumber, state.settings]);

  // Update an existing invoice
  const updateInvoice = useCallback((input: UpdateInvoiceInput): void => {
    setState((prev) => ({
      ...prev,
      invoices: prev.invoices.map((invoice) => {
        if (invoice.id !== input.id) return invoice;

        // Recalculate totals if line items changed
        let updates: Partial<Invoice> = { ...input, updatedAt: Date.now() };

        if (input.lineItems) {
          const lineItems = input.lineItems.map((item) => ({
            ...item,
            amount: calculateLineItemAmount(item),
          }));
          const taxRate = input.taxRate ?? invoice.taxRate;
          const { subtotal, taxAmount, total } = calculateInvoiceTotals(lineItems, taxRate);
          updates = { ...updates, lineItems, subtotal, taxAmount, total };
        } else if (input.taxRate !== undefined && input.taxRate !== invoice.taxRate) {
          const { subtotal, taxAmount, total } = calculateInvoiceTotals(
            invoice.lineItems,
            input.taxRate
          );
          updates = { ...updates, subtotal, taxAmount, total };
        }

        return { ...invoice, ...updates };
      }),
    }));
  }, []);

  // Delete an invoice
  const deleteInvoice = useCallback((invoiceId: string): void => {
    setState((prev) => ({
      ...prev,
      invoices: prev.invoices.filter((inv) => inv.id !== invoiceId),
      selectedInvoiceId: prev.selectedInvoiceId === invoiceId ? null : prev.selectedInvoiceId,
    }));
  }, []);

  // Mark invoice as sent
  const markAsSent = useCallback((invoiceId: string): void => {
    const now = Date.now();
    setState((prev) => ({
      ...prev,
      invoices: prev.invoices.map((inv) =>
        inv.id === invoiceId
          ? { ...inv, status: "sent" as InvoiceStatus, sentAt: now, updatedAt: now }
          : inv
      ),
    }));
  }, []);

  // Mark invoice as paid
  const markAsPaid = useCallback((invoiceId: string): void => {
    const now = Date.now();
    setState((prev) => ({
      ...prev,
      invoices: prev.invoices.map((inv) =>
        inv.id === invoiceId
          ? { ...inv, status: "paid" as InvoiceStatus, paidAt: now, updatedAt: now }
          : inv
      ),
    }));
  }, []);

  // Duplicate an invoice
  const duplicateInvoice = useCallback((invoiceId: string): Invoice | null => {
    const original = state.invoices.find((inv) => inv.id === invoiceId);
    if (!original) return null;

    const now = Date.now();
    const invoiceNumber = generateInvoiceNumber();

    const duplicate: Invoice = {
      ...original,
      id: generateId(),
      invoiceNumber,
      status: "draft",
      issueDate: now,
      dueDate: now + 30 * 24 * 60 * 60 * 1000, // 30 days from now
      createdAt: now,
      updatedAt: now,
      sentAt: undefined,
      viewedAt: undefined,
      paidAt: undefined,
      syncedAt: undefined,
    };

    setState((prev) => {
      const newSettings = {
        ...prev.settings,
        nextInvoiceNumber: (prev.settings.nextInvoiceNumber || 1) + 1,
      };
      saveSettings(newSettings);

      return {
        ...prev,
        invoices: [...prev.invoices, duplicate],
        settings: newSettings,
      };
    });

    return duplicate;
  }, [state.invoices, generateInvoiceNumber]);

  // Create invoice from timer sessions
  const createInvoiceFromTimerSessions = useCallback(
    (
      client: ClientReference,
      sessions: TimerSessionReference[],
      hourlyRate?: number
    ): Invoice => {
      const rate = hourlyRate || client.hourlyRate || 50;

      const lineItems: LineItem[] = sessions.map((session) => {
        const hours = session.durationMinutes / 60;
        const amount = Math.round(hours * rate * 100) / 100;

        return {
          id: generateId(),
          description: session.description || `Work session - ${new Date(session.date).toLocaleDateString()}`,
          quantity: Math.round(hours * 100) / 100,
          unitPrice: rate,
          amount,
          timerSessionId: session.id,
        };
      });

      const now = Date.now();

      return createInvoice({
        clientId: client.id,
        clientName: client.name,
        clientEmail: client.email,
        clientAddress: client.address,
        issueDate: now,
        dueDate: now + 30 * 24 * 60 * 60 * 1000,
        lineItems,
      });
    },
    [createInvoice]
  );

  // Select an invoice
  const selectInvoice = useCallback((invoiceId: string | null): void => {
    setState((prev) => ({
      ...prev,
      selectedInvoiceId: invoiceId,
    }));
  }, []);

  // Set filter status
  const setFilterStatus = useCallback((status: InvoiceStatus | "all"): void => {
    setState((prev) => ({
      ...prev,
      filterStatus: status,
    }));
  }, []);

  // Set search query
  const setSearchQuery = useCallback((query: string): void => {
    setState((prev) => ({
      ...prev,
      searchQuery: query,
    }));
  }, []);

  // Update business settings
  const updateSettings = useCallback((updates: Partial<BusinessSettings>): void => {
    setState((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...updates },
    }));
  }, []);

  // Get selected invoice
  const getSelectedInvoice = useCallback((): Invoice | null => {
    return state.invoices.find((inv) => inv.id === state.selectedInvoiceId) || null;
  }, [state.invoices, state.selectedInvoiceId]);

  // Get filtered invoices
  const getFilteredInvoices = useCallback((): Invoice[] => {
    let filtered = state.invoices;

    // Filter by status
    if (state.filterStatus !== "all") {
      filtered = filtered.filter((inv) => inv.status === state.filterStatus);
    }

    // Filter by search query
    if (state.searchQuery.trim()) {
      const query = state.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (inv) =>
          inv.invoiceNumber.toLowerCase().includes(query) ||
          inv.clientName.toLowerCase().includes(query) ||
          inv.clientEmail?.toLowerCase().includes(query)
      );
    }

    // Sort by issue date (newest first)
    return filtered.sort((a, b) => b.issueDate - a.issueDate);
  }, [state.invoices, state.filterStatus, state.searchQuery]);

  // Get invoice stats
  const getInvoiceStats = useCallback(() => {
    const now = Date.now();
    const stats = {
      draft: 0,
      sent: 0,
      paid: 0,
      overdue: 0,
      totalOutstanding: 0,
      totalPaid: 0,
    };

    for (const invoice of state.invoices) {
      if (invoice.status === "draft") stats.draft++;
      else if (invoice.status === "sent" || invoice.status === "viewed") {
        if (invoice.dueDate < now) {
          stats.overdue++;
        } else {
          stats.sent++;
        }
        stats.totalOutstanding += invoice.total;
      } else if (invoice.status === "paid") {
        stats.paid++;
        stats.totalPaid += invoice.total;
      }
    }

    return stats;
  }, [state.invoices]);

  // Import invoices (for cloud sync)
  const importInvoices = useCallback((invoices: Invoice[]): void => {
    setState((prev) => {
      const existingIds = new Set(prev.invoices.map((inv) => inv.id));
      const newInvoices = invoices.filter((inv) => !existingIds.has(inv.id));
      const updatedInvoices = prev.invoices.map((existing) => {
        const imported = invoices.find((inv) => inv.id === existing.id);
        if (imported && imported.updatedAt > existing.updatedAt) {
          return imported;
        }
        return existing;
      });
      return {
        ...prev,
        invoices: [...updatedInvoices, ...newInvoices],
      };
    });
  }, []);

  // Export invoices (for backup)
  const exportInvoices = useCallback((): Invoice[] => {
    return state.invoices;
  }, [state.invoices]);

  return {
    // State
    invoices: state.invoices,
    settings: state.settings,
    selectedInvoiceId: state.selectedInvoiceId,
    filterStatus: state.filterStatus,
    searchQuery: state.searchQuery,

    // Actions
    createInvoice,
    updateInvoice,
    deleteInvoice,
    duplicateInvoice,
    markAsSent,
    markAsPaid,
    createInvoiceFromTimerSessions,
    selectInvoice,
    setFilterStatus,
    setSearchQuery,
    updateSettings,
    importInvoices,
    exportInvoices,

    // Getters
    getSelectedInvoice,
    getFilteredInvoices,
    getInvoiceStats,
    generateInvoiceNumber,
  };
}
