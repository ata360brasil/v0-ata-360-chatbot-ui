import type { Metadata } from "next"
import { BreadcrumbJsonLd } from "@/components/structured-data"

export const metadata: Metadata = {
  title: "Documentos",
  description: "Biblioteca de documentos, minutas e modelos de contratação pública.",
}

export default function FilesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'ATA360', href: '/' },
        { name: 'Documentos', href: '/files' },
      ]} />
      {children}
    </>
  )
}
