import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Histórico",
  description: "Histórico de conversas e pesquisas realizadas no assistente IA.",
}

export default function HistoryLayout({ children }: { children: React.ReactNode }) {
  return children
}
