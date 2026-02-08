"use client"

/**
 * AuditorChecklist — resultado visual do AUDITOR Agent.
 *
 * Mostra tripartição (CONFORME / NÃO CONFORME / RESSALVAS),
 * score numérico, lista de verificações, e status do selo.
 *
 * SIGILO (Part 19): NÃO mostra pesos, fórmulas, nomes de agentes,
 * modelos IA, ou scores internos. Apenas O QUE + CONCLUSÃO.
 *
 * @see Spec v8 Part 20.13 — Resultado do AUDITOR
 * @see Spec v8 Part 19 — Segurança e Sigilo
 */
import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import { Check, X, AlertTriangle, ChevronDown, Shield } from "lucide-react"
import type { AuditorResult, AuditorVerdict } from "@/lib/schemas/process"

interface AuditorChecklistProps {
  resultado: AuditorResult
  className?: string
}

const VERDICT_CONFIG: Record<AuditorVerdict, { label: string; icon: typeof Check; color: string; bg: string }> = {
  CONFORME: {
    label: "Conforme",
    icon: Check,
    color: "text-success",
    bg: "bg-success/10",
  },
  NAO_CONFORME: {
    label: "Não Conforme",
    icon: X,
    color: "text-destructive",
    bg: "bg-destructive/10",
  },
  RESSALVAS: {
    label: "Ressalvas",
    icon: AlertTriangle,
    color: "text-warning",
    bg: "bg-warning/10",
  },
}

export function AuditorChecklist({ resultado, className }: AuditorChecklistProps) {
  const [open, setOpen] = useState(false)
  const config = VERDICT_CONFIG[resultado.veredicto]
  const Icon = config.icon
  const okCount = resultado.checklist.filter((c) => c.conforme).length
  const totalCount = resultado.checklist.length

  return (
    <Collapsible open={open} onOpenChange={setOpen} className={cn("border rounded-lg", className)}>
      <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-3 hover:bg-muted/50 transition-colors">
        <div className="flex items-center gap-3">
          <div className={cn("size-8 rounded-full flex items-center justify-center", config.bg)}>
            <Icon className={cn("size-4", config.color)} />
          </div>
          <div className="text-left">
            <span className={cn("font-medium text-sm", config.color)}>{config.label}</span>
            <span className="text-muted-foreground text-xs ml-2">
              {resultado.score}/100 — {okCount} de {totalCount} verificações ok
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {resultado.selo_aprovado && (
            <Badge variant="outline" className="text-success border-success/30 gap-1">
              <Shield className="size-3" />
              Selo
            </Badge>
          )}
          <ChevronDown className={cn("size-4 text-muted-foreground transition-transform", open && "rotate-180")} />
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="px-4 pb-3 space-y-2 border-t pt-3">
          {resultado.checklist.map((item) => (
            <div key={item.id} className="flex items-start gap-2 text-sm">
              {item.conforme ? (
                <Check className="size-4 text-success shrink-0 mt-0.5" />
              ) : (
                <X className="size-4 text-destructive shrink-0 mt-0.5" />
              )}
              <div>
                <span className={cn(!item.conforme && "text-destructive")}>{item.descricao}</span>
                {item.achado && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.achado}
                  </p>
                )}
                {item.fundamentacao && (
                  <p className="text-xs text-info mt-0.5 italic">
                    {item.fundamentacao}
                  </p>
                )}
              </div>
            </div>
          ))}

          <div className="pt-2 border-t text-xs text-muted-foreground">
            Iteração {resultado.iteracao} — {new Date(resultado.timestamp).toLocaleString("pt-BR")}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
