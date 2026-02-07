import type { Metadata } from "next"
import { BreadcrumbJsonLd } from "@/components/structured-data"

export const metadata: Metadata = {
  title: "Histórico",
  description: "Histórico de conversas e pesquisas realizadas no assistente IA.",
}

export default function HistoryLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'ATA360', href: '/' },
        { name: 'Histórico', href: '/history' },
      ]} />
      {children}
    </>
  )
}
