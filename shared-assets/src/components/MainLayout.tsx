"use client";

import React, { PropsWithChildren, useState, useEffect } from "react";

export interface MainLayoutProps extends PropsWithChildren {
  /** App name shown in header */
  appName: string;
  /** App icon for sidebar header */
  appIcon: React.ReactNode;
  /** Sidebar content - the entire sidebar content below the header */
  sidebarContent?: React.ReactNode;
  /** Accent color for the sidebar header gradient */
  accentColor?: "blue" | "purple" | "green" | "amber" | "teal";
}

const accentGradients = {
  blue: "from-blue-600 to-indigo-600",
  purple: "from-purple-600 to-indigo-600",
  green: "from-green-600 to-teal-600",
  amber: "from-amber-600 to-orange-600",
  teal: "from-teal-600 to-cyan-600",
};

export const MainLayout: React.FC<MainLayoutProps> = ({
  appName,
  appIcon,
  sidebarContent,
  accentColor = "blue",
  children,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when window is resized to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const gradient = accentGradients[accentColor];

  // Sidebar classes matching Flashcards exactly
  const sidebarClasses = [
    // Base styles
    "fixed top-0 bottom-0 bg-white",
    "flex flex-col",
    "border-r border-gray-200",
    "w-72 md:w-64",
    "shadow-xl md:shadow-sm",
    "z-50",
    // Mobile positioning and animation
    "transition-transform duration-300 ease-in-out",
    // Transform: on mobile hidden left, on desktop visible
    isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
  ].join(" ");

  return (
    <>
      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-4 h-14">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
          <a
            href="https://super-simple-apps.com"
            className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors"
          >
            {appName}
          </a>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={sidebarClasses}>
        {/* Sidebar Header */}
        <div className={`p-5 border-b border-gray-100 bg-gradient-to-r ${gradient}`}>
          <div className="flex items-center justify-between">
            <a
              href="https://super-simple-apps.com"
              className="flex items-center gap-3 hover:opacity-90 transition-opacity"
              title="Back to Super Simple Apps"
            >
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                {appIcon}
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">{appName}</h1>
                <p className="text-xs text-white/70">by Super Simple Apps</p>
              </div>
            </a>
            {/* Mobile close button */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close menu"
            >
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto flex flex-col">
          {sidebarContent}
        </div>
      </aside>

      {/* Main Content - matching Flashcards layout exactly */}
      <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 w-full min-h-dvh flex flex-col pt-14 md:pt-0">
        {children}
      </div>
    </>
  );
};
