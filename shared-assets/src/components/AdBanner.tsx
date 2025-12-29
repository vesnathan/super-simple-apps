"use client";

import { useEffect, useState } from "react";

export interface AdBannerProps {
  /** Additional CSS classes */
  className?: string;
}

/**
 * Shared ad banner component - displays the App Builder Studio banner
 * Used across all Super Simple Apps for consistent advertising
 */
export function AdBanner({ className = "" }: AdBannerProps) {
  const [bannerUrl, setBannerUrl] = useState("");

  useEffect(() => {
    setBannerUrl(`https://app-builder-studio.com/assets/banner.png?t=${Date.now()}`);
  }, []);

  if (!bannerUrl) {
    return null;
  }

  return (
    <a
      href="https://app-builder-studio.com"
      target="_blank"
      rel="noopener noreferrer"
      className={`block w-full ${className}`}
    >
      <img
        src={bannerUrl}
        alt="App Builder Studio - Custom Apps Built to Launch & Scale"
        className="w-full rounded-lg shadow-sm hover:shadow-md transition-shadow"
      />
    </a>
  );
}
