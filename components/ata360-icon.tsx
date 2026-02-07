"use client";

import { cn } from "@/lib/utils";

interface ATA360IconProps {
  className?: string;
  color?: "black" | "color";
}

export function ATA360Icon({ className, color = "black" }: ATA360IconProps) {
  return (
    <img
      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logotipo%20ata360%20preto-knKU4drEenKN5yBC3V1nXRNihgek8Y.png"
      alt="ATA360"
      className={cn("h-6 w-6 object-contain", className)}
    />
  );
}
