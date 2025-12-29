"use client";

import { useState, useEffect } from "react";
import { MainLayout } from "@/components/MainLayout";
import { Footer } from "@super-simple-apps/shared-assets";
import { useInvoice } from "@/hooks/useInvoice";

export default function SettingsPage() {
  const { settings, updateSettings } = useInvoice();

  const [businessName, setBusinessName] = useState(settings.businessName || "");
  const [businessEmail, setBusinessEmail] = useState(settings.businessEmail || "");
  const [businessPhone, setBusinessPhone] = useState(settings.businessPhone || "");
  const [businessAddress, setBusinessAddress] = useState(settings.businessAddress || "");
  const [defaultTaxRate, setDefaultTaxRate] = useState(String(settings.defaultTaxRate || ""));
  const [defaultPaymentTerms, setDefaultPaymentTerms] = useState(settings.defaultPaymentTerms || "");
  const [invoicePrefix, setInvoicePrefix] = useState(settings.invoicePrefix || "INV");
  const [currency, setCurrency] = useState(settings.currency || "USD");
  const [currencySymbol, setCurrencySymbol] = useState(settings.currencySymbol || "$");

  const [saved, setSaved] = useState(false);

  // Update local state when settings change
  useEffect(() => {
    setBusinessName(settings.businessName || "");
    setBusinessEmail(settings.businessEmail || "");
    setBusinessPhone(settings.businessPhone || "");
    setBusinessAddress(settings.businessAddress || "");
    setDefaultTaxRate(String(settings.defaultTaxRate || ""));
    setDefaultPaymentTerms(settings.defaultPaymentTerms || "");
    setInvoicePrefix(settings.invoicePrefix || "INV");
    setCurrency(settings.currency || "USD");
    setCurrencySymbol(settings.currencySymbol || "$");
  }, [settings]);

  const handleSave = () => {
    updateSettings({
      businessName: businessName.trim() || undefined,
      businessEmail: businessEmail.trim() || undefined,
      businessPhone: businessPhone.trim() || undefined,
      businessAddress: businessAddress.trim() || undefined,
      defaultTaxRate: parseFloat(defaultTaxRate) || undefined,
      defaultPaymentTerms: defaultPaymentTerms.trim() || undefined,
      invoicePrefix: invoicePrefix.trim() || "INV",
      currency: currency.trim() || "USD",
      currencySymbol: currencySymbol.trim() || "$",
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <MainLayout>
      <main className="flex-1 overflow-y-auto p-8 md:ml-64">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Invoice Settings</h1>

            {/* Business Information */}
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h2>
                <p className="text-sm text-gray-500 mb-4">
                  This information will appear on your invoices.
                </p>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
                      Business Name
                    </label>
                    <input
                      id="businessName"
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Your Business Name"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="businessEmail" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        id="businessEmail"
                        type="email"
                        value={businessEmail}
                        onChange={(e) => setBusinessEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="you@example.com"
                      />
                    </div>
                    <div>
                      <label htmlFor="businessPhone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        id="businessPhone"
                        type="tel"
                        value={businessPhone}
                        onChange={(e) => setBusinessPhone(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="businessAddress" className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <textarea
                      id="businessAddress"
                      value={businessAddress}
                      onChange={(e) => setBusinessAddress(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                      placeholder="123 Main St&#10;City, State 12345"
                    />
                  </div>
                </div>
              </div>

              {/* Invoice Defaults */}
              <div className="pt-6 border-t border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Invoice Defaults</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="invoicePrefix" className="block text-sm font-medium text-gray-700 mb-1">
                        Invoice Number Prefix
                      </label>
                      <input
                        id="invoicePrefix"
                        type="text"
                        value={invoicePrefix}
                        onChange={(e) => setInvoicePrefix(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="INV"
                      />
                      <p className="mt-1 text-xs text-gray-500">e.g., INV-0001, INV-0002</p>
                    </div>
                    <div>
                      <label htmlFor="defaultTaxRate" className="block text-sm font-medium text-gray-700 mb-1">
                        Default Tax Rate (%)
                      </label>
                      <input
                        id="defaultTaxRate"
                        type="number"
                        value={defaultTaxRate}
                        onChange={(e) => setDefaultTaxRate(e.target.value)}
                        min="0"
                        max="100"
                        step="0.1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="defaultPaymentTerms" className="block text-sm font-medium text-gray-700 mb-1">
                      Default Payment Terms
                    </label>
                    <input
                      id="defaultPaymentTerms"
                      type="text"
                      value={defaultPaymentTerms}
                      onChange={(e) => setDefaultPaymentTerms(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Net 30, Due on receipt, etc."
                    />
                  </div>
                </div>
              </div>

              {/* Currency */}
              <div className="pt-6 border-t border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Currency</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                      Currency Code
                    </label>
                    <input
                      id="currency"
                      type="text"
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="USD"
                    />
                  </div>
                  <div>
                    <label htmlFor="currencySymbol" className="block text-sm font-medium text-gray-700 mb-1">
                      Currency Symbol
                    </label>
                    <input
                      id="currencySymbol"
                      type="text"
                      value={currencySymbol}
                      onChange={(e) => setCurrencySymbol(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="$"
                    />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-6 border-t border-gray-200 flex items-center justify-between">
                <a
                  href="/"
                  className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                >
                  Back to Invoices
                </a>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  {saved ? (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Saved!
                    </>
                  ) : (
                    "Save Settings"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </MainLayout>
  );
}
