"use client";

import React from "react";
import { Footer } from "./Footer";
import { AdBanner } from "./AdBanner";

export interface FeatureItem {
  icon: React.ReactNode;
  iconBgColor: string;
  title: string;
  description: string;
}

export interface LandingTemplateProps {
  /** App title shown in the hero */
  title: string;
  /** App subtitle/description */
  subtitle: string;
  /** Primary CTA button */
  primaryCta?: {
    label: string;
    href: string;
  };
  /** Secondary CTA button */
  secondaryCta?: {
    label: string;
    href: string;
  };
  /** Features to display in the features section */
  features: FeatureItem[];
  /** Main content (the actual app UI) */
  children?: React.ReactNode;
  /** Whether to show the ad banner */
  showAdBanner?: boolean;
  /** Whether to hide the footer (use when page has its own footer in layout) */
  hideFooter?: boolean;
  /** Whether to use full-width layout for the main content */
  fullWidth?: boolean;
  /** Whether to hide the hero section (for app-style layouts) */
  hideHero?: boolean;
  /** Whether to hide the features section */
  hideFeatures?: boolean;
}

export const LandingTemplate: React.FC<LandingTemplateProps> = ({
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  features,
  children,
  showAdBanner = true,
  hideFooter = false,
}) => {
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
          {title}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mb-8">
          {subtitle}
        </p>
        {(primaryCta || secondaryCta) && (
          <div className="flex flex-col sm:flex-row gap-3">
            {primaryCta && (
              <a
                href={primaryCta.href}
                className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all"
              >
                {primaryCta.label}
              </a>
            )}
            {secondaryCta && (
              <a
                href={secondaryCta.href}
                className="inline-flex items-center justify-center border-2 border-blue-600 text-blue-600 bg-transparent px-8 py-3 rounded-xl font-medium hover:bg-blue-50 transition-all"
              >
                {secondaryCta.label}
              </a>
            )}
          </div>
        )}
      </section>

      {/* Ad Banner - Between hero and main content */}
      {showAdBanner && (
        <section className="pt-1 pb-6 px-4">
          <div className="max-w-3xl mx-auto">
            <AdBanner />
          </div>
        </section>
      )}

      {/* Main Content */}
      {children && (
        <section className="px-4 pb-8">
          <div className="max-w-4xl mx-auto">
            {children}
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-12 px-4 bg-white rounded-t-3xl mt-auto">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
          Why Choose {title}?
        </h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-6 text-center">
              <div className={`w-12 h-12 rounded-lg ${feature.iconBgColor} flex items-center justify-center mx-auto mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      {!hideFooter && <Footer />}
    </div>
  );
};
