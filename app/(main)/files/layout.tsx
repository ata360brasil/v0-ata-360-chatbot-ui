import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Documentos",
  description: "Biblioteca de documentos, minutas e modelos de contratação pública.",
}

export default function FilesLayout({ children }: { children: React.ReactNode }) {
  return children
}
