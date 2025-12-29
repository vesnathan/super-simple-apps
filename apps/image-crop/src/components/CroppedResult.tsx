"use client";

import { useCallback } from "react";
import { Button } from "@super-simple-apps/shared-assets";

interface CroppedResultProps {
  imageUrl: string;
  onReset: () => void;
}

export function CroppedResult({ imageUrl, onReset }: CroppedResultProps) {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `cropped-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyToClipboard = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob }),
      ]);
      alert("Image copied to clipboard!");
    } catch (err) {
      // Fallback: copy the data URL as text
      try {
        await navigator.clipboard.writeText(imageUrl);
        alert("Image URL copied to clipboard!");
      } catch {
        alert("Failed to copy to clipboard");
      }
    }
  };

  const sendImageToApp = useCallback((targetUrl: string) => {
    const fileName = `cropped-image-${Date.now()}.png`;
    const newWindow = window.open(targetUrl, "_blank");

    if (newWindow) {
      // Send image data via postMessage after the new window loads
      const sendMessage = () => {
        newWindow.postMessage({
          type: "super-simple-apps-shared-image",
          image: imageUrl,
          fileName: fileName,
          from: "crop"
        }, "*");
      };

      // Try multiple times as the window may take time to load
      const attempts = [500, 1000, 2000, 3000, 5000];
      attempts.forEach(delay => {
        setTimeout(sendMessage, delay);
      });
    }
  }, [imageUrl]);

  const handleSendToResize = useCallback(() => {
    sendImageToApp("https://resize.super-simple-apps.com?from=crop");
  }, [sendImageToApp]);

  const handleSendToAnnotate = useCallback(() => {
    sendImageToApp("https://annotate.super-simple-apps.com?from=crop");
  }, [sendImageToApp]);

  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="text-xl font-semibold text-gray-800">Cropped Image</h2>

      <div className="relative inline-block bg-gray-100 rounded-lg p-2">
        {/* Checkered background to show transparency */}
        <div
          className="absolute inset-2 rounded"
          style={{
            backgroundImage: `linear-gradient(45deg, #ccc 25%, transparent 25%),
              linear-gradient(-45deg, #ccc 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #ccc 75%),
              linear-gradient(-45deg, transparent 75%, #ccc 75%)`,
            backgroundSize: "16px 16px",
            backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
          }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt="Cropped result"
          className="relative max-w-full max-h-[50vh] rounded"
        />
      </div>

      <div className="flex gap-4 flex-wrap justify-center">
        <Button onClick={handleDownload} variant="success">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download
        </Button>

        <Button onClick={handleSendToResize} variant="success">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
          Send to Resize
        </Button>

        <Button onClick={handleSendToAnnotate} variant="primary" className="bg-amber-600 hover:bg-amber-700">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          Send to Annotate
        </Button>

        <Button onClick={handleCopyToClipboard} variant="primary">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
          Copy to Clipboard
        </Button>

        <Button onClick={onReset} variant="secondary">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Crop Another Image
        </Button>
      </div>
    </div>
  );
}
