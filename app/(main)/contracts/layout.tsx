import type { Metadata } from "next"
import { BreadcrumbJsonLd } from "@/components/structured-data"

export const metadata: Metadata = {
  title: "Contratos",
  description: "Gestão de contratos e atas de registro de preços conforme Lei 14.133/2021.",
}

export default function ContractsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'ATA360', href: '/' },
        { name: 'Contratos', href: '/contracts' },
      ]} />
      {children}
    </>
  )
}
