"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import clsx from "clsx";
import { Button } from "@super-simple-apps/shared-assets";

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ImageCropperProps {
  imageSrc: string;
  onCropComplete: (croppedImageUrl: string) => void;
  onCancel: () => void;
}

export function ImageCropper({
  imageSrc,
  onCropComplete,
  onCancel,
}: ImageCropperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [crop, setCrop] = useState<CropArea>({ x: 0, y: 0, width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [displayedSize, setDisplayedSize] = useState({ width: 0, height: 0 });

  // Initialize crop area when image loads
  const handleImageLoad = useCallback(() => {
    if (!imageRef.current || !containerRef.current) return;

    const img = imageRef.current;
    const container = containerRef.current;

    // Get the displayed size of the image
    const displayedWidth = img.clientWidth;
    const displayedHeight = img.clientHeight;

    setDisplayedSize({ width: displayedWidth, height: displayedHeight });

    // Set initial crop to center 80% of image
    const cropWidth = displayedWidth * 0.8;
    const cropHeight = displayedHeight * 0.8;
    const cropX = (displayedWidth - cropWidth) / 2;
    const cropY = (displayedHeight - cropHeight) / 2;

    setCrop({
      x: cropX,
      y: cropY,
      width: cropWidth,
      height: cropHeight,
    });
    setImageLoaded(true);
  }, []);

  const getMousePosition = useCallback(
    (e: React.MouseEvent | MouseEvent) => {
      if (!imageRef.current) return { x: 0, y: 0 };
      const rect = imageRef.current.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    },
    []
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, handle?: string) => {
      e.preventDefault();
      const pos = getMousePosition(e);

      if (handle) {
        setIsResizing(true);
        setResizeHandle(handle);
      } else {
        // Check if clicking inside crop area
        if (
          pos.x >= crop.x &&
          pos.x <= crop.x + crop.width &&
          pos.y >= crop.y &&
          pos.y <= crop.y + crop.height
        ) {
          setIsDragging(true);
        }
      }
      setDragStart(pos);
    },
    [crop, getMousePosition]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging && !isResizing) return;

      const pos = getMousePosition(e);
      const deltaX = pos.x - dragStart.x;
      const deltaY = pos.y - dragStart.y;

      if (isDragging) {
        setCrop((prev) => {
          let newX = prev.x + deltaX;
          let newY = prev.y + deltaY;

          // Constrain to image bounds
          newX = Math.max(0, Math.min(newX, displayedSize.width - prev.width));
          newY = Math.max(0, Math.min(newY, displayedSize.height - prev.height));

          return { ...prev, x: newX, y: newY };
        });
      } else if (isResizing && resizeHandle) {
        setCrop((prev) => {
          let { x, y, width, height } = prev;
          const minSize = 20;

          switch (resizeHandle) {
            case "nw":
              width = Math.max(minSize, width - deltaX);
              height = Math.max(minSize, height - deltaY);
              x = Math.min(prev.x + prev.width - minSize, prev.x + deltaX);
              y = Math.min(prev.y + prev.height - minSize, prev.y + deltaY);
              break;
            case "ne":
              width = Math.max(minSize, width + deltaX);
              height = Math.max(minSize, height - deltaY);
              y = Math.min(prev.y + prev.height - minSize, prev.y + deltaY);
              break;
            case "sw":
              width = Math.max(minSize, width - deltaX);
              height = Math.max(minSize, height + deltaY);
              x = Math.min(prev.x + prev.width - minSize, prev.x + deltaX);
              break;
            case "se":
              width = Math.max(minSize, width + deltaX);
              height = Math.max(minSize, height + deltaY);
              break;
            case "n":
              height = Math.max(minSize, height - deltaY);
              y = Math.min(prev.y + prev.height - minSize, prev.y + deltaY);
              break;
            case "s":
              height = Math.max(minSize, height + deltaY);
              break;
            case "w":
              width = Math.max(minSize, width - deltaX);
              x = Math.min(prev.x + prev.width - minSize, prev.x + deltaX);
              break;
            case "e":
              width = Math.max(minSize, width + deltaX);
              break;
          }

          // Constrain to image bounds
          x = Math.max(0, x);
          y = Math.max(0, y);
          width = Math.min(width, displayedSize.width - x);
          height = Math.min(height, displayedSize.height - y);

          return { x, y, width, height };
        });
      }

      setDragStart(pos);
    },
    [isDragging, isResizing, resizeHandle, dragStart, getMousePosition, displayedSize]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle(null);
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const performCrop = useCallback(() => {
    if (!imageRef.current) return;

    const img = imageRef.current;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Calculate the scale between displayed size and natural size
    const scaleX = img.naturalWidth / displayedSize.width;
    const scaleY = img.naturalHeight / displayedSize.height;

    // Calculate crop coordinates in natural image dimensions
    const naturalCrop = {
      x: crop.x * scaleX,
      y: crop.y * scaleY,
      width: crop.width * scaleX,
      height: crop.height * scaleY,
    };

    canvas.width = naturalCrop.width;
    canvas.height = naturalCrop.height;

    ctx.drawImage(
      img,
      naturalCrop.x,
      naturalCrop.y,
      naturalCrop.width,
      naturalCrop.height,
      0,
      0,
      naturalCrop.width,
      naturalCrop.height
    );

    const croppedDataUrl = canvas.toDataURL("image/png");
    onCropComplete(croppedDataUrl);
  }, [crop, displayedSize, onCropComplete]);

  const handleStyles: Record<string, React.CSSProperties> = {
    nw: { top: -5, left: -5, cursor: "nwse-resize" },
    ne: { top: -5, right: -5, cursor: "nesw-resize" },
    sw: { bottom: -5, left: -5, cursor: "nesw-resize" },
    se: { bottom: -5, right: -5, cursor: "nwse-resize" },
    n: { top: -5, left: "50%", transform: "translateX(-50%)", cursor: "ns-resize" },
    s: { bottom: -5, left: "50%", transform: "translateX(-50%)", cursor: "ns-resize" },
    w: { top: "50%", left: -5, transform: "translateY(-50%)", cursor: "ew-resize" },
    e: { top: "50%", right: -5, transform: "translateY(-50%)", cursor: "ew-resize" },
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        ref={containerRef}
        className="relative inline-block max-w-full overflow-hidden bg-gray-900 rounded-lg"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imageRef}
          src={imageSrc}
          alt="Image to crop"
          onLoad={handleImageLoad}
          className="max-w-full max-h-[60vh] block"
          draggable={false}
        />

        {imageLoaded && (
          <>
            {/* Dark overlay outside crop area */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `linear-gradient(to right,
                  rgba(0,0,0,0.6) ${crop.x}px,
                  transparent ${crop.x}px,
                  transparent ${crop.x + crop.width}px,
                  rgba(0,0,0,0.6) ${crop.x + crop.width}px)`,
              }}
            />
            <div
              className="absolute pointer-events-none"
              style={{
                left: crop.x,
                top: 0,
                width: crop.width,
                height: crop.y,
                background: "rgba(0,0,0,0.6)",
              }}
            />
            <div
              className="absolute pointer-events-none"
              style={{
                left: crop.x,
                top: crop.y + crop.height,
                width: crop.width,
                height: displayedSize.height - crop.y - crop.height,
                background: "rgba(0,0,0,0.6)",
              }}
            />

            {/* Crop selection area */}
            <div
              className={clsx(
                "absolute border-2 border-white cursor-move",
                isDragging && "border-primary-400"
              )}
              style={{
                left: crop.x,
                top: crop.y,
                width: crop.width,
                height: crop.height,
              }}
              onMouseDown={(e) => handleMouseDown(e)}
            >
              {/* Grid lines */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/3 left-0 right-0 border-t border-white/40" />
                <div className="absolute top-2/3 left-0 right-0 border-t border-white/40" />
                <div className="absolute left-1/3 top-0 bottom-0 border-l border-white/40" />
                <div className="absolute left-2/3 top-0 bottom-0 border-l border-white/40" />
              </div>

              {/* Resize handles */}
              {Object.entries(handleStyles).map(([handle, style]) => (
                <div
                  key={handle}
                  className="absolute w-3 h-3 bg-white border border-gray-400 rounded-sm"
                  style={style}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    handleMouseDown(e, handle);
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Crop dimensions display */}
      {imageLoaded && imageRef.current && (
        <div className="text-sm text-gray-600">
          Crop size: {Math.round(crop.width * (imageRef.current.naturalWidth / displayedSize.width))} x{" "}
          {Math.round(crop.height * (imageRef.current.naturalHeight / displayedSize.height))} px
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-4">
        <Button onClick={onCancel} variant="secondary">
          Cancel
        </Button>
        <Button onClick={performCrop} variant="primary">
          Crop Image
        </Button>
      </div>
    </div>
  );
}
