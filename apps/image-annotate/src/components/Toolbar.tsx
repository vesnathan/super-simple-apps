"use client";

import { ToolType } from "@/hooks/useAnnotation";
import clsx from "clsx";
import { Button } from "@super-simple-apps/shared-assets";

interface ToolbarProps {
  tool: ToolType;
  color: string;
  strokeWidth: number;
  colors: string[];
  canUndo: boolean;
  canRedo: boolean;
  onToolChange: (tool: ToolType) => void;
  onColorChange: (color: string) => void;
  onStrokeWidthChange: (width: number) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onDone: () => void;
  onCancel: () => void;
}

const tools: { type: ToolType; icon: JSX.Element; label: string }[] = [
  {
    type: "draw",
    label: "Draw",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ),
  },
  {
    type: "highlight",
    label: "Highlight",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    type: "line",
    label: "Line",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 20L20 4" />
      </svg>
    ),
  },
  {
    type: "arrow",
    label: "Arrow",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
      </svg>
    ),
  },
  {
    type: "rectangle",
    label: "Rectangle",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 18h16M4 6v12M20 6v12" />
      </svg>
    ),
  },
  {
    type: "text",
    label: "Text",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
  },
  {
    type: "blur",
    label: "Blur",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
      </svg>
    ),
  },
];

export function Toolbar({
  tool,
  color,
  strokeWidth,
  colors,
  canUndo,
  canRedo,
  onToolChange,
  onColorChange,
  onStrokeWidthChange,
  onUndo,
  onRedo,
  onClear,
  onDone,
  onCancel,
}: ToolbarProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-3 space-y-3">
      {/* Tools */}
      <div className="flex flex-wrap gap-1 justify-center">
        {tools.map((t) => (
          <Button
            key={t.type}
            onClick={() => onToolChange(t.type)}
            title={t.label}
            variant="ghost"
            size="icon"
            className={clsx(
              tool === t.type
                ? "bg-primary-100 text-primary-700"
                : "text-gray-600"
            )}
          >
            {t.icon}
          </Button>
        ))}
      </div>

      {/* Colors */}
      <div className="flex flex-wrap gap-1 justify-center">
        {colors.map((c) => (
          <Button
            key={c}
            onClick={() => onColorChange(c)}
            variant="ghost"
            size="icon"
            className={clsx(
              "w-6 h-6 rounded-full transition-transform border-2 p-0",
              color === c ? "scale-125 border-gray-800" : "border-transparent hover:scale-110"
            )}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>

      {/* Stroke Width */}
      <div className="flex items-center gap-2 justify-center">
        <span className="text-xs text-gray-500">Size:</span>
        <input
          type="range"
          min="1"
          max="20"
          value={strokeWidth}
          onChange={(e) => onStrokeWidthChange(parseInt(e.target.value))}
          className="w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
        />
        <span className="text-xs text-gray-600 w-6">{strokeWidth}px</span>
      </div>

      {/* Undo/Redo/Clear */}
      <div className="flex gap-1 justify-center border-t pt-3">
        <Button
          onClick={onUndo}
          disabled={!canUndo}
          variant="ghost"
          size="icon"
          title="Undo"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
        </Button>
        <Button
          onClick={onRedo}
          disabled={!canRedo}
          variant="ghost"
          size="icon"
          title="Redo"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
          </svg>
        </Button>
        <Button
          onClick={onClear}
          variant="ghost"
          size="icon"
          title="Clear All"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </Button>
      </div>

      {/* Done/Cancel */}
      <div className="flex gap-2 justify-center border-t pt-3">
        <Button onClick={onCancel} variant="secondary" size="sm">
          Cancel
        </Button>
        <Button onClick={onDone} variant="primary" size="sm">
          Done
        </Button>
      </div>
    </div>
  );
}
