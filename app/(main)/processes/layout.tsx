import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Processos",
  description: "Acompanhamento de processos licitatórios e contratações diretas.",
}

export default function ProcessesLayout({ children }: { children: React.ReactNode }) {
  return children
}
