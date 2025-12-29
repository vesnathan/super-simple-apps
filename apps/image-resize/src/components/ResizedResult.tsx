"use client";

import { useCallback, useMemo } from "react";
import { Button } from "@super-simple-apps/shared-assets";

interface ResizedResultProps {
  imageUrl: string;
  originalFileName: string;
  onReset: () => void;
}

export function ResizedResult({ imageUrl, originalFileName, onReset }: ResizedResultProps) {
  const fileName = useMemo(() => {
    const ext = imageUrl.split(";")[0].split("/")[1] || "png";
    const baseName = originalFileName.replace(/\.[^/.]+$/, "");
    return `${baseName}-resized.${ext}`;
  }, [imageUrl, originalFileName]);

  const handleDownload = useCallback(() => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [imageUrl, fileName]);

  const sendImageToApp = useCallback((targetUrl: string) => {
    const newWindow = window.open(targetUrl, "_blank");

    if (newWindow) {
      // Send image data via postMessage after the new window loads
      const sendMessage = () => {
        newWindow.postMessage({
          type: "super-simple-apps-shared-image",
          image: imageUrl,
          fileName: fileName,
          from: "resize"
        }, "*");
      };

      // Try multiple times as the window may take time to load
      const attempts = [500, 1000, 2000, 3000, 5000];
      attempts.forEach(delay => {
        setTimeout(sendMessage, delay);
      });
    }
  }, [imageUrl, fileName]);

  const handleSendToCrop = useCallback(() => {
    sendImageToApp("https://crop.super-simple-apps.com?from=resize");
  }, [sendImageToApp]);

  const handleSendToAnnotate = useCallback(() => {
    sendImageToApp("https://annotate.super-simple-apps.com?from=resize");
  }, [sendImageToApp]);

  // Calculate file size from base64
  const fileSize = useMemo(() => {
    const base64Length = imageUrl.split(",")[1]?.length || 0;
    const bytes = (base64Length * 3) / 4;
    if (bytes < 1024) return `${bytes.toFixed(0)} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }, [imageUrl]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800">Image Resized!</h3>
        <p className="text-sm text-gray-500 mt-1">File size: ~{fileSize}</p>
      </div>

      <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center">
        <img
          src={imageUrl}
          alt="Resized result"
          className="max-w-full max-h-80 object-contain rounded shadow-sm"
        />
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        <Button onClick={onReset} variant="secondary">
          Resize Another
        </Button>
        <Button onClick={handleSendToCrop} variant="primary">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Send to Crop
        </Button>
        <Button onClick={handleSendToAnnotate} variant="primary" className="bg-amber-600 hover:bg-amber-700">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          Send to Annotate
        </Button>
        <Button onClick={handleDownload} variant="primary">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V3" />
          </svg>
          Download
        </Button>
      </div>
    </div>
  );
}
