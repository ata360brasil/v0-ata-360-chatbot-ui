"use client"

/**
 * InsightCards — cards dinâmicos do Insight Engine.
 *
 * Substitui suggestion cards estáticos por dados reais:
 * - Preços PNCP (média, mediana)
 * - ARPs vigentes com saldo
 * - Emendas/convênios elegíveis
 * - Jurisprudência TCU aplicável
 * - Alertas de conformidade
 *
 * @see Spec v8 Part 3.2 + Part 14 — Insight Engine
 */
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  DollarSign,
  FileText,
  AlertTriangle,
  Scale,
  TrendingUp,
} from "lucide-react"

export interface InsightCard {
  tipo: "preco" | "arp" | "emenda" | "jurisprudencia" | "alerta"
  titulo: string
  descricao: string
  fonte: string
  dados?: Record<string, unknown>
  relevancia: number
}

interface InsightCardsProps {
  cards: InsightCard[]
  onCardClick?: (card: InsightCard) => void
  className?: string
}

const TIPO_CONFIG = {
  preco: { icon: DollarSign, color: "text-success", badge: "PNCP" },
  arp: { icon: FileText, color: "text-info", badge: "ARP" },
  emenda: { icon: TrendingUp, color: "text-primary", badge: "Emenda" },
  jurisprudencia: { icon: Scale, color: "text-warning", badge: "TCU" },
  alerta: { icon: AlertTriangle, color: "text-destructive", badge: "Alerta" },
} as const

export function InsightCards({ cards, onCardClick, className }: InsightCardsProps) {
  if (cards.length === 0) return null

  // Ordena por relevância (maior primeiro)
  const sorted = [...cards].sort((a, b) => b.relevancia - a.relevancia)

  return (
    <div className={cn("grid gap-2", className)}>
      {sorted.map((card, index) => {
        const config = TIPO_CONFIG[card.tipo]
        const Icon = config.icon

        return (
          <button
            key={`${card.tipo}-${index}`}
            onClick={() => onCardClick?.(card)}
            className={cn(
              "flex items-start gap-3 p-3 rounded-lg border bg-card",
              "text-left transition-colors hover:bg-muted/50",
              "focus-visible:outline-2 focus-visible:outline-ring",
            )}
          >
            <div className={cn("mt-0.5 shrink-0", config.color)}>
              <Icon className="size-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm truncate">{card.titulo}</span>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 shrink-0">
                  {config.badge}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                {card.descricao}
              </p>
              <span className="text-[10px] text-muted-foreground/60 mt-1">
                Fonte: {card.fonte}
              </span>
            </div>
          </button>
        )
      })}
    </div>
  )
}
