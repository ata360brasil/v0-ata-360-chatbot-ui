import type { Metadata } from "next"
import { BreadcrumbJsonLd } from "@/components/structured-data"

export const metadata: Metadata = {
  title: "Processos",
  description: "Acompanhamento de processos licitatórios e contratações diretas.",
}

export default function ProcessesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'ATA360', href: '/' },
        { name: 'Processos', href: '/processes' },
      ]} />
      {children}
    </>
  )
}
