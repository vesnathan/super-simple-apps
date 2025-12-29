import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Super Simple Apps - our mission to create simple, useful tools that just work.",
};

export default function AboutPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 text-center">
            About Super Simple Apps
          </h1>
          <p className="mt-6 text-xl text-gray-600 text-center leading-relaxed">
            We believe software should be simple, useful, and accessible to
            everyone.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <div className="prose prose-lg text-gray-600 max-w-none">
            <p>
              In a world of bloated software and feature creep, we take a
              different approach. Super Simple Apps is dedicated to building
              tools that do one thing well - without the complexity,
              subscriptions, or endless settings that plague modern
              applications.
            </p>
            <p className="mt-4">
              Every app we create follows three core principles:
            </p>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start">
                <span className="text-primary-600 mr-3">&#10003;</span>
                <span>
                  <strong>Simplicity first</strong> - No unnecessary features or
                  confusing interfaces
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-3">&#10003;</span>
                <span>
                  <strong>Free to use</strong> - Our core tools are available to
                  everyone at no cost
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-3">&#10003;</span>
                <span>
                  <strong>Privacy focused</strong> - We don&apos;t sell your
                  data or track you across the web
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
          <div className="prose prose-lg text-gray-600 max-w-none">
            <p>
              Super Simple Apps started with a simple frustration: why are so
              many everyday tools so complicated? We wanted a flashcard app to
              help with studying, but every option was either too complex, too
              expensive, or too invasive with our data.
            </p>
            <p className="mt-4">
              So we built our own. And then we thought - why not share it with
              everyone? That&apos;s the spirit behind Super Simple Apps: useful
              tools, built with care, available to all.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            What We Value
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Quality Over Quantity
              </h3>
              <p className="text-gray-600">
                We&apos;d rather have a few excellent apps than dozens of
                mediocre ones.
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
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
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Respect Your Time
              </h3>
              <p className="text-gray-600">
                Our apps are designed to get you in, get things done, and get
                out.
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Community First
              </h3>
              <p className="text-gray-600">
                We build what people need and listen to feedback to make our
                apps better.
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
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
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Transparency
              </h3>
              <p className="text-gray-600">
                No hidden agendas. We&apos;re upfront about what we do and
                don&apos;t do with your data.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
