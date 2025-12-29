"use client";

import Link from "next/link";
import { LandingTemplate } from "@super-simple-apps/shared-assets";

const apps = [
  {
    name: "Flashcards",
    description:
      "Create, study, and share flashcard decks. Perfect for students, language learners, and anyone who wants to memorize information effectively.",
    href: "https://flashcards.super-simple-apps.com",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
      </svg>
    ),
    color: "bg-blue-600",
    available: true,
  },
  {
    name: "Image Crop",
    description:
      "Crop images with precision right in your browser. No uploads needed - your images stay private on your device.",
    href: "https://crop.super-simple-apps.com",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
    color: "bg-purple-600",
    available: true,
  },
  {
    name: "Image Resize",
    description:
      "Resize images by percentage, exact dimensions, or common presets. All processing happens locally in your browser.",
    href: "https://resize.super-simple-apps.com",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
        />
      </svg>
    ),
    color: "bg-green-600",
    available: true,
  },
  {
    name: "Image Annotate",
    description:
      "Draw, highlight, add arrows and text to your images. Perfect for marking up screenshots and creating quick tutorials.",
    href: "https://annotate.super-simple-apps.com",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
        />
      </svg>
    ),
    color: "bg-amber-600",
    available: true,
  },
  {
    name: "Job Timer",
    description:
      "Track time spent on client projects. Start/stop timers, organize by job, and send sessions to invoices.",
    href: "https://job-timer.super-simple-apps.com",
    icon: (
      <svg
        className="w-8 h-8"
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
    ),
    color: "bg-teal-600",
    available: true,
  },
];

const comingSoonApps = [
  {
    name: "Invoices",
    description:
      "Create professional invoices in seconds. Track payments, send reminders, and manage your billing with ease.",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
    color: "bg-green-500",
  },
  {
    name: "CRM",
    description:
      "Keep track of your contacts and leads. Simple customer relationship management without the complexity.",
    icon: (
      <svg
        className="w-8 h-8"
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
    ),
    color: "bg-orange-500",
  },
  {
    name: "Kanban",
    description:
      "Simple project management with drag-and-drop boards. Organize tasks, track progress, and stay focused.",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
        />
      </svg>
    ),
    color: "bg-indigo-500",
  },
];

const features = [
  {
    icon: (
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
          d="M5 13l4 4L19 7"
        />
      </svg>
    ),
    iconBgColor: "bg-green-100",
    title: "They Work!",
    description: "Simple, reliable tools that do exactly what they say. No bugs, no hassle.",
  },
  {
    icon: (
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
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    iconBgColor: "bg-blue-100",
    title: "Free to Use",
    description: "All our apps are completely free. No hidden costs, no premium tiers.",
  },
  {
    icon: (
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
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
    iconBgColor: "bg-purple-100",
    title: "Fast & Simple",
    description: "No bloated features. Just the essentials, designed to work smoothly.",
  },
  {
    icon: (
      <svg
        className="w-6 h-6 text-amber-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        />
      </svg>
    ),
    iconBgColor: "bg-amber-100",
    title: "Private & Secure",
    description: "Your data stays yours. We don't sell your information or track you.",
  },
];

export default function HomePage() {
  return (
    <LandingTemplate
      title="Super Simple Apps"
      subtitle="No bloat, no complexity. Just useful tools designed to help you get things done. Free to use, no sign-up required."
      primaryCta={{ label: "Explore Apps", href: "#apps" }}
      secondaryCta={{ label: "Learn More", href: "/about" }}
      features={features}
      showAdBanner={true}
      hideFooter={true}
    >
      {/* Apps Section */}
      <section id="apps" className="py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Our Apps
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Available Apps */}
          {apps.map((app) => (
            <Link
              key={app.name}
              href={app.href}
              className="group bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:border-blue-200 transition-all"
            >
              <div
                className={`w-14 h-14 ${app.color} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}
              >
                {app.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {app.name}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {app.description}
              </p>
              <div className="mt-4 flex items-center text-blue-600 font-medium text-sm">
                Try it now
                <svg
                  className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
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
              </div>
            </Link>
          ))}
        </div>

        {/* Coming Soon Apps */}
        <h3 className="text-lg font-semibold text-gray-600 mb-4 text-center">
          Coming Soon
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {comingSoonApps.map((app) => (
            <div
              key={app.name}
              className="relative bg-gray-50 rounded-xl border border-dashed border-gray-300 p-4 opacity-75"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-10 h-10 ${app.color} rounded-lg flex items-center justify-center text-white opacity-60 flex-shrink-0`}
                >
                  {app.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700">{app.name}</h4>
                  <p className="text-gray-500 text-sm line-clamp-2">
                    {app.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </LandingTemplate>
  );
}
