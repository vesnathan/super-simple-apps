"use client";

import { useCallback, useMemo } from "react";
import { Button } from "@super-simple-apps/shared-assets";

interface AnnotatedResultProps {
  imageUrl: string;
  originalFileName: string;
  onReset: () => void;
}

export function AnnotatedResult({ imageUrl, originalFileName, onReset }: AnnotatedResultProps) {
  const fileName = useMemo(() => {
    const baseName = originalFileName.replace(/\.[^/.]+$/, "");
    return `${baseName}-annotated.png`;
  }, [originalFileName]);

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
          from: "annotate"
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
    sendImageToApp("https://crop.super-simple-apps.com?from=annotate");
  }, [sendImageToApp]);

  const handleSendToResize = useCallback(() => {
    sendImageToApp("https://resize.super-simple-apps.com?from=annotate");
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
        <h3 className="text-lg font-semibold text-gray-800">Image Annotated!</h3>
        <p className="text-sm text-gray-500 mt-1">File size: ~{fileSize}</p>
      </div>

      <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center">
        <img
          src={imageUrl}
          alt="Annotated result"
          className="max-w-full max-h-80 object-contain rounded shadow-sm"
        />
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        <Button onClick={onReset} variant="secondary">
          Annotate Another
        </Button>
        <Button onClick={handleSendToCrop} variant="primary">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Send to Crop
        </Button>
        <Button onClick={handleSendToResize} variant="success">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
          Send to Resize
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
