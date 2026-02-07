"use client";

import { cn } from "@/lib/utils";

interface ATA360IconProps {
  className?: string;
  color?: "black" | "color" | "white";
}

/**
 * ATA360 brand icon — uses the official logotipo PNG.
 * Light mode: black version shown as-is.
 * Dark mode: same PNG with CSS brightness-0 invert to make it white.
 */
export function ATA360Icon({ className, color = "black" }: ATA360IconProps) {
  if (color === "color") {
    // Blue gradient version — uses inline SVG to match brand colors
    return (
      <svg
        viewBox="0 0 520 601"
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
        <path
          d="M40 60 C40 30 60 15 85 35 L250 195 C275 215 275 285 250 305 L85 465 C60 485 40 470 40 440 Z"
          fill="url(#ata360-grad-left)"
          opacity="0.85"
        />
        <path
          d="M220 60 C220 30 240 15 265 35 L430 195 C455 215 455 285 430 305 L265 465 C240 485 220 470 220 440 Z"
          fill="url(#ata360-grad-right)"
          opacity="0.78"
        />
      </svg>
    );
  }

  // Default: use the official PNG, with dark mode invert
  return (
    <>
      {/* Light mode: original black logotipo */}
      <img
        src="/logotipo-ata360-preto.png"
        alt="ATA360"
        className={cn("object-contain shrink-0 dark:hidden", className)}
      />
      {/* Dark mode: same PNG inverted to white */}
      <img
        src="/logotipo-ata360-preto.png"
        alt="ATA360"
        className={cn("object-contain shrink-0 hidden dark:block brightness-0 invert", className)}
      />
    </>
  );
}
