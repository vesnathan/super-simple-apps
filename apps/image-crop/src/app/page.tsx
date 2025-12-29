"use client";

import { useState, useEffect } from "react";
import { LandingTemplate } from "@super-simple-apps/shared-assets";
import { DropZone } from "@/components/DropZone";
import { ImageCropper } from "@/components/ImageCropper";
import { CroppedResult } from "@/components/CroppedResult";

type AppState = "upload" | "crop" | "result";

const features = [
  {
    icon: (
      <svg
        className="w-6 h-6 text-green-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        />
      </svg>
    ),
    iconBgColor: "bg-green-100",
    title: "100% Private",
    description: "Images never leave your browser. Everything happens locally.",
  },
  {
    icon: (
      <svg
        className="w-6 h-6 text-blue-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
    iconBgColor: "bg-blue-100",
    title: "Instant",
    description: "No waiting for uploads. Crop and download in seconds.",
  },
  {
    icon: (
      <svg
        className="w-6 h-6 text-purple-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    iconBgColor: "bg-purple-100",
    title: "Free",
    description: "No sign-up, no limits, no watermarks. Just crop and go.",
  },
];

export default function Home() {
  const [state, setState] = useState<AppState>("upload");
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [fromApp, setFromApp] = useState<string | null>(null);

  // Check for shared image from resize app on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const from = urlParams.get("from");

    if (from) {
      setFromApp(from);

      // Listen for postMessage from the source app
      const handleMessage = (event: MessageEvent) => {
        if (event.data?.type === "super-simple-apps-shared-image") {
          setOriginalImage(event.data.image);
          setState("crop");

          // Clean up URL
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      };

      window.addEventListener("message", handleMessage);

      // Fallback: also try localStorage (for same-origin or older implementation)
      try {
        const sharedImage = localStorage.getItem("super-simple-apps-shared-image");

        if (sharedImage) {
          setOriginalImage(sharedImage);
          setState("crop");

          // Clear shared data after reading
          localStorage.removeItem("super-simple-apps-shared-image");
          localStorage.removeItem("super-simple-apps-shared-image-name");

          // Clean up URL
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      } catch {
        // localStorage might not be available
      }

      return () => {
        window.removeEventListener("message", handleMessage);
      };
    }
  }, []);

  const handleImageSelect = (imageDataUrl: string) => {
    setOriginalImage(imageDataUrl);
    setState("crop");
  };

  const handleCropComplete = (croppedImageUrl: string) => {
    setCroppedImage(croppedImageUrl);
    setState("result");
  };

  const handleCancel = () => {
    setOriginalImage(null);
    setState("upload");
  };

  const handleReset = () => {
    setOriginalImage(null);
    setCroppedImage(null);
    setState("upload");
  };

  return (
    <LandingTemplate
      title="Super Simple Image Crop"
      subtitle="Crop your images right in your browser. No upload required - your images stay private."
      features={features}
    >
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
        {fromApp && state === "crop" && (
          <div className="mb-4 text-center text-sm text-blue-600 bg-blue-50 rounded-lg py-2">
            Image received from {fromApp === "resize" ? "Image Resize" : fromApp}!
          </div>
        )}

        {state === "upload" && (
          <DropZone onImageSelect={handleImageSelect} />
        )}

        {state === "crop" && originalImage && (
          <ImageCropper
            imageSrc={originalImage}
            onCropComplete={handleCropComplete}
            onCancel={handleCancel}
          />
        )}

        {state === "result" && croppedImage && (
          <CroppedResult imageUrl={croppedImage} onReset={handleReset} />
        )}
      </div>
    </LandingTemplate>
  );
}
