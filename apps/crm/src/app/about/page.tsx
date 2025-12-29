"use client";

import { MainLayout } from "@/components/MainLayout";
import { Footer } from "@super-simple-apps/shared-assets";

export default function AboutPage() {
  return (
    <MainLayout>
      <main className="flex-1 overflow-y-auto p-8 md:ml-64">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">About Super Simple CRM</h1>

            <div className="prose prose-purple max-w-none">
              <p className="text-lg text-gray-600 mb-6">
                Super Simple CRM is a free, easy-to-use customer relationship management tool
                designed for freelancers, small businesses, and anyone who needs to keep track
                of their clients and contacts.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Features</h2>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>Client Management:</strong> Store contact details, notes, and hourly rates for each client.</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>Tags & Filtering:</strong> Organize clients with tags and quickly find who you need.</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>Works Offline:</strong> Your data is stored locally and works without an internet connection.</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>Cloud Sync:</strong> Sign in to sync your clients across all your devices.</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>Integration:</strong> Works with Super Simple Job Timer and Invoice for a complete business toolkit.</span>
                </li>
              </ul>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Part of Super Simple Apps</h2>
              <p className="text-gray-600 mb-4">
                Super Simple CRM is part of the Super Simple Apps family of free tools:
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <a href="https://job-timer.super-simple-apps.com" className="text-purple-600 hover:underline">
                    Super Simple Job Timer
                  </a>
                  {" "}- Track time on projects and jobs
                </li>
                <li>
                  <a href="https://invoice.super-simple-apps.com" className="text-purple-600 hover:underline">
                    Super Simple Invoice
                  </a>
                  {" "}- Create and send professional invoices
                </li>
                <li>
                  <a href="https://flashcards.super-simple-apps.com" className="text-purple-600 hover:underline">
                    Super Simple Flashcards
                  </a>
                  {" "}- Study with digital flashcards
                </li>
              </ul>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Privacy</h2>
              <p className="text-gray-600">
                Your data is yours. When you use Super Simple CRM without signing in, all your
                data stays in your browser's local storage. When you sign in, your data is
                securely synced to the cloud so you can access it from any device.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Open Source</h2>
              <p className="text-gray-600">
                Super Simple Apps are built with love using Next.js, React, and AWS.
                We believe in simple, focused tools that do one thing well.
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </MainLayout>
  );
}
