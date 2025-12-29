import { useState, useCallback, useRef } from "react";

export type ToolType = "select" | "draw" | "line" | "arrow" | "rectangle" | "text" | "highlight" | "blur";

export interface Point {
  x: number;
  y: number;
}

export interface Annotation {
  id: string;
  type: ToolType;
  color: string;
  strokeWidth: number;
  points?: Point[];
  start?: Point;
  end?: Point;
  text?: string;
  fontSize?: number;
  rotation?: number;
  opacity?: number;
}

export interface AnnotationState {
  tool: ToolType;
  color: string;
  strokeWidth: number;
  fontSize: number;
  annotations: Annotation[];
  currentAnnotation: Annotation | null;
  undoStack: Annotation[][];
  redoStack: Annotation[][];
}

const COLORS = [
  "#ef4444", // red
  "#f97316", // orange
  "#eab308", // yellow
  "#22c55e", // green
  "#3b82f6", // blue
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#000000", // black
  "#ffffff", // white
];

export function useAnnotation() {
  const [state, setState] = useState<AnnotationState>({
    tool: "draw",
    color: "#ef4444",
    strokeWidth: 3,
    fontSize: 24,
    annotations: [],
    currentAnnotation: null,
    undoStack: [],
    redoStack: [],
  });

  const generateId = useCallback(() => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const setTool = useCallback((tool: ToolType) => {
    setState((prev) => ({ ...prev, tool }));
  }, []);

  const setColor = useCallback((color: string) => {
    setState((prev) => ({ ...prev, color }));
  }, []);

  const setStrokeWidth = useCallback((strokeWidth: number) => {
    setState((prev) => ({ ...prev, strokeWidth }));
  }, []);

  const setFontSize = useCallback((fontSize: number) => {
    setState((prev) => ({ ...prev, fontSize }));
  }, []);

  const startAnnotation = useCallback((point: Point) => {
    const { tool, color, strokeWidth, fontSize } = state;

    const newAnnotation: Annotation = {
      id: generateId(),
      type: tool,
      color,
      strokeWidth,
      opacity: tool === "highlight" ? 0.4 : 1,
    };

    if (tool === "draw" || tool === "highlight") {
      newAnnotation.points = [point];
    } else if (tool === "line" || tool === "arrow" || tool === "rectangle") {
      newAnnotation.start = point;
      newAnnotation.end = point;
      newAnnotation.rotation = 0;
    } else if (tool === "text") {
      newAnnotation.start = point;
      newAnnotation.text = "";
      newAnnotation.fontSize = fontSize;
    } else if (tool === "blur") {
      newAnnotation.start = point;
      newAnnotation.end = point;
    }

    setState((prev) => ({
      ...prev,
      currentAnnotation: newAnnotation,
    }));
  }, [state, generateId]);

  const updateAnnotation = useCallback((point: Point) => {
    setState((prev) => {
      if (!prev.currentAnnotation) return prev;

      const updated = { ...prev.currentAnnotation };

      if (updated.type === "draw" || updated.type === "highlight") {
        updated.points = [...(updated.points || []), point];
      } else if (
        updated.type === "line" ||
        updated.type === "arrow" ||
        updated.type === "rectangle" ||
        updated.type === "blur"
      ) {
        updated.end = point;
      }

      return { ...prev, currentAnnotation: updated };
    });
  }, []);

  const finishAnnotation = useCallback(() => {
    setState((prev) => {
      if (!prev.currentAnnotation) return prev;

      // For text, we'll handle this differently (need input)
      if (prev.currentAnnotation.type === "text" && !prev.currentAnnotation.text) {
        return prev;
      }

      const newAnnotations = [...prev.annotations, prev.currentAnnotation];

      return {
        ...prev,
        annotations: newAnnotations,
        currentAnnotation: null,
        undoStack: [...prev.undoStack, prev.annotations],
        redoStack: [],
      };
    });
  }, []);

  const addTextAnnotation = useCallback((text: string, position: Point) => {
    const { color, fontSize } = state;

    const newAnnotation: Annotation = {
      id: generateId(),
      type: "text",
      color,
      strokeWidth: 1,
      start: position,
      text,
      fontSize,
      opacity: 1,
    };

    setState((prev) => ({
      ...prev,
      annotations: [...prev.annotations, newAnnotation],
      undoStack: [...prev.undoStack, prev.annotations],
      redoStack: [],
      currentAnnotation: null,
    }));
  }, [state, generateId]);

  const undo = useCallback(() => {
    setState((prev) => {
      if (prev.undoStack.length === 0) return prev;

      const newUndoStack = [...prev.undoStack];
      const previousState = newUndoStack.pop()!;

      return {
        ...prev,
        annotations: previousState,
        undoStack: newUndoStack,
        redoStack: [...prev.redoStack, prev.annotations],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setState((prev) => {
      if (prev.redoStack.length === 0) return prev;

      const newRedoStack = [...prev.redoStack];
      const nextState = newRedoStack.pop()!;

      return {
        ...prev,
        annotations: nextState,
        undoStack: [...prev.undoStack, prev.annotations],
        redoStack: newRedoStack,
      };
    });
  }, []);

  const clearAll = useCallback(() => {
    setState((prev) => ({
      ...prev,
      annotations: [],
      undoStack: [...prev.undoStack, prev.annotations],
      redoStack: [],
      currentAnnotation: null,
    }));
  }, []);

  return {
    ...state,
    COLORS,
    setTool,
    setColor,
    setStrokeWidth,
    setFontSize,
    startAnnotation,
    updateAnnotation,
    finishAnnotation,
    addTextAnnotation,
    undo,
    redo,
    clearAll,
    canUndo: state.undoStack.length > 0,
    canRedo: state.redoStack.length > 0,
  };
}
