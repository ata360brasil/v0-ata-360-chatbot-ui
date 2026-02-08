"use client"

/**
 * DecisionBar — barra de decisões do fluxo cíclico.
 *
 * Aparece no artifacts panel quando estado == AGUARDANDO_DECISAO.
 * 5 ações possíveis: APROVAR, EDITAR, NOVA SUGESTÃO, PROSSEGUIR, DESCARTAR.
 *
 * @see Spec v8 Part 20.3 passo 6 — Decisão Humana
 * @see Spec v8 Part 20.5 — Limites de iteração
 */
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { Check, Pencil, RefreshCw, AlertTriangle, Trash2 } from "lucide-react"
import { UserDecision } from "@/lib/schemas/process"

interface DecisionBarProps {
  onDecision: (acao: UserDecision) => void
  loading?: boolean
  sugestoesRestantes?: number
  reauditoriasRestantes?: number
  seloAprovado?: boolean
  className?: string
}

export function DecisionBar({
  onDecision,
  loading = false,
  sugestoesRestantes = 3,
  reauditoriasRestantes = 5,
  seloAprovado = true,
  className,
}: DecisionBarProps) {
  const [confirmDiscard, setConfirmDiscard] = useState(false)

  const actions = [
    {
      key: UserDecision.APROVAR,
      label: "Aprovar",
      icon: Check,
      variant: "default" as const,
      description: seloAprovado
        ? "Selo + Assinatura + Próximo documento"
        : "Documento será aprovado SEM selo de qualidade",
      disabled: false,
    },
    {
      key: UserDecision.EDITAR,
      label: "Editar",
      icon: Pencil,
      variant: "outline" as const,
      description: "Voltar para edição, reavaliação automática",
      disabled: reauditoriasRestantes <= 0,
      tooltip: reauditoriasRestantes <= 0 ? "Limite de reauditorias atingido" : undefined,
    },
    {
      key: UserDecision.NOVA_SUGESTAO,
      label: "Nova Sugestão",
      icon: RefreshCw,
      variant: "outline" as const,
      description: `IA gera nova versão (${sugestoesRestantes} restantes)`,
      disabled: sugestoesRestantes <= 0,
      tooltip: sugestoesRestantes <= 0 ? "Limite de sugestões atingido (3/seção)" : undefined,
    },
    {
      key: UserDecision.PROSSEGUIR,
      label: "Prosseguir",
      icon: AlertTriangle,
      variant: "outline" as const,
      description: "Aceita sem selo de qualidade",
      disabled: false,
      className: "text-warning hover:text-warning",
    },
    {
      key: UserDecision.DESCARTAR,
      label: "Descartar",
      icon: Trash2,
      variant: "ghost" as const,
      description: "Cancela este documento (irreversível)",
      disabled: false,
      className: "text-destructive hover:text-destructive",
    },
  ]

  function handleClick(acao: UserDecision) {
    if (acao === UserDecision.DESCARTAR) {
      setConfirmDiscard(true)
      return
    }
    onDecision(acao)
  }

  return (
    <>
      <div
        className={cn(
          "flex flex-wrap items-center gap-2 p-3 border-t bg-muted/30",
          className,
        )}
        role="toolbar"
        aria-label="Ações do documento"
      >
        {actions.map(({ key, label, icon: Icon, variant, disabled, tooltip, className: btnCn }) => {
          const btn = (
            <Button
              key={key}
              variant={variant}
              size="sm"
              onClick={() => handleClick(key)}
              disabled={loading || disabled}
              className={cn("gap-1.5", btnCn)}
              aria-label={label}
            >
              <Icon className="size-4" />
              <span className="hidden sm:inline">{label}</span>
            </Button>
          )

          if (tooltip) {
            return (
              <Tooltip key={key}>
                <TooltipTrigger asChild>{btn}</TooltipTrigger>
                <TooltipContent>{tooltip}</TooltipContent>
              </Tooltip>
            )
          }

          return btn
        })}
      </div>

      {/* Confirm discard dialog */}
      <AlertDialog open={confirmDiscard} onOpenChange={setConfirmDiscard}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Descartar documento?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O documento será removido permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onDecision(UserDecision.DESCARTAR)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sim, descartar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
