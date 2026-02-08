"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface ATA360IconProps {
  className?: string;
  color?: "adaptive" | "color";
}

/**
 * ATA360 brand icon — uses the ORIGINAL brand PNG (logotipo preto).
 *
 * "adaptive" (default): black in light mode, inverted to white in dark mode via CSS.
 * "color": blue/gradient PNG (official brand colors).
 */
export function ATA360Icon({ className, color = "adaptive" }: ATA360IconProps) {
  if (color === "color") {
    return (
      <Image
        src="/images/logotipo-ata360-azul.png"
        alt=""
        aria-hidden="true"
        width={24}
        height={24}
        className={cn("size-6 shrink-0 object-contain", className)}
      />
    );
  }

  // Single black PNG — CSS invert in dark mode
  return (
    <Image
      src="/images/logotipo-ata360-preto.png"
      alt=""
      aria-hidden="true"
      width={24}
      height={24}
      className={cn("size-6 shrink-0 object-contain dark:invert", className)}
    />
  );
}
