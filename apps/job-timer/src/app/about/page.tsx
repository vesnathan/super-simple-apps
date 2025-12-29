"use client";

import Link from "next/link";
import { Footer } from "@super-simple-apps/shared-assets";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-8"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Timer
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          About Job Timer
        </h1>

        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              What is Job Timer?
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Job Timer is a free, simple time tracking tool that helps you
              monitor how much time you spend on different projects and jobs.
              Whether you&apos;re a freelancer tracking billable hours, a
              student timing study sessions, or anyone who wants to understand
              where their time goes, Job Timer makes it easy.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Features
            </h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-3">
                <svg
                  className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>
                  <strong>Multiple Jobs:</strong> Create and manage multiple
                  jobs or projects
                </span>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>
                  <strong>Simple Timer:</strong> One-click start and stop for
                  easy time tracking
                </span>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>
                  <strong>Session History:</strong> View all your past timer
                  sessions grouped by date
                </span>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>
                  <strong>Total Time:</strong> See the total time spent on each
                  job at a glance
                </span>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>
                  <strong>Local Storage:</strong> Your data is saved in your
                  browser - no account needed
                </span>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>
                  <strong>Works Offline:</strong> Use Job Timer even without an
                  internet connection
                </span>
              </li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              How to Use
            </h2>
            <ol className="space-y-4 text-gray-600 list-decimal list-inside">
              <li>
                Click &quot;New Job&quot; in the sidebar to create a job or
                project
              </li>
              <li>Select the job you want to track time for</li>
              <li>
                Click the green &quot;Start&quot; button to begin timing
              </li>
              <li>
                Click the red &quot;Stop&quot; button when you&apos;re done
              </li>
              <li>View your session history and total time in the main area</li>
            </ol>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Privacy
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Job Timer stores all your data locally in your browser. We
              don&apos;t collect, store, or transmit any of your time tracking
              data to external servers. Your privacy is completely protected.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Part of Super Simple Apps
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Job Timer is part of the Super Simple Apps collection - free,
              simple tools that just work.
            </p>
            <a
              href="https://super-simple-apps.com"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700"
            >
              View all Super Simple Apps
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
