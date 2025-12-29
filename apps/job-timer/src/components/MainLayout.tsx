"use client";

import React, { PropsWithChildren, useState, useEffect } from "react";
import { cn } from "@nextui-org/react";

import { MainLayoutSidebar } from "./MainLayoutSidebar";

export interface MainLayoutProps extends PropsWithChildren {
  sidebarContent?: React.ReactNode;
  onCreateJob?: (name: string) => void;
  isMobileMenuOpen?: boolean;
  onMobileMenuChange?: (open: boolean) => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  sidebarContent,
  onCreateJob,
  isMobileMenuOpen: externalMobileMenuOpen,
  onMobileMenuChange,
}) => {
  const [internalMobileMenuOpen, setInternalMobileMenuOpen] = useState(false);

  // Use external state if provided, otherwise use internal state
  const isMobileMenuOpen = externalMobileMenuOpen ?? internalMobileMenuOpen;
  const setIsMobileMenuOpen = onMobileMenuChange ?? setInternalMobileMenuOpen;

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
          <a href="/" className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors">
            Job Timer
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
      <MainLayoutSidebar
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
        sidebarContent={sidebarContent}
        onCreateJob={onCreateJob}
      />

      {/* Main Content */}
      <div
        className={cn(
          "bg-gradient-to-br from-slate-50 to-blue-50/30",
          "w-full min-h-dvh",
          "flex flex-col",
          "pt-14 md:pt-0", // Add top padding for mobile header
        )}
      >
        {children}
      </div>
    </>
  );
};
