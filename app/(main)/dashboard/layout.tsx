import type { Metadata } from "next"
import { BreadcrumbJsonLd } from "@/components/structured-data"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Painel administrativo com métricas, consumo e gestão de organizações.",
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'ATA360', href: '/' },
        { name: 'Dashboard', href: '/dashboard' },
      ]} />
      {children}
    </>
  )
}
