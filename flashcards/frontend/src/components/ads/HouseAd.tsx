"use client";

/**
 * House ad component - shown when AdSense is not available
 * Promotes app development services as a fallback
 * Height matches AD_SLOT_HEIGHT (120px) to prevent layout shift
 */
export function HouseAd() {
  return (
    <div className="w-full p-4 rounded-lg bg-gradient-to-r from-blue-600/10 to-cyan-600/10 border border-blue-500/30">
      <div className="flex flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-base font-bold text-gray-800 dark:text-white">
            Have an App Idea?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            We build custom web and mobile applications.
          </p>
        </div>
        <div className="flex-shrink-0">
          <a
            href="https://app-builder-studio.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg text-sm whitespace-nowrap"
          >
            App Builder Studio
          </a>
        </div>
      </div>
    </div>
  );
}
