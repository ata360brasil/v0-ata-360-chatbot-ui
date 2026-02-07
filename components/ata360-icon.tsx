"use client";

import { cn } from "@/lib/utils";

interface ATA360IconProps {
  className?: string;
  color?: "adaptive" | "color";
}

/**
 * ATA360 brand icon — inline SVG based on the official logotipo.
 * "adaptive" (default): uses currentColor so it follows text color (black in light, white in dark).
 * "color": blue gradient version matching brand colors.
 */
export function ATA360Icon({ className, color = "adaptive" }: ATA360IconProps) {
  if (color === "color") {
    // Blue gradient version — uses inline SVG to match brand colors
    return (
      <svg
        viewBox="0 0 470 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("size-5 shrink-0", className)}
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
        <path
          d="M20 30 C20 10 35 0 55 15 L220 155 C240 170 240 250 220 265 L55 405 C35 420 20 410 20 390 Z"
          fill="url(#ata360-grad-left)"
          opacity="0.85"
        />
        <path
          d="M190 30 C190 10 205 0 225 15 L390 155 C410 170 410 250 390 265 L225 405 C205 420 190 410 190 390 Z"
          fill="url(#ata360-grad-right)"
          opacity="0.78"
        />
      </svg>
    );
  }

  // Adaptive: uses currentColor — automatically black in light mode, white in dark mode
  return (
    <svg
      viewBox="0 0 470 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-5 shrink-0", className)}
      aria-hidden="true"
    >
      <path
        d="M20 30 C20 10 35 0 55 15 L220 155 C240 170 240 250 220 265 L55 405 C35 420 20 410 20 390 Z"
        fill="currentColor"
        opacity="0.85"
      />
      <path
        d="M190 30 C190 10 205 0 225 15 L390 155 C410 170 410 250 390 265 L225 405 C205 420 190 410 190 390 Z"
        fill="currentColor"
        opacity="0.7"
      />
    </svg>
  );
}
