"use client";

import React from "react";
import { Button } from "./Button";
import { AdBanner } from "./AdBanner";

export interface WelcomeFeature {
  icon: React.ReactNode;
  iconBgColor: string;
  title: string;
  description: string;
}

export interface HowItWorksStep {
  title: string;
  description: string;
}

export interface UseCase {
  emoji: string;
  title: string;
  subtitle: string;
}

export interface WelcomeScreenProps {
  /** App title shown in the hero */
  title: string;
  /** App subtitle/description */
  subtitle: string;
  /** Primary CTA button */
  primaryCta?: {
    label: string;
    onClick?: () => void;
    href?: string;
    icon?: React.ReactNode;
  };
  /** Secondary CTA button */
  secondaryCta?: {
    label: string;
    href: string;
  };
  /** Features to display (3-column grid) */
  features: WelcomeFeature[];
  /** Features section title */
  featuresSectionTitle: string;
  /** How it works steps (optional) */
  howItWorks?: HowItWorksStep[];
  /** Use cases section (optional) */
  useCases?: UseCase[];
  /** Use cases section title */
  useCasesSectionTitle?: string;
  /** Whether to show the ad banner */
  showAdBanner?: boolean;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  features,
  featuresSectionTitle,
  howItWorks,
  useCases,
  useCasesSectionTitle = "Perfect for Everyone",
  showAdBanner = true,
}) => {
  return (
    <div className="min-h-[80vh] flex flex-col">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-4 pb-12 md:pb-16">
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
              primaryCta.href ? (
                <a href={primaryCta.href}>
                  <Button variant="primary" size="lg" className="px-8">
                    {primaryCta.icon}
                    {primaryCta.label}
                  </Button>
                </a>
              ) : (
                <Button variant="primary" size="lg" className="px-8" onClick={primaryCta.onClick}>
                  {primaryCta.icon}
                  {primaryCta.label}
                </Button>
              )
            )}
            {secondaryCta && (
              <a href={secondaryCta.href}>
                <Button variant="outline" size="lg" className="px-8">
                  {secondaryCta.label}
                </Button>
              </a>
            )}
          </div>
        )}
      </section>

      {/* Ad Banner */}
      {showAdBanner && (
        <section className="pt-1 pb-6 px-4">
          <div className="max-w-3xl mx-auto">
            <AdBanner />
          </div>
        </section>
      )}

      {/* Features Section */}
      {features.length > 0 && (
        <section className="py-12 px-4 bg-gray-50 rounded-2xl mx-4">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
            {featuresSectionTitle}
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                <div className={`w-12 h-12 rounded-lg ${feature.iconBgColor} flex items-center justify-center mb-4`}>
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

      {/* How It Works Section */}
      {howItWorks && howItWorks.length > 0 && (
        <section className="py-12 px-4">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
            How It Works
          </h2>
          <div className="max-w-3xl mx-auto">
            {howItWorks.map((step, index) => (
              <div key={index} className={`flex flex-col md:flex-row items-center gap-4 ${index < howItWorks.length - 1 ? 'mb-6' : ''}`}>
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl flex-shrink-0">
                  {index + 1}
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Use Cases Section */}
      {useCases && useCases.length > 0 && (
        <section className="py-12 px-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl mx-4">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
            {useCasesSectionTitle}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-white/80 rounded-xl p-4 text-center">
                <span className="text-3xl mb-2 block">{useCase.emoji}</span>
                <h3 className="font-medium text-gray-800">{useCase.title}</h3>
                <p className="text-sm text-gray-600">{useCase.subtitle}</p>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
