import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Equipe",
  description: "Gestão de membros da equipe e permissões de acesso.",
}

export default function TeamLayout({ children }: { children: React.ReactNode }) {
  return children
}
