"use client"

/**
 * ProcessStepper — barra de progresso visual do estado do documento.
 *
 * Simplifica os 12+ estados da state machine (Part 20.4) em 7 passos
 * visuais que o servidor público entende.
 *
 * @see Spec v8 Part 20.4 — State Machine
 * @see shadcn/ui Radix primitives — composição acessível
 */
import { cn } from "@/lib/utils"
import { VisualStep, stateToVisualStep, type ProcessState } from "@/lib/schemas/process"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ProcessStepperProps {
  estado: ProcessState
  iteracao?: number
  className?: string
}

const STEPS = Object.entries(VisualStep) as [keyof typeof VisualStep, typeof VisualStep[keyof typeof VisualStep]][]

const STEP_INDICES = Object.fromEntries(
  STEPS.map(([key], index) => [key, index]),
) as Record<keyof typeof VisualStep, number>

export function ProcessStepper({ estado, iteracao = 1, className }: ProcessStepperProps) {
  const currentStep = stateToVisualStep(estado)
  const currentIndex = STEP_INDICES[currentStep]

  return (
    <div className={cn("flex items-center gap-1 px-4 py-2", className)} role="progressbar" aria-valuenow={currentIndex + 1} aria-valuemin={1} aria-valuemax={STEPS.length} aria-label={`Progresso: ${VisualStep[currentStep].label}`}>
      {STEPS.map(([key, step], index) => {
        const isComplete = index < currentIndex
        const isCurrent = index === currentIndex
        const isPending = index > currentIndex

        return (
          <div key={key} className="flex items-center flex-1 last:flex-none">
            {/* Step dot */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    "size-3 rounded-full shrink-0 transition-colors",
                    isComplete && "bg-success",
                    isCurrent && "bg-primary ring-2 ring-primary/30",
                    isPending && "bg-muted-foreground/20",
                  )}
                  aria-current={isCurrent ? "step" : undefined}
                />
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                <p className="font-medium">{step.label}</p>
                <p className="text-muted-foreground">{step.description}</p>
                {isCurrent && iteracao > 1 && (
                  <p className="text-warning mt-1">Iteração {iteracao}/5</p>
                )}
              </TooltipContent>
            </Tooltip>

            {/* Connector line */}
            {index < STEPS.length - 1 && (
              <div
                className={cn(
                  "h-0.5 flex-1 mx-1 transition-colors",
                  index < currentIndex ? "bg-success" : "bg-muted-foreground/20",
                )}
              />
            )}
          </div>
        )
      })}

      {/* Current step label (mobile-friendly) */}
      <span className="ml-3 text-xs text-muted-foreground hidden sm:inline">
        {VisualStep[currentStep].label}
        {iteracao > 1 && <span className="text-warning ml-1">(iter. {iteracao})</span>}
      </span>
    </div>
  )
}
