"use client";

import { useState, useCallback } from "react";
import { MainLayout } from "@/components/MainLayout";
import { InvoiceSidebarContent } from "@/components/InvoiceSidebar";
import { InvoiceDetail } from "@/components/InvoiceDetail";
import { InvoiceForm } from "@/components/InvoiceForm";
import { AdBanner, LocalStorageWarning, Footer, WelcomeScreen } from "@super-simple-apps/shared-assets";
import { useInvoice } from "@/hooks/useInvoice";
import { CreateInvoiceInput } from "@/types";

export default function Home() {
  const {
    invoices,
    settings,
    selectedInvoiceId,
    filterStatus,
    searchQuery,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    duplicateInvoice,
    markAsSent,
    markAsPaid,
    selectInvoice,
    setFilterStatus,
    setSearchQuery,
    getSelectedInvoice,
    getFilteredInvoices,
  } = useInvoice();

  const [isCreating, setIsCreating] = useState(false);

  const selectedInvoice = getSelectedInvoice();
  const filteredInvoices = getFilteredInvoices();

  const handleCreateInvoice = useCallback((data: CreateInvoiceInput) => {
    const newInvoice = createInvoice(data);
    selectInvoice(newInvoice.id);
    setIsCreating(false);
  }, [createInvoice, selectInvoice]);

  const handleUpdateInvoice = useCallback((data: CreateInvoiceInput) => {
    if (selectedInvoiceId) {
      updateInvoice({ id: selectedInvoiceId, ...data });
    }
  }, [selectedInvoiceId, updateInvoice]);

  const handleDeleteInvoice = useCallback(() => {
    if (selectedInvoiceId) {
      deleteInvoice(selectedInvoiceId);
    }
  }, [selectedInvoiceId, deleteInvoice]);

  const handleDuplicateInvoice = useCallback(() => {
    if (selectedInvoiceId) {
      const duplicate = duplicateInvoice(selectedInvoiceId);
      if (duplicate) {
        selectInvoice(duplicate.id);
      }
    }
  }, [selectedInvoiceId, duplicateInvoice, selectInvoice]);

  const handleMarkAsSent = useCallback(() => {
    if (selectedInvoiceId) {
      markAsSent(selectedInvoiceId);
    }
  }, [selectedInvoiceId, markAsSent]);

  const handleMarkAsPaid = useCallback(() => {
    if (selectedInvoiceId) {
      markAsPaid(selectedInvoiceId);
    }
  }, [selectedInvoiceId, markAsPaid]);

  const sidebarContent = (
    <InvoiceSidebarContent
      invoices={filteredInvoices}
      selectedInvoiceId={selectedInvoiceId}
      filterStatus={filterStatus}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      onFilterChange={setFilterStatus}
      onSelectInvoice={(id) => {
        selectInvoice(id);
        setIsCreating(false);
      }}
    />
  );

  return (
    <MainLayout
      sidebarContent={sidebarContent}
      onCreateInvoice={() => {
        setIsCreating(true);
        selectInvoice(null);
      }}
    >
      <main className="flex-1 overflow-y-auto p-8 md:ml-64">
        {isCreating ? (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Create New Invoice</h2>
              <InvoiceForm
                onSubmit={handleCreateInvoice}
                onCancel={() => setIsCreating(false)}
                settings={settings}
              />
            </div>
          </div>
        ) : selectedInvoice ? (
          <div className="max-w-3xl mx-auto space-y-6">
            <LocalStorageWarning message="Your invoices are stored locally in your browser. Sign in to sync them to the cloud and access from any device." />
            <InvoiceDetail
              invoice={selectedInvoice}
              onUpdate={handleUpdateInvoice}
              onDelete={handleDeleteInvoice}
              onMarkAsSent={handleMarkAsSent}
              onMarkAsPaid={handleMarkAsPaid}
              onDuplicate={handleDuplicateInvoice}
              onClose={() => selectInvoice(null)}
              settings={settings}
            />
            <AdBanner />
          </div>
        ) : (
          <WelcomeScreen
            title="Welcome to Super Simple Invoice"
            subtitle="Create professional invoices in seconds. Free, easy, and works offline. Sign in to sync across devices."
            primaryCta={{
              label: invoices.length === 0 ? "Create Your First Invoice" : "Select an Invoice",
              onClick: invoices.length === 0 ? () => setIsCreating(true) : undefined,
              icon: (
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              ),
            }}
            secondaryCta={{
              label: "Learn More",
              href: "/about",
            }}
            features={[
              {
                icon: <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
                iconBgColor: "bg-green-100",
                title: "100% Free",
                description: "No hidden fees, no premium tiers. Create unlimited invoices for free.",
              },
              {
                icon: <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
                iconBgColor: "bg-blue-100",
                title: "Professional Invoices",
                description: "Create clean, professional invoices with automatic calculations and tax support.",
              },
              {
                icon: <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>,
                iconBgColor: "bg-purple-100",
                title: "Cloud Sync",
                description: "Sign in to sync your invoices across devices. Works offline, syncs when online.",
              },
            ]}
            featuresSectionTitle="Why Choose Super Simple Invoice?"
            howItWorks={[
              {
                title: "Create Invoice",
                description: "Enter client details, add line items, and set payment terms.",
              },
              {
                title: "Send to Client",
                description: "Mark as sent and track invoice status from draft to paid.",
              },
              {
                title: "Get Paid",
                description: "Track payments and keep records of all your invoices.",
              },
            ]}
            useCases={[
              { emoji: "💼", title: "Freelancers", subtitle: "Bill clients easily" },
              { emoji: "🏢", title: "Small Business", subtitle: "Professional invoicing" },
              { emoji: "🎨", title: "Creatives", subtitle: "Simple billing" },
              { emoji: "🔧", title: "Contractors", subtitle: "Track payments" },
            ]}
            useCasesSectionTitle="Perfect for Everyone"
            showAdBanner={true}
          />
        )}
        <Footer />
      </main>
    </MainLayout>
  );
}
