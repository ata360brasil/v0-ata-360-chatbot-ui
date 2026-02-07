import type { Metadata } from "next"
import { BreadcrumbJsonLd } from "@/components/structured-data"

export const metadata: Metadata = {
  title: "Equipe",
  description: "Gestão de membros da equipe e permissões de acesso.",
}

export default function TeamLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'ATA360', href: '/' },
        { name: 'Equipe', href: '/team' },
      ]} />
      {children}
    </>
  )
}
