"use client";

import { cn } from "@/lib/utils";

interface ATA360IconProps {
  className?: string;
  color?: "black" | "color" | "white";
}

/**
 * ATA360 brand icon — two overlapping play-style triangles
 * with rounded corners, matching the official logotipo.
 *
 * - color="color"  → blue gradient (brand colors)
 * - color="black"  → uses currentColor (inherits text color, adapts to dark mode)
 * - color="white"  → always white
 */
export function ATA360Icon({ className, color = "black" }: ATA360IconProps) {
  const fillLeft =
    color === "color"
      ? "url(#ata360-grad-left)"
      : color === "white"
        ? "white"
        : "currentColor";

  const fillRight =
    color === "color"
      ? "url(#ata360-grad-right)"
      : color === "white"
        ? "white"
        : "currentColor";

  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-6 w-6 shrink-0", className)}
      aria-hidden="true"
    >
      {color === "color" && (
        <defs>
          <linearGradient id="ata360-grad-left" x1="0" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="#4A5DB5" />
            <stop offset="100%" stopColor="#3B7DD8" />
          </linearGradient>
          <linearGradient id="ata360-grad-right" x1="0.5" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3B7DD8" />
            <stop offset="100%" stopColor="#2196F3" />
          </linearGradient>
        </defs>
      )}
      {/* Upper-left triangle */}
      <path
        d="M8 12 C8 7 11 5 15 8 L48 38 C52 41 52 53 48 56 L15 86 C11 89 8 87 8 82 Z"
        fill={fillLeft}
        opacity="0.92"
      />
      {/* Lower-right triangle (overlapping) */}
      <path
        d="M42 12 C42 7 45 5 49 8 L82 38 C86 41 86 53 82 56 L49 86 C45 89 42 87 42 82 Z"
        fill={fillRight}
        opacity="0.78"
      />
    </svg>
  );
}
