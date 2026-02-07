"use client";

import React from "react"

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { GripVertical } from "lucide-react";

interface ResizableDividerProps {
  onResize: (delta: number) => void;
  onResizeEnd: () => void;
  isVisible: boolean;
}

export function ResizableDivider({ onResize, onResizeEnd, isVisible }: ResizableDividerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    startXRef.current = e.clientX;
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    const delta = e.clientX - startXRef.current;
    startXRef.current = e.clientX;
    onResize(delta);
  }, [isDragging, onResize]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      onResizeEnd();
    }
  }, [isDragging, onResizeEnd]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  if (!isVisible) return null;

  return (
    <div
      onMouseDown={handleMouseDown}
      className={cn(
        "w-1 bg-border/30 hover:bg-primary/50 cursor-col-resize flex items-center justify-center transition-colors shrink-0 relative group",
        isDragging && "bg-primary/50"
      )}
    >
      <div className={cn(
        "absolute inset-y-0 -left-1 -right-1 z-10",
        "flex items-center justify-center"
      )}>
        <div className={cn(
          "size-6 rounded-full bg-muted border border-border/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity",
          isDragging && "opacity-100"
        )}>
          <GripVertical className="size-3 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
}
