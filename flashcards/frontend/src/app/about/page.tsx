import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Super Simple Flashcards",
  description:
    "Learn about the Super Simple philosophy - software that does one thing well, without the bloat. Part of the Super Simple range of apps.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              The Super Simple Philosophy
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Software that does one thing well. No bloat. No feature creep. Just the essentials.
            </p>
          </div>

          {/* The Problem Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              The Problem with Modern Software
            </h2>
            <p className="text-gray-600 mb-4">
              Have you noticed how apps keep getting more complicated? What starts as a simple tool
              inevitably becomes bloated with features nobody asked for. Settings screens with hundreds
              of options. Subscriptions for basic functionality. Dark patterns designed to keep you
              clicking instead of doing.
            </p>
            <p className="text-gray-600 mb-4">
              We wanted to learn vocabulary with flashcards. Simple, right? Yet every flashcard app
              we tried wanted us to create accounts, pay subscriptions, navigate confusing interfaces,
              and wade through gamification features we never wanted.
            </p>
            <p className="text-gray-600">
              So we built something different.
            </p>
          </section>

          {/* Super Simple Approach */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              The Super Simple Approach
            </h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-blue-600"
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
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">One Job, Done Well</h3>
                  <p className="text-gray-600">
                    Super Simple Flashcards does exactly what it says: flashcards. No social features,
                    no streaks, no achievements, no distractions. Just you and your cards.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Respects Your Time</h3>
                  <p className="text-gray-600">
                    Open the app, study your cards, close the app. No onboarding tutorials, no
                    daily reminders, no &quot;just one more thing&quot; prompts. Your time is yours.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Works Offline First</h3>
                  <p className="text-gray-600">
                    Your decks are stored locally on your device. No account required. Create an
                    account only if you want to sync across devices - it&apos;s optional, not mandatory.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-orange-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Free Forever</h3>
                  <p className="text-gray-600">
                    No premium tiers. No &quot;unlock advanced features&quot; prompts. The app you see
                    is the app you get. We believe basic tools for learning should be accessible to everyone.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Super Simple Range */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              The Super Simple Range
            </h2>
            <p className="text-gray-600 mb-4">
              Super Simple Flashcards is part of a growing family of apps built on the same
              philosophy: do one thing, do it well, and get out of your way.
            </p>
            <p className="text-gray-600 mb-4">
              Each app in the Super Simple range focuses on a single task. No bundled features
              you&apos;ll never use. No bloated downloads. No subscription fatigue from paying for
              ten features when you only need one.
            </p>
            <p className="text-gray-600">
              We&apos;re building the tools we wished existed - and sharing them with anyone who
              feels the same frustration with overengineered software.
            </p>
          </section>

          {/* Why Flashcards Work */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Why Flashcards Work
            </h2>
            <p className="text-gray-600 mb-4">
              Flashcards aren&apos;t trendy. They&apos;re not powered by AI. They&apos;re not disrupting
              anything. They&apos;re just a method that&apos;s been proven effective for centuries.
            </p>
            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-blue-600 font-semibold text-sm">1</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Active Recall</h3>
                  <p className="text-gray-600 text-sm">
                    Testing yourself strengthens memory far more effectively than passively
                    re-reading material.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-blue-600 font-semibold text-sm">2</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Spaced Repetition</h3>
                  <p className="text-gray-600 text-sm">
                    Reviewing at increasing intervals moves knowledge from short-term to
                    long-term memory.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-blue-600 font-semibold text-sm">3</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Focused Learning</h3>
                  <p className="text-gray-600 text-sm">
                    Breaking information into discrete cards helps you identify exactly what
                    you know and what needs more work.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="text-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Ready to Try Simple?
            </h2>
            <p className="text-gray-600 mb-6">
              No sign-up required. Just open the app and start creating flashcards.
            </p>
            <a
              href="/"
              className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-colors"
            >
              Start Learning
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </a>
          </section>

          <div className="mt-12 pt-8 border-t border-gray-100">
            <a
              href="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
