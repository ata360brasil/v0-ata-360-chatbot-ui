"use client";

import { cn } from "@/lib/utils";

interface ATA360IconProps {
  className?: string;
  color?: "adaptive" | "color";
}

/**
 * ATA360 brand icon — uses the ORIGINAL brand PNG images.
 *
 * "adaptive" (default): black PNG in light mode, white PNG in dark mode.
 * "color": blue/gradient PNG (official brand colors).
 */
export function ATA360Icon({ className, color = "adaptive" }: ATA360IconProps) {
  if (color === "color") {
    return (
      <img
        src="/images/logotipo-ata360-azul.png"
        alt=""
        aria-hidden="true"
        className={cn("size-6 shrink-0 object-contain", className)}
      />
    );
  }

  // Adaptive: shows black PNG in light mode, white PNG in dark mode
  return (
    <span className={cn("inline-flex shrink-0", className)} aria-hidden="true">
      <img
        src="/images/logotipo-ata360-preto.png"
        alt=""
        className="size-full object-contain dark:hidden"
      />
      <img
        src="/images/logotipo-ata360-branco.png"
        alt=""
        className="hidden size-full object-contain dark:block"
      />
    </span>
  );
}
