import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Painel administrativo com métricas, consumo e gestão de organizações.",
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children
}
