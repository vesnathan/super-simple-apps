"use client";

import { cn } from "@nextui-org/react";
import React, { useState, useEffect } from "react";
import { AuthModal, Button } from "@super-simple-apps/shared-assets";
import { useAuthStore } from "@/stores/authStore";

interface MainLayoutSidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
  sidebarContent?: React.ReactNode;
  onCreateJob?: (name: string) => void;
}

export function MainLayoutSidebar({
  isMobileOpen = false,
  onMobileClose,
  sidebarContent,
  onCreateJob,
}: MainLayoutSidebarProps) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCreatingJob, setIsCreatingJob] = useState(false);
  const [newJobName, setNewJobName] = useState("");
  const { user, isLoggedIn, loading, checkAuth, signOut } = useAuthStore();

  const handleCreateJob = () => {
    if (newJobName.trim() && onCreateJob) {
      onCreateJob(newJobName.trim());
      setNewJobName("");
      setIsCreatingJob(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <div
      className={cn(
        // Base styles
        "fixed top-0 bottom-0 bg-white",
        "flex flex-col",
        "border-r border-gray-200",
        "w-72 md:w-64",
        "shadow-xl md:shadow-sm",
        "z-50",
        // Mobile positioning and animation
        "transition-transform duration-300 ease-in-out",
        isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
      )}
    >
      {/* Header */}
      <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="flex items-center justify-between">
          <a
            href="/"
            className="flex items-center gap-3 hover:opacity-90 transition-opacity"
            title="Job Timer Home"
          >
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
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
              <h1 className="text-lg font-bold text-white">Job Timer</h1>
              <p className="text-xs text-blue-100">by Super Simple Apps</p>
            </div>
          </a>
          {/* Mobile close button */}
          <button
            onClick={onMobileClose}
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

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {sidebarContent}
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-100 bg-gray-50 space-y-2">
        {/* Create Job */}
        {isCreatingJob ? (
          <div className="space-y-2">
            <input
              type="text"
              value={newJobName}
              onChange={(e) => setNewJobName(e.target.value)}
              placeholder="Job name..."
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateJob();
                if (e.key === "Escape") {
                  setIsCreatingJob(false);
                  setNewJobName("");
                }
              }}
            />
            <div className="flex gap-2">
              <Button
                onClick={handleCreateJob}
                disabled={!newJobName.trim()}
                variant="primary"
                className="flex-1"
              >
                Create
              </Button>
              <Button
                onClick={() => {
                  setIsCreatingJob(false);
                  setNewJobName("");
                }}
                variant="secondary"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="primary"
            fullWidth
            onClick={() => setIsCreatingJob(true)}
          >
            <svg
              className="w-5 h-5 mr-2 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>Create Job</span>
          </Button>
        )}
        {/* Sign In / Sign Out */}
        {loading ? (
          <div className="flex items-center justify-center py-2">
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : isLoggedIn && user ? (
          <Button
            variant="secondary"
            fullWidth
            onClick={handleSignOut}
          >
            <svg
              className="w-5 h-5 mr-2 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span>Sign Out</span>
          </Button>
        ) : (
          <Button
            variant="secondary"
            fullWidth
            onClick={() => setIsAuthModalOpen(true)}
          >
            <svg
              className="w-5 h-5 mr-2 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
              />
            </svg>
            <span>Sign In</span>
          </Button>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        useAuthStore={useAuthStore}
        appName="Super Simple"
        appSubtitle="Job Timer"
        registrationMessage="Create an account to sync your jobs across devices"
        appIcon={
          <svg
            className="w-7 h-7 text-white"
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
        }
      />
    </div>
  );
}
