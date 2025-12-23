"use client";

import React, { useEffect, useRef, useState } from "react";

import { env } from "@/config/env";
import { HouseAd } from "./HouseAd";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export interface AdSlotProps {
  /** Override the default ad slot from env */
  adSlot?: string;
  adFormat?: "auto" | "fluid" | "rectangle" | "vertical" | "horizontal";
  fullWidthResponsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Google AdSense Ad Slot Component
 *
 * Automatically uses credentials from environment variables:
 * - NEXT_PUBLIC_ADSENSE_CLIENT: Your publisher ID (ca-pub-XXXXXXXXXX)
 * - NEXT_PUBLIC_ADSENSE_SLOT: Default ad slot ID
 * - NEXT_PUBLIC_ADSENSE_ENABLED: Set to "true" to enable ads
 *
 * Falls back to HouseAd when AdSense is not available or fails to load.
 *
 * Usage:
 * <AdSlot />  // Uses default slot from env
 * <AdSlot adSlot="1234567890" />  // Override specific slot
 */
export const AdSlot: React.FC<AdSlotProps> = ({
  adSlot,
  adFormat = "auto",
  fullWidthResponsive = true,
  className = "",
  style = {},
}) => {
  const adRef = useRef<HTMLModElement>(null);
  const isLoaded = useRef(false);
  const [adFailed, setAdFailed] = useState(false);

  const adClient = env.ads.adClient;
  const slotId = adSlot || env.ads.adSlot;
  const isEnabled = env.ads.enabled;

  useEffect(() => {
    // Show house ad if disabled or missing credentials
    if (!isEnabled || !adClient) {
      setAdFailed(true);
      return;
    }

    // Only load once
    if (isLoaded.current) return;

    try {
      // Push the ad with timeout for fallback
      if (typeof window !== "undefined" && adRef.current) {
        let attempts = 0;
        const maxAttempts = 50; // 5 seconds total (50 * 100ms)

        const checkAdsbygoogle = setInterval(() => {
          attempts += 1;

          if (window.adsbygoogle) {
            clearInterval(checkAdsbygoogle);
            try {
              (window.adsbygoogle = window.adsbygoogle || []).push({});
              isLoaded.current = true;
            } catch (error: unknown) {
              console.warn("AdSense push error - showing fallback");
              setAdFailed(true);
            }
          } else if (attempts >= maxAttempts) {
            // Timeout - AdSense failed to load (likely ad blocker)
            clearInterval(checkAdsbygoogle);
            console.warn("AdSense timeout - showing fallback ad");
            setAdFailed(true);
          }
        }, 100);
      }
    } catch (error: unknown) {
      console.warn("AdSense error - showing fallback");
      setAdFailed(true);
    }
  }, [isEnabled, adClient, slotId]);

  // Show house ad as fallback
  if (adFailed || !isEnabled || !adClient) {
    return <HouseAd />;
  }

  return (
    <div className={`ad-container ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{
          display: "block",
          ...style,
        }}
        data-ad-client={adClient}
        data-ad-slot={slotId}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive.toString()}
      />
    </div>
  );
};

/**
 * Placeholder component for development (shows where ads will appear)
 */
export const AdSlotPlaceholder: React.FC<{
  className?: string;
  label?: string;
}> = ({ className = "", label = "Advertisement" }) => {
  return (
    <div
      className={`bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-sm font-medium ${className}`}
      style={{ minHeight: "100px" }}
    >
      {label}
    </div>
  );
};
