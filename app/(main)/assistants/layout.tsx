import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Assistentes",
  description: "Assistentes IA especializados em diferentes áreas de contratação pública.",
}

export default function AssistantsLayout({ children }: { children: React.ReactNode }) {
  return children
}
