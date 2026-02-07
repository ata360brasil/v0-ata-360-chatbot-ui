import React from "react"
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Entrar - ATA360",
  description: "Acesse sua conta ATA360 para gerenciar contratacoes publicas",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
