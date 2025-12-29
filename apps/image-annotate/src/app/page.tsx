"use client";

import { useState, useEffect, useCallback } from "react";
import { LandingTemplate } from "@super-simple-apps/shared-assets";
import { DropZone } from "@/components/DropZone";
import { Toolbar } from "@/components/Toolbar";
import { AnnotationCanvas } from "@/components/AnnotationCanvas";
import { AnnotatedResult } from "@/components/AnnotatedResult";
import { useAnnotation } from "@/hooks/useAnnotation";

type AppState = "upload" | "annotate" | "result";

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
          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
        />
      </svg>
    ),
    iconBgColor: "bg-blue-100",
    title: "Simple Tools",
    description: "Draw, highlight, add arrows, text, and blur sensitive info.",
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
    description: "No sign-up, no limits, no watermarks. Just annotate and go.",
  },
];

export default function Home() {
  const [appState, setAppState] = useState<AppState>("upload");
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [originalFileName, setOriginalFileName] = useState<string>("image");
  const [annotatedImage, setAnnotatedImage] = useState<string | null>(null);
  const [fromApp, setFromApp] = useState<string | null>(null);
  const [exportTrigger, setExportTrigger] = useState(0);

  const annotation = useAnnotation();

  // Check for shared image from other apps on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const from = urlParams.get("from");

    if (from) {
      setFromApp(from);

      // Listen for postMessage from the source app
      const handleMessage = (event: MessageEvent) => {
        if (event.data?.type === "super-simple-apps-shared-image") {
          setOriginalImage(event.data.image);
          setOriginalFileName(event.data.fileName || "shared-image");
          setAppState("annotate");

          // Clean up URL
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      };

      window.addEventListener("message", handleMessage);

      // Fallback: also try localStorage (for same-origin or older implementation)
      try {
        const sharedImage = localStorage.getItem("super-simple-apps-shared-image");
        const sharedFileName = localStorage.getItem("super-simple-apps-shared-image-name");

        if (sharedImage) {
          setOriginalImage(sharedImage);
          setOriginalFileName(sharedFileName || "shared-image");
          setAppState("annotate");

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

  const handleImageSelect = (imageDataUrl: string, file: File) => {
    setOriginalImage(imageDataUrl);
    setOriginalFileName(file.name);
    setAppState("annotate");
  };

  const handleDone = useCallback(() => {
    setExportTrigger((prev) => prev + 1);
  }, []);

  const handleExport = useCallback((dataUrl: string) => {
    setAnnotatedImage(dataUrl);
    setAppState("result");
  }, []);

  const handleCancel = () => {
    setOriginalImage(null);
    setOriginalFileName("image");
    setAppState("upload");
  };

  const handleReset = () => {
    setOriginalImage(null);
    setOriginalFileName("image");
    setAnnotatedImage(null);
    setAppState("upload");
  };

  const getFromAppName = (app: string) => {
    switch (app) {
      case "crop":
        return "Image Crop";
      case "resize":
        return "Image Resize";
      default:
        return app;
    }
  };

  return (
    <LandingTemplate
      title="Super Simple Image Annotate"
      subtitle="Draw, highlight, and add text to your images right in your browser. No upload required."
      features={features}
    >
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
        {fromApp && appState === "annotate" && (
          <div className="mb-4 text-center text-sm text-amber-600 bg-amber-50 rounded-lg py-2">
            Image received from {getFromAppName(fromApp)}!
          </div>
        )}

        {appState === "upload" && (
          <DropZone onImageSelect={handleImageSelect} />
        )}

        {appState === "annotate" && originalImage && (
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <AnnotationCanvas
                imageSrc={originalImage}
                tool={annotation.tool}
                annotations={annotation.annotations}
                currentAnnotation={annotation.currentAnnotation}
                onStartAnnotation={annotation.startAnnotation}
                onUpdateAnnotation={annotation.updateAnnotation}
                onFinishAnnotation={annotation.finishAnnotation}
                onAddText={annotation.addTextAnnotation}
                onExport={handleExport}
                exportTrigger={exportTrigger}
              />
            </div>
            <div className="lg:w-48">
              <Toolbar
                tool={annotation.tool}
                color={annotation.color}
                strokeWidth={annotation.strokeWidth}
                colors={annotation.COLORS}
                canUndo={annotation.canUndo}
                canRedo={annotation.canRedo}
                onToolChange={annotation.setTool}
                onColorChange={annotation.setColor}
                onStrokeWidthChange={annotation.setStrokeWidth}
                onUndo={annotation.undo}
                onRedo={annotation.redo}
                onClear={annotation.clearAll}
                onDone={handleDone}
                onCancel={handleCancel}
              />
            </div>
          </div>
        )}

        {appState === "result" && annotatedImage && (
          <AnnotatedResult
            imageUrl={annotatedImage}
            originalFileName={originalFileName}
            onReset={handleReset}
          />
        )}
      </div>
    </LandingTemplate>
  );
}
