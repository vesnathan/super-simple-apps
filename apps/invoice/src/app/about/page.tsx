"use client";

import { MainLayout } from "@/components/MainLayout";
import { Footer } from "@super-simple-apps/shared-assets";

export default function AboutPage() {
  return (
    <MainLayout>
      <main className="flex-1 overflow-y-auto p-8 md:ml-64">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">About Super Simple Invoice</h1>

            <div className="prose prose-gray max-w-none">
              <p className="text-lg text-gray-600 mb-6">
                Super Simple Invoice is a free, easy-to-use invoicing tool designed for freelancers,
                small businesses, and anyone who needs to create professional invoices quickly.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Features</h2>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>100% Free</strong> - No hidden fees, no premium tiers, no limits</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>Works Offline</strong> - Your data is stored locally and works without internet</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>Cloud Sync</strong> - Sign in to sync across devices</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>Auto Calculations</strong> - Automatic subtotals, tax, and totals</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>Status Tracking</strong> - Track invoices from draft to paid</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>Duplicate Invoices</strong> - Quickly create new invoices from existing ones</span>
                </li>
              </ul>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Privacy</h2>
              <p className="text-gray-600">
                Your invoice data is stored locally in your browser by default. If you choose to sign in,
                your data syncs securely to the cloud so you can access it from any device. We never sell
                or share your data.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Part of Super Simple Apps</h2>
              <p className="text-gray-600 mb-4">
                Super Simple Invoice is part of the Super Simple Apps family of free productivity tools:
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <a href="https://crm.super-simple-apps.com" className="text-green-600 hover:text-green-700 font-medium">
                    Super Simple CRM
                  </a>
                  {" "}- Manage your clients and contacts
                </li>
                <li>
                  <a href="https://timer.super-simple-apps.com" className="text-green-600 hover:text-green-700 font-medium">
                    Super Simple Job Timer
                  </a>
                  {" "}- Track time on projects
                </li>
                <li>
                  <a href="https://flashcards.super-simple-apps.com" className="text-green-600 hover:text-green-700 font-medium">
                    Super Simple Flashcards
                  </a>
                  {" "}- Study and learn with flashcards
                </li>
              </ul>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <a
                  href="/"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Invoices
                </a>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </MainLayout>
  );
}
