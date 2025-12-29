"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { Annotation, Point, ToolType } from "@/hooks/useAnnotation";

interface AnnotationCanvasProps {
  imageSrc: string;
  tool: ToolType;
  annotations: Annotation[];
  currentAnnotation: Annotation | null;
  onStartAnnotation: (point: Point) => void;
  onUpdateAnnotation: (point: Point) => void;
  onFinishAnnotation: () => void;
  onAddText: (text: string, position: Point) => void;
  onExport: (dataUrl: string) => void;
  exportTrigger: number;
}

export function AnnotationCanvas({
  imageSrc,
  tool,
  annotations,
  currentAnnotation,
  onStartAnnotation,
  onUpdateAnnotation,
  onFinishAnnotation,
  onAddText,
  onExport,
  exportTrigger,
}: AnnotationCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [textInput, setTextInput] = useState<{ position: Point; value: string } | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [scale, setScale] = useState(1);

  // Load image and set up canvas
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      imageRef.current = img;

      const container = containerRef.current;
      if (!container) return;

      const maxWidth = container.clientWidth;
      const maxHeight = window.innerHeight * 0.6;

      let width = img.width;
      let height = img.height;
      let newScale = 1;

      // Scale down if too large
      if (width > maxWidth) {
        newScale = maxWidth / width;
        width = maxWidth;
        height = img.height * newScale;
      }
      if (height > maxHeight) {
        const heightScale = maxHeight / height;
        newScale *= heightScale;
        height = maxHeight;
        width *= heightScale;
      }

      setDimensions({ width, height });
      setScale(newScale);
    };
    img.src = imageSrc;
  }, [imageSrc]);

  // Draw everything
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const img = imageRef.current;

    if (!canvas || !ctx || !img || dimensions.width === 0) return;

    // Clear and draw image
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, dimensions.width, dimensions.height);

    // Draw all annotations
    const allAnnotations = currentAnnotation
      ? [...annotations, currentAnnotation]
      : annotations;

    for (const annotation of allAnnotations) {
      drawAnnotation(ctx, annotation);
    }
  }, [annotations, currentAnnotation, dimensions]);

  // Export handler
  useEffect(() => {
    if (exportTrigger === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const img = imageRef.current;

    if (!canvas || !ctx || !img) return;

    // Create full-resolution canvas for export
    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = img.width;
    exportCanvas.height = img.height;
    const exportCtx = exportCanvas.getContext("2d");

    if (!exportCtx) return;

    // Draw image at full resolution
    exportCtx.drawImage(img, 0, 0);

    // Scale factor for annotations
    const exportScale = img.width / dimensions.width;

    // Draw annotations at full resolution
    for (const annotation of annotations) {
      drawAnnotation(exportCtx, annotation, exportScale);
    }

    onExport(exportCanvas.toDataURL("image/png"));
  }, [exportTrigger, annotations, dimensions, onExport]);

  const drawAnnotation = (ctx: CanvasRenderingContext2D, annotation: Annotation, scaleFactor = 1) => {
    ctx.save();
    ctx.globalAlpha = annotation.opacity || 1;
    ctx.strokeStyle = annotation.color;
    ctx.fillStyle = annotation.color;
    ctx.lineWidth = annotation.strokeWidth * scaleFactor;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    switch (annotation.type) {
      case "draw":
      case "highlight":
        if (annotation.points && annotation.points.length > 0) {
          if (annotation.type === "highlight") {
            ctx.lineWidth = annotation.strokeWidth * 3 * scaleFactor;
          }
          ctx.beginPath();
          ctx.moveTo(annotation.points[0].x * scaleFactor, annotation.points[0].y * scaleFactor);
          for (let i = 1; i < annotation.points.length; i++) {
            ctx.lineTo(annotation.points[i].x * scaleFactor, annotation.points[i].y * scaleFactor);
          }
          ctx.stroke();
        }
        break;

      case "line":
        if (annotation.start && annotation.end) {
          ctx.beginPath();
          ctx.moveTo(annotation.start.x * scaleFactor, annotation.start.y * scaleFactor);
          ctx.lineTo(annotation.end.x * scaleFactor, annotation.end.y * scaleFactor);
          ctx.stroke();
        }
        break;

      case "arrow":
        if (annotation.start && annotation.end) {
          const headLen = 15 * scaleFactor;
          const dx = annotation.end.x - annotation.start.x;
          const dy = annotation.end.y - annotation.start.y;
          const angle = Math.atan2(dy, dx);

          ctx.beginPath();
          ctx.moveTo(annotation.start.x * scaleFactor, annotation.start.y * scaleFactor);
          ctx.lineTo(annotation.end.x * scaleFactor, annotation.end.y * scaleFactor);
          ctx.stroke();

          // Arrow head
          ctx.beginPath();
          ctx.moveTo(annotation.end.x * scaleFactor, annotation.end.y * scaleFactor);
          ctx.lineTo(
            annotation.end.x * scaleFactor - headLen * Math.cos(angle - Math.PI / 6),
            annotation.end.y * scaleFactor - headLen * Math.sin(angle - Math.PI / 6)
          );
          ctx.moveTo(annotation.end.x * scaleFactor, annotation.end.y * scaleFactor);
          ctx.lineTo(
            annotation.end.x * scaleFactor - headLen * Math.cos(angle + Math.PI / 6),
            annotation.end.y * scaleFactor - headLen * Math.sin(angle + Math.PI / 6)
          );
          ctx.stroke();
        }
        break;

      case "rectangle":
        if (annotation.start && annotation.end) {
          const x = Math.min(annotation.start.x, annotation.end.x) * scaleFactor;
          const y = Math.min(annotation.start.y, annotation.end.y) * scaleFactor;
          const w = Math.abs(annotation.end.x - annotation.start.x) * scaleFactor;
          const h = Math.abs(annotation.end.y - annotation.start.y) * scaleFactor;
          ctx.strokeRect(x, y, w, h);
        }
        break;

      case "text":
        if (annotation.start && annotation.text) {
          ctx.font = `${(annotation.fontSize || 24) * scaleFactor}px sans-serif`;
          ctx.fillText(annotation.text, annotation.start.x * scaleFactor, annotation.start.y * scaleFactor);
        }
        break;

      case "blur":
        if (annotation.start && annotation.end) {
          const x = Math.min(annotation.start.x, annotation.end.x) * scaleFactor;
          const y = Math.min(annotation.start.y, annotation.end.y) * scaleFactor;
          const w = Math.abs(annotation.end.x - annotation.start.x) * scaleFactor;
          const h = Math.abs(annotation.end.y - annotation.start.y) * scaleFactor;

          if (w > 0 && h > 0) {
            // Pixelate effect (simple blur simulation)
            const pixelSize = 10 * scaleFactor;
            const imageData = ctx.getImageData(x, y, w, h);
            const data = imageData.data;

            for (let py = 0; py < h; py += pixelSize) {
              for (let px = 0; px < w; px += pixelSize) {
                const i = (Math.floor(py) * w + Math.floor(px)) * 4;
                const r = data[i] || 128;
                const g = data[i + 1] || 128;
                const b = data[i + 2] || 128;

                ctx.fillStyle = `rgb(${r},${g},${b})`;
                ctx.fillRect(x + px, y + py, pixelSize, pixelSize);
              }
            }
          }
        }
        break;
    }

    ctx.restore();
  };

  const getCanvasPoint = useCallback((e: React.MouseEvent | React.TouchEvent): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    let clientX: number, clientY: number;

    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      const point = getCanvasPoint(e);

      if (tool === "text") {
        setTextInput({ position: point, value: "" });
      } else {
        setIsDrawing(true);
        onStartAnnotation(point);
      }
    },
    [tool, getCanvasPoint, onStartAnnotation]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDrawing) return;
      e.preventDefault();
      const point = getCanvasPoint(e);
      onUpdateAnnotation(point);
    },
    [isDrawing, getCanvasPoint, onUpdateAnnotation]
  );

  const handleMouseUp = useCallback(() => {
    if (isDrawing) {
      setIsDrawing(false);
      onFinishAnnotation();
    }
  }, [isDrawing, onFinishAnnotation]);

  const handleTextSubmit = useCallback(() => {
    if (textInput && textInput.value.trim()) {
      onAddText(textInput.value.trim(), textInput.position);
    }
    setTextInput(null);
  }, [textInput, onAddText]);

  return (
    <div ref={containerRef} className="relative w-full flex justify-center">
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="cursor-crosshair touch-none rounded-lg shadow-md"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
      />

      {/* Text input overlay */}
      {textInput && (
        <div
          className="absolute"
          style={{
            left: textInput.position.x,
            top: textInput.position.y,
          }}
        >
          <input
            type="text"
            value={textInput.value}
            onChange={(e) => setTextInput({ ...textInput, value: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleTextSubmit();
              if (e.key === "Escape") setTextInput(null);
            }}
            onBlur={handleTextSubmit}
            autoFocus
            className="px-2 py-1 border-2 border-primary-500 rounded outline-none text-sm min-w-[100px]"
            placeholder="Type text..."
          />
        </div>
      )}
    </div>
  );
}
