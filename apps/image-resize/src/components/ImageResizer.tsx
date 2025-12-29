"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@super-simple-apps/shared-assets";

interface ImageResizerProps {
  imageSrc: string;
  originalFileName: string;
  onResizeComplete: (resizedImageUrl: string) => void;
  onCancel: () => void;
}

type ResizeMode = "percentage" | "dimensions" | "preset";

interface PresetSize {
  name: string;
  width: number;
  height: number;
}

const PRESET_SIZES: PresetSize[] = [
  { name: "Profile (128x128)", width: 128, height: 128 },
  { name: "Thumbnail (150x150)", width: 150, height: 150 },
  { name: "Small (320x240)", width: 320, height: 240 },
  { name: "Medium (640x480)", width: 640, height: 480 },
  { name: "Large (1024x768)", width: 1024, height: 768 },
  { name: "HD (1280x720)", width: 1280, height: 720 },
  { name: "Full HD (1920x1080)", width: 1920, height: 1080 },
  { name: "4K (3840x2160)", width: 3840, height: 2160 },
];

export function ImageResizer({
  imageSrc,
  originalFileName,
  onResizeComplete,
  onCancel,
}: ImageResizerProps) {
  const [mode, setMode] = useState<ResizeMode>("percentage");
  const [percentage, setPercentage] = useState(100);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const [quality, setQuality] = useState(92);
  const [outputFormat, setOutputFormat] = useState<"original" | "jpeg" | "png" | "webp">("original");
  const [isProcessing, setIsProcessing] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Load image and get original dimensions
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setOriginalWidth(img.width);
      setOriginalHeight(img.height);
      setWidth(img.width);
      setHeight(img.height);
    };
    img.src = imageSrc;
  }, [imageSrc]);

  const aspectRatio = originalWidth / originalHeight;

  const handleWidthChange = useCallback((newWidth: number) => {
    setWidth(newWidth);
    if (maintainAspectRatio && aspectRatio) {
      setHeight(Math.round(newWidth / aspectRatio));
    }
  }, [maintainAspectRatio, aspectRatio]);

  const handleHeightChange = useCallback((newHeight: number) => {
    setHeight(newHeight);
    if (maintainAspectRatio && aspectRatio) {
      setWidth(Math.round(newHeight * aspectRatio));
    }
  }, [maintainAspectRatio, aspectRatio]);

  const handlePercentageChange = useCallback((newPercentage: number) => {
    setPercentage(newPercentage);
    if (originalWidth && originalHeight) {
      setWidth(Math.round(originalWidth * (newPercentage / 100)));
      setHeight(Math.round(originalHeight * (newPercentage / 100)));
    }
  }, [originalWidth, originalHeight]);

  const handlePresetSelect = useCallback((index: number) => {
    setSelectedPreset(index);
    const preset = PRESET_SIZES[index];
    setWidth(preset.width);
    setHeight(preset.height);
  }, []);

  const getOutputMimeType = useCallback(() => {
    if (outputFormat === "original") {
      // Try to detect from file extension
      const ext = originalFileName.split(".").pop()?.toLowerCase();
      if (ext === "png") return "image/png";
      if (ext === "webp") return "image/webp";
      if (ext === "gif") return "image/gif";
      return "image/jpeg";
    }
    if (outputFormat === "jpeg") return "image/jpeg";
    if (outputFormat === "png") return "image/png";
    if (outputFormat === "webp") return "image/webp";
    return "image/jpeg";
  }, [outputFormat, originalFileName]);

  const handleResize = useCallback(() => {
    if (!canvasRef.current || width <= 0 || height <= 0) return;

    setIsProcessing(true);

    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        setIsProcessing(false);
        return;
      }

      // Enable high-quality image scaling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      ctx.drawImage(img, 0, 0, width, height);

      const mimeType = getOutputMimeType();
      const qualityValue = mimeType === "image/png" ? undefined : quality / 100;
      const resizedDataUrl = canvas.toDataURL(mimeType, qualityValue);

      onResizeComplete(resizedDataUrl);
      setIsProcessing(false);
    };
    img.src = imageSrc;
  }, [imageSrc, width, height, quality, getOutputMimeType, onResizeComplete]);

  const estimatedSize = useCallback(() => {
    // Rough estimate based on dimensions and quality
    const pixels = width * height;
    const bytesPerPixel = outputFormat === "png" ? 3 : (quality / 100) * 0.5 + 0.2;
    const bytes = pixels * bytesPerPixel;
    if (bytes < 1024) return `${bytes.toFixed(0)} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }, [width, height, quality, outputFormat]);

  return (
    <div className="space-y-6">
      {/* Preview */}
      <div className="relative bg-gray-100 rounded-lg p-4 flex items-center justify-center" style={{ minHeight: "200px" }}>
        <img
          ref={imageRef}
          src={imageSrc}
          alt="Preview"
          className="max-w-full max-h-64 object-contain rounded"
        />
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Original Info */}
      <div className="text-sm text-gray-500 text-center">
        Original: {originalWidth} x {originalHeight} pixels
      </div>

      {/* Mode Selection */}
      <div className="flex gap-2 justify-center">
        <Button
          onClick={() => setMode("percentage")}
          variant={mode === "percentage" ? "primary" : "secondary"}
          size="sm"
        >
          By Percentage
        </Button>
        <Button
          onClick={() => setMode("dimensions")}
          variant={mode === "dimensions" ? "primary" : "secondary"}
          size="sm"
        >
          By Dimensions
        </Button>
        <Button
          onClick={() => setMode("preset")}
          variant={mode === "preset" ? "primary" : "secondary"}
          size="sm"
        >
          Presets
        </Button>
      </div>

      {/* Percentage Mode */}
      {mode === "percentage" && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Scale: {percentage}%
            </label>
            <input
              type="range"
              min="1"
              max="200"
              value={percentage}
              onChange={(e) => handlePercentageChange(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1%</span>
              <span>50%</span>
              <span>100%</span>
              <span>150%</span>
              <span>200%</span>
            </div>
          </div>
          <div className="flex gap-2 justify-center flex-wrap">
            {[25, 50, 75, 100, 150, 200].map((p) => (
              <Button
                key={p}
                onClick={() => handlePercentageChange(p)}
                variant={percentage === p ? "primary" : "secondary"}
                size="sm"
              >
                {p}%
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Dimensions Mode */}
      {mode === "dimensions" && (
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Width (px)
              </label>
              <input
                type="number"
                min="1"
                max="10000"
                value={width}
                onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div className="text-2xl text-gray-400 pt-6">×</div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Height (px)
              </label>
              <input
                type="number"
                min="1"
                max="10000"
                value={height}
                onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
                className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
          <div className="flex items-center justify-center gap-2">
            <input
              type="checkbox"
              id="aspect-ratio"
              checked={maintainAspectRatio}
              onChange={(e) => setMaintainAspectRatio(e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="aspect-ratio" className="text-sm text-gray-700">
              Maintain aspect ratio
            </label>
          </div>
        </div>
      )}

      {/* Preset Mode */}
      {mode === "preset" && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {PRESET_SIZES.map((preset, index) => (
            <Button
              key={preset.name}
              onClick={() => handlePresetSelect(index)}
              variant={selectedPreset === index ? "primary" : "secondary"}
              size="sm"
              className="flex-col py-2"
            >
              <div className="font-medium">{preset.name.split(" ")[0]}</div>
              <div className="text-xs opacity-75">
                {preset.width}×{preset.height}
              </div>
            </Button>
          ))}
        </div>
      )}

      {/* Output Options */}
      <div className="border-t pt-4 space-y-4">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Format
            </label>
            <select
              value={outputFormat}
              onChange={(e) => setOutputFormat(e.target.value as typeof outputFormat)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="original">Original</option>
              <option value="jpeg">JPEG</option>
              <option value="png">PNG</option>
              <option value="webp">WebP</option>
            </select>
          </div>
          {outputFormat !== "png" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quality: {quality}%
              </label>
              <input
                type="range"
                min="10"
                max="100"
                value={quality}
                onChange={(e) => setQuality(parseInt(e.target.value))}
                className="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
              />
            </div>
          )}
        </div>
      </div>

      {/* Output Info */}
      <div className="text-center text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
        Output: <strong>{width} × {height}</strong> pixels
        <span className="mx-2">•</span>
        Estimated size: <strong>~{estimatedSize()}</strong>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-center">
        <Button onClick={onCancel} variant="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleResize}
          disabled={isProcessing || width <= 0 || height <= 0}
          variant="primary"
        >
          {isProcessing ? (
            <>
              <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Processing...
            </>
          ) : (
            "Resize Image"
          )}
        </Button>
      </div>
    </div>
  );
}
