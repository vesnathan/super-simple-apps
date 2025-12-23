"use client";

import React, { useEffect, useState, useRef } from "react";

import { env } from "@/config/env";
import { HouseAd } from "./HouseAd";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export interface RotatingAdSlotProps {
  /** Override the default ad slot from env */
  adSlot?: string;
  adFormat?: "auto" | "fluid" | "rectangle" | "vertical" | "horizontal";
  fullWidthResponsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
  /** Rotation interval in milliseconds (default: 30000 = 30 seconds) */
  rotationInterval?: number;
  /** Show house ad every N rotations (default: 4 = every 4th ad is house ad) */
  houseAdFrequency?: number;
}

/** Fixed height for ad slot to prevent layout shift */
const AD_SLOT_HEIGHT = 120;

/**
 * Rotating Ad Slot Component
 *
 * Rotates between Google AdSense and House Ads on a timer.
 * - Rotates every 30 seconds by default
 * - Shows HouseAd every 4th rotation (when AdSense is enabled)
 * - Falls back to HouseAd only when AdSense is not available
 * - Uses fixed height container to prevent layout shift
 */
export const RotatingAdSlot: React.FC<RotatingAdSlotProps> = ({
  adSlot,
  adFormat = "horizontal",
  fullWidthResponsive = true,
  className = "",
  style = {},
  rotationInterval = 30000,
  houseAdFrequency = 4,
}) => {
  const [rotationCount, setRotationCount] = useState(0);
  const [adSenseLoaded, setAdSenseLoaded] = useState(false);
  const [adSenseFailed, setAdSenseFailed] = useState(false);
  const adRef = useRef<HTMLModElement>(null);
  const isInitialized = useRef(false);
  const adPushed = useRef(false);

  const adClient = env.ads.adClient;
  const slotId = adSlot || env.ads.adSlot;
  const isEnabled = env.ads.enabled;

  // Determine if we should show the house ad this rotation
  // Show house ad every Nth rotation (not on first load), or if AdSense fails
  const showHouseAd =
    !isEnabled ||
    !adClient ||
    adSenseFailed ||
    (rotationCount > 0 && rotationCount % houseAdFrequency === 0);

  // Initialize AdSense on mount
  useEffect(() => {
    if (!isEnabled || !adClient || isInitialized.current) return;

    const checkAdsbygoogle = setInterval(() => {
      if (window.adsbygoogle) {
        clearInterval(checkAdsbygoogle);
        setAdSenseLoaded(true);
        isInitialized.current = true;
      }
    }, 100);

    // Timeout after 5 seconds
    const timeout = setTimeout(() => {
      clearInterval(checkAdsbygoogle);
      if (!isInitialized.current) {
        setAdSenseFailed(true);
      }
    }, 5000);

    return () => {
      clearInterval(checkAdsbygoogle);
      clearTimeout(timeout);
    };
  }, [isEnabled, adClient]);

  // Push ad once when AdSense is loaded (don't re-push on rotation)
  useEffect(() => {
    if (!showHouseAd && adSenseLoaded && adRef.current && !adPushed.current) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        adPushed.current = true;
      } catch (error: unknown) {
        console.warn("AdSense push error");
        setAdSenseFailed(true);
      }
    }
  }, [showHouseAd, adSenseLoaded]);

  // Rotation timer - only rotate if AdSense is working
  useEffect(() => {
    // Don't rotate if AdSense failed or isn't loaded
    if (adSenseFailed || !adSenseLoaded) return;

    const timer = setInterval(() => {
      setRotationCount((prev) => prev + 1);
    }, rotationInterval);

    return () => clearInterval(timer);
  }, [rotationInterval, adSenseFailed, adSenseLoaded]);

  // Fixed height container to prevent layout shift
  const containerStyle: React.CSSProperties = {
    minHeight: AD_SLOT_HEIGHT,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  // Show house ad
  if (showHouseAd) {
    return (
      <div style={containerStyle} className={className}>
        <HouseAd />
      </div>
    );
  }

  // Show AdSense (don't use key to avoid remounting)
  return (
    <div className={`ad-container ${className}`} style={containerStyle}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{
          display: "block",
          width: "100%",
          height: AD_SLOT_HEIGHT,
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
