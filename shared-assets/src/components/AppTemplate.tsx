"use client";

import React, { useEffect, useState } from "react";
import { Footer } from "./Footer";

export interface FeatureItem {
  icon: React.ReactNode;
  iconBgColor: string;
  title: string;
  description: string;
}

export interface SidebarSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  iconColor: string;
  content: React.ReactNode;
  defaultExpanded?: boolean;
}

export interface SidebarAction {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: "primary" | "secondary" | "outline";
}

export interface AppTemplateProps {
  /** App name shown in header/sidebar */
  appName: string;
  /** App icon for sidebar header */
  appIcon: React.ReactNode;
  /** App title shown in the hero (landing mode) */
  title?: string;
  /** App subtitle/description (landing mode) */
  subtitle?: string;
  /** Primary CTA button (landing mode) */
  primaryCta?: {
    label: string;
    href: string;
  };
  /** Secondary CTA button (landing mode) */
  secondaryCta?: {
    label: string;
    href: string;
  };
  /** Features to display in the features section (landing mode) */
  features?: FeatureItem[];
  /** Main content (the actual app UI) */
  children?: React.ReactNode;
  /** Whether to show the ad banner */
  showAdBanner?: boolean;
  /** Whether to hide the footer */
  hideFooter?: boolean;
  /** Layout mode: 'landing' for centered content, 'dashboard' for sidebar layout */
  mode?: "landing" | "dashboard";
  /** Sidebar sections (dashboard mode) */
  sidebarSections?: SidebarSection[];
  /** Sidebar bottom actions (dashboard mode) */
  sidebarActions?: SidebarAction[];
  /** Custom sidebar content - renders instead of sidebarSections/sidebarActions */
  sidebarContent?: React.ReactNode;
  /** Theme color for accent (defaults to blue) */
  accentColor?: "blue" | "purple" | "green" | "amber" | "teal";
}

const accentColors = {
  blue: {
    gradient: "from-blue-600 to-indigo-600",
    gradientHover: "hover:from-blue-700 hover:to-indigo-700",
    bg: "bg-blue-600",
    bgHover: "hover:bg-blue-700",
    text: "text-blue-600",
    textHover: "hover:text-blue-600",
    border: "border-blue-600",
    bgLight: "bg-blue-50",
  },
  purple: {
    gradient: "from-purple-600 to-indigo-600",
    gradientHover: "hover:from-purple-700 hover:to-indigo-700",
    bg: "bg-purple-600",
    bgHover: "hover:bg-purple-700",
    text: "text-purple-600",
    textHover: "hover:text-purple-600",
    border: "border-purple-600",
    bgLight: "bg-purple-50",
  },
  green: {
    gradient: "from-green-600 to-teal-600",
    gradientHover: "hover:from-green-700 hover:to-teal-700",
    bg: "bg-green-600",
    bgHover: "hover:bg-green-700",
    text: "text-green-600",
    textHover: "hover:text-green-600",
    border: "border-green-600",
    bgLight: "bg-green-50",
  },
  amber: {
    gradient: "from-amber-600 to-orange-600",
    gradientHover: "hover:from-amber-700 hover:to-orange-700",
    bg: "bg-amber-600",
    bgHover: "hover:bg-amber-700",
    text: "text-amber-600",
    textHover: "hover:text-amber-600",
    border: "border-amber-600",
    bgLight: "bg-amber-50",
  },
  teal: {
    gradient: "from-teal-600 to-cyan-600",
    gradientHover: "hover:from-teal-700 hover:to-cyan-700",
    bg: "bg-teal-600",
    bgHover: "hover:bg-teal-700",
    text: "text-teal-600",
    textHover: "hover:text-teal-600",
    border: "border-teal-600",
    bgLight: "bg-teal-50",
  },
};

