"use client";

import { cn } from "@/lib/utils";

interface ATA360IconProps {
  className?: string;
  color?: "adaptive" | "color";
}

/**
 * ATA360 brand icon — 3 triangles from the official logotipo SVG.
 * Geometry extracted from the official "logo ata360.svg" brand file.
 *
 * "adaptive" (default): uses currentColor — auto black in light, white in dark.
 * "color": blue gradient (#2d388a → #00aeef) matching brand identity.
 */
export function ATA360Icon({ className, color = "adaptive" }: ATA360IconProps) {
  if (color === "color") {
    return (
      <svg
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("size-6 shrink-0", className)}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="ata-g1" gradientUnits="userSpaceOnUse" x1="0" y1="50" x2="400" y2="462">
            <stop offset="0%" stopColor="#2d388a" />
            <stop offset="100%" stopColor="#00aeef" />
          </linearGradient>
          <linearGradient id="ata-g2" gradientUnits="userSpaceOnUse" x1="80" y1="0" x2="460" y2="400">
            <stop offset="0%" stopColor="#2d388a" />
            <stop offset="100%" stopColor="#00aeef" />
          </linearGradient>
        </defs>
        <path
          d="M56 135 v169 c0 12.1 12.8 19.7 23.5 14.2 l147.3-77.6 c11-5.8 11.5-21.3 1-27.8 L80.5 121.4 C69.7 114.8 56 122.5 56 135z"
          fill="url(#ata-g1)" opacity="0.83"
        />
        <path
          d="M172 80 v189.2 c0 13.5 14.3 22.1 26.3 15.9 l164.9-86.9 c12.3-6.5 12.9-23.8 1.1-31.1 L199.4 64.8 C187.4 57.4 172 66 172 80z"
          fill="url(#ata-g2)" opacity="0.83"
        />
        <path
          d="M172 243 v189.2 c0 13.5 14.3 22.1 26.3 15.9 l164.9-86.9 c12.3-6.5 12.9-23.8 1.1-31.1 L199.4 228 C187.4 220.6 172 229.2 172 243z"
          fill="url(#ata-g2)" opacity="0.83"
        />
      </svg>
    );
  }

  // Adaptive: uses currentColor — automatically black in light mode, white in dark mode
  return (
    <svg
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-6 shrink-0", className)}
      aria-hidden="true"
    >
      <path
        d="M56 135 v169 c0 12.1 12.8 19.7 23.5 14.2 l147.3-77.6 c11-5.8 11.5-21.3 1-27.8 L80.5 121.4 C69.7 114.8 56 122.5 56 135z"
        fill="currentColor" opacity="0.83"
      />
      <path
        d="M172 80 v189.2 c0 13.5 14.3 22.1 26.3 15.9 l164.9-86.9 c12.3-6.5 12.9-23.8 1.1-31.1 L199.4 64.8 C187.4 57.4 172 66 172 80z"
        fill="currentColor" opacity="0.83"
      />
      <path
        d="M172 243 v189.2 c0 13.5 14.3 22.1 26.3 15.9 l164.9-86.9 c12.3-6.5 12.9-23.8 1.1-31.1 L199.4 228 C187.4 220.6 172 229.2 172 243z"
        fill="currentColor" opacity="0.7"
      />
    </svg>
  );
}
