import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contratos",
  description: "Gestão de contratos e atas de registro de preços conforme Lei 14.133/2021.",
}

export default function ContractsLayout({ children }: { children: React.ReactNode }) {
  return children
}