export const AppTemplate: React.FC<AppTemplateProps> = ({
  appName,
  appIcon,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  features = [],
  children,
  showAdBanner = true,
  hideFooter = false,
  mode = "landing",
  sidebarSections = [],
  sidebarActions = [],
  sidebarContent,
  accentColor = "blue",
}) => {
  const [bannerUrl, setBannerUrl] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(sidebarSections.filter((s) => s.defaultExpanded).map((s) => s.id))
  );

  const colors = accentColors[accentColor];

  useEffect(() => {
    if (showAdBanner && mode === "landing") {
      setBannerUrl(`https://app-builder-studio.com/assets/banner.png?t=${Date.now()}`);
    }
  }, [showAdBanner, mode]);

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

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Dashboard mode with sidebar
  if (mode === "dashboard") {
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
        <div
          className={`
            fixed top-0 bottom-0 bg-white
            flex flex-col
            border-r border-gray-200
            w-72 md:w-64
            shadow-xl md:shadow-sm
            z-50
            transition-transform duration-300 ease-in-out
            ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          `}
        >
          {/* Sidebar Header */}
          <div className={`p-5 border-b border-gray-100 bg-gradient-to-r ${colors.gradient}`}>
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
          <div className="flex-1 overflow-y-auto">
            {sidebarContent ? (
              sidebarContent
            ) : (
              sidebarSections.map((section) => (
                <div key={section.id} className="border-b border-gray-100">
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className={section.iconColor}>{section.icon}</span>
                      <span className="font-medium text-sm">{section.title}</span>
                    </div>
                    <svg
                      className={`w-4 h-4 text-gray-500 transition-transform ${
                        expandedSections.has(section.id) ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {expandedSections.has(section.id) && (
                    <div className="py-1">{section.content}</div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Sidebar Actions */}
          {sidebarActions.length > 0 && (
            <div className="p-4 border-t border-gray-100 bg-gray-50 space-y-2">
              {sidebarActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className={`
                    w-full flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-all
                    ${
                      action.variant === "primary"
                        ? `bg-gradient-to-r ${colors.gradient} ${colors.gradientHover} text-white shadow-md hover:shadow-lg`
                        : action.variant === "outline"
                        ? `bg-white border ${colors.border} ${colors.text} hover:${colors.bgLight}`
                        : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                    }
                  `}
                >
                  <span className="w-5 h-5 mr-2">{action.icon}</span>
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div
          className={`
            bg-gradient-to-br from-slate-50 to-blue-50/30
            w-full min-h-dvh
            flex flex-col
            pt-14 md:pt-0
            md:pl-64
          `}
        >
          {children}
        </div>
      </>
    );
  }

  // Landing mode (default)
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-4 pb-8 md:pb-12">
        <a href="https://super-simple-apps.com" className="block -mt-8 -mb-5 lg:-mb-3">
          <img
            src="/logo.png"
            alt="Super Simple Apps"
            className="w-56 h-56 sm:w-72 sm:h-72 lg:w-80 lg:h-80 object-contain hover:opacity-90 transition-opacity"
          />
        </a>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          {title || appName}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mb-8">{subtitle}</p>
        {(primaryCta || secondaryCta) && (
          <div className="flex flex-col sm:flex-row gap-3">
            {primaryCta && (
              <a
                href={primaryCta.href}
                className={`inline-flex items-center justify-center bg-gradient-to-r ${colors.gradient} text-white px-8 py-3 rounded-xl font-medium ${colors.gradientHover} transition-all`}
              >
                {primaryCta.label}
              </a>
            )}
            {secondaryCta && (
              <a
                href={secondaryCta.href}
                className={`inline-flex items-center justify-center border-2 ${colors.border} ${colors.text} bg-transparent px-8 py-3 rounded-xl font-medium hover:${colors.bgLight} transition-all`}
              >
                {secondaryCta.label}
              </a>
            )}
          </div>
        )}
      </section>

      {/* Main Content */}
      {children && (
        <section className="px-4 pb-8">
          <div className="max-w-4xl mx-auto">{children}</div>
        </section>
      )}

      {/* Ad Banner */}
      {showAdBanner && bannerUrl && (
        <section className="pt-1 pb-6 px-4">
          <a
            href="https://app-builder-studio.com"
            target="_blank"
            rel="noopener noreferrer"
            className="block max-w-3xl mx-auto"
          >
            <img
              src={bannerUrl}
              alt="App Builder Studio"
              className="w-full rounded-lg shadow-sm hover:shadow-md transition-shadow"
            />
          </a>
        </section>
      )}

      {/* Features Section */}
      {features.length > 0 && (
        <section className="py-12 px-4 bg-white rounded-t-3xl mt-auto">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
            Why Choose {title || appName}?
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 text-center">
                <div
                  className={`w-12 h-12 rounded-lg ${feature.iconBgColor} flex items-center justify-center mx-auto mb-4`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      {!hideFooter && <Footer />}
    </div>
  );
};
