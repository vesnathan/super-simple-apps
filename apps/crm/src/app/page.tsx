"use client";

import { useState, useCallback } from "react";
import { MainLayout } from "@/components/MainLayout";
import { ClientSidebarContent } from "@/components/ClientSidebar";
import { ClientDetail } from "@/components/ClientDetail";
import { ClientForm } from "@/components/ClientForm";
import { AdBanner, LocalStorageWarning, Footer, WelcomeScreen } from "@super-simple-apps/shared-assets";
import { useCRM } from "@/hooks/useCRM";
import { CreateClientInput } from "@/types";

export default function Home() {
  const {
    clients,
    selectedClientId,
    searchQuery,
    createClient,
    updateClient,
    deleteClient,
    selectClient,
    setSearchQuery,
    getSelectedClient,
    getFilteredClients,
  } = useCRM();

  const [isAddingClient, setIsAddingClient] = useState(false);

  const selectedClient = getSelectedClient();
  const filteredClients = getFilteredClients();

  const handleCreateClient = useCallback((data: CreateClientInput) => {
    const newClient = createClient(data);
    selectClient(newClient.id);
    setIsAddingClient(false);
  }, [createClient, selectClient]);

  const handleUpdateClient = useCallback((data: CreateClientInput) => {
    if (selectedClientId) {
      updateClient({ id: selectedClientId, ...data });
    }
  }, [selectedClientId, updateClient]);

  const handleDeleteClient = useCallback(() => {
    if (selectedClientId) {
      deleteClient(selectedClientId);
    }
  }, [selectedClientId, deleteClient]);

  const sidebarContent = (
    <ClientSidebarContent
      clients={filteredClients}
      selectedClientId={selectedClientId}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      onSelectClient={(id) => {
        selectClient(id);
        setIsAddingClient(false);
      }}
    />
  );

  return (
    <MainLayout
      sidebarContent={sidebarContent}
      onCreateClient={() => {
        setIsAddingClient(true);
        selectClient(null);
      }}
    >
      <main className="flex-1 overflow-y-auto p-8 md:ml-64">
        {isAddingClient ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Add New Client</h2>
              <ClientForm
                onSubmit={handleCreateClient}
                onCancel={() => setIsAddingClient(false)}
              />
            </div>
          </div>
        ) : selectedClient ? (
          <div className="max-w-2xl mx-auto space-y-6">
            <LocalStorageWarning message="Your clients are stored locally in your browser. Sign in to sync them to the cloud and access from any device." />
            <ClientDetail
              client={selectedClient}
              onUpdate={handleUpdateClient}
              onDelete={handleDeleteClient}
              onClose={() => selectClient(null)}
            />
            <AdBanner />
          </div>
        ) : (
          <WelcomeScreen
            title="Welcome to Super Simple CRM"
            subtitle="The free, easy-to-use CRM for managing your clients and contacts. Works offline, syncs to the cloud when you sign in."
            primaryCta={{
              label: clients.length === 0 ? "Add Your First Client" : "Select a Client",
              onClick: clients.length === 0 ? () => setIsAddingClient(true) : undefined,
              icon: (
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
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
                description: "No hidden fees, no premium tiers. All features available to everyone for free.",
              },
              {
                icon: <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
                iconBgColor: "bg-purple-100",
                title: "Simple Client Management",
                description: "Add clients with contact info, notes, tags, and hourly rates. No complex setup.",
              },
              {
                icon: <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>,
                iconBgColor: "bg-blue-100",
                title: "Cloud Sync",
                description: "Sign in to sync your clients across devices. Works offline, syncs when online.",
              },
            ]}
            featuresSectionTitle="Why Choose Super Simple CRM?"
            howItWorks={[
              {
                title: "Add Your Clients",
                description: "Enter client details including name, email, phone, company, and notes.",
              },
              {
                title: "Organize with Tags",
                description: "Use tags to categorize clients (VIP, Active, Priority) for easy filtering.",
              },
              {
                title: "Track & Invoice",
                description: "Set hourly rates, link to Job Timer sessions, and create invoices.",
              },
            ]}
            useCases={[
              { emoji: "💼", title: "Freelancers", subtitle: "Manage client contacts" },
              { emoji: "🏢", title: "Small Business", subtitle: "Track customers" },
              { emoji: "📊", title: "Consultants", subtitle: "Organize clients" },
              { emoji: "🎯", title: "Contractors", subtitle: "Stay organized" },
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
