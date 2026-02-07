"use client";

import { cn } from "@/lib/utils";

interface ATA360IconProps {
  className?: string;
  color?: "black" | "color" | "white";
}

/**
 * ATA360 brand icon — two overlapping play triangles.
 * Renders as inline SVG so it responds to theme changes instantly.
 *
 * - color="color"  → blue gradient (brand colors)
 * - color="black"  → uses currentColor (inherits text color, auto-adapts to dark mode)
 * - color="white"  → always white
 */
export function ATA360Icon({ className, color = "black" }: ATA360IconProps) {
  if (color === "color") {
    return (
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("h-6 w-6 shrink-0", className)}
        aria-hidden="true"
      >
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
        {/* Left triangle (pointing right) */}
        <path
          d="M10 18 C10 14 12 12 16 14 L60 54 C64 57 64 63 60 66 L16 106 C12 108 10 106 10 102 Z"
          fill="url(#ata360-grad-left)"
          opacity="0.92"
        />
        {/* Right triangle (pointing right, overlapping) */}
        <path
          d="M50 18 C50 14 52 12 56 14 L100 54 C104 57 104 63 100 66 L56 106 C52 108 50 106 50 102 Z"
          fill="url(#ata360-grad-right)"
          opacity="0.85"
        />
      </svg>
    );
  }

  // "black" — uses currentColor so it auto-inverts in dark mode
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-6 w-6 shrink-0", className)}
      aria-hidden="true"
    >
      {/* Left triangle */}
      <path
        d="M10 18 C10 14 12 12 16 14 L60 54 C64 57 64 63 60 66 L16 106 C12 108 10 106 10 102 Z"
        fill="currentColor"
        opacity="0.9"
      />
      {/* Right triangle (overlapping) */}
      <path
        d="M50 18 C50 14 52 12 56 14 L100 54 C104 57 104 63 100 66 L56 106 C52 108 50 106 50 102 Z"
        fill="currentColor"
        opacity="0.7"
      />
    </svg>
  );
}
