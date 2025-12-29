"use client";

import React from "react";
import { cn } from "@nextui-org/react";
import { AuthModal } from "@super-simple-apps/shared-assets";
import { useAuthStore } from "@/stores/authStore";

interface MainLayoutSidebarProps {
  isMobileOpen: boolean;
  onMobileClose: () => void;
  sidebarContent?: React.ReactNode;
  onCreateInvoice?: () => void;
}

export const MainLayoutSidebar: React.FC<MainLayoutSidebarProps> = ({
  isMobileOpen,
  onMobileClose,
  sidebarContent,
  onCreateInvoice,
}) => {
  const { user, signOut } = useAuthStore();
  const [showAuthModal, setShowAuthModal] = React.useState(false);

  return (
    <>
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-full w-64 bg-white shadow-lg border-r border-gray-200",
          "transform transition-transform duration-200 ease-in-out",
          "md:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo / Title */}
          <div className="h-14 flex items-center justify-between px-4 border-b border-gray-100">
            <a
              href="/"
              className="text-lg font-semibold text-gray-800 hover:text-green-600 transition-colors flex items-center gap-2"
            >
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Invoice
            </a>
            <button
              onClick={onMobileClose}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* New Invoice Button */}
          <div className="p-3 border-b border-gray-100">
            <button
              onClick={() => {
                onCreateInvoice?.();
                onMobileClose();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Invoice
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto">{sidebarContent}</div>

          {/* User Section */}
          <div className="border-t border-gray-200 p-4">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-600 font-medium text-sm">
                      {(user.signInDetails?.loginId || user.username)?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.signInDetails?.loginId || user.username}
                    </p>
                    <p className="text-xs text-gray-500">Synced</p>
                  </div>
                </div>
                <button
                  onClick={() => signOut()}
                  className="w-full text-sm text-gray-600 hover:text-gray-900 py-1.5 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Sign In to Sync
              </button>
            )}
          </div>

          {/* Links */}
          <div className="border-t border-gray-100 p-3">
            <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
              <a href="/about" className="hover:text-green-600 transition-colors">
                About
              </a>
              <a href="/settings" className="hover:text-green-600 transition-colors">
                Settings
              </a>
              <a
                href="https://super-simple-apps.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-green-600 transition-colors"
              >
                More Apps
              </a>
            </div>
          </div>
        </div>
      </aside>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        useAuthStore={useAuthStore}
        appName="Invoice"
        appSubtitle="Sync your invoices"
        registrationMessage="Create an account to save and sync your invoices across devices"
      />
    </>
  );
};
