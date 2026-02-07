import type { Metadata } from "next"
import { BreadcrumbJsonLd } from "@/components/structured-data"

export const metadata: Metadata = {
  title: "Assistentes",
  description: "Assistentes IA especializados em diferentes áreas de contratação pública.",
}

export default function AssistantsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'ATA360', href: '/' },
        { name: 'Assistentes', href: '/assistants' },
      ]} />
      {children}
    </>
  )
}
