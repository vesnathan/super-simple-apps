"use client";

import React, { useState, useEffect } from "react";

export const AdBlockerBanner: React.FC = () => {
  const [isAdBlocked, setIsAdBlocked] = useState(false);

  useEffect(() => {
    // Detect ad blocker by checking if adsbygoogle is blocked
    const detectAdBlocker = async () => {
      try {
        // Method 1: Check if adsbygoogle script loaded
        await new Promise((resolve) => setTimeout(resolve, 1500));

        if (typeof window !== "undefined") {
          // Check if adsbygoogle exists and is functional
          const adsByGoogle = (window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle;

          if (!adsByGoogle) {
            setIsAdBlocked(true);
            return;
          }

          // Method 2: Try to create a bait element
          const bait = document.createElement("div");
          bait.className = "adsbox ad-slot google-ad";
          bait.style.cssText = "position:absolute;top:-9999px;left:-9999px;width:1px;height:1px;";
          document.body.appendChild(bait);

          await new Promise((resolve) => setTimeout(resolve, 100));

          if (bait.offsetHeight === 0 || bait.clientHeight === 0) {
            setIsAdBlocked(true);
          }

          document.body.removeChild(bait);
        }
      } catch {
        // If detection fails, assume no ad blocker
        setIsAdBlocked(false);
      }
    };

    detectAdBlocker();
  }, []);

  if (!isAdBlocked) {
    return null;
  }

  return (
    <div className="fixed top-14 md:top-0 left-0 right-0 md:left-64 z-40 bg-amber-50 border-b border-amber-200 px-4 py-2">
      <div className="flex items-center justify-center max-w-7xl mx-auto">
        <p className="text-sm text-amber-800 text-center">
          We noticed you&apos;re using an ad blocker. This free app is supported by ads.
          Please consider allowing ads to help keep it running.
        </p>
      </div>
    </div>
  );
};
