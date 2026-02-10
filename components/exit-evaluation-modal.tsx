/**
 * ExitEvaluationModal — Avaliação obrigatória ao sair do ATA360.
 *
 * Campos:
 * - NPS (0-10): "Recomendaria o ATA360?"
 * - Satisfação geral (1-5 estrelas)
 * - Categorias opcionais (facilidade, velocidade, precisão, documentos)
 * - Áreas de melhoria (multi-select chips)
 * - Comentário livre
 * - Sugestão
 *
 * Obrigatórios: NPS + nota_geral. Resto opcional para rapidez.
 *
 * @see Spec v8 Part 16 — Feedback contínuo
 */
'use client'

import { useState, useCallback } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Star, LogOut, MessageSquare, ThumbsUp } from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Types ─────────────────────────────────────────────────────────────────

interface ExitEvaluationModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: ExitEvaluationData) => Promise<void>
  /** Métricas da sessão (preenchidas automaticamente) */
  sessionMetrics?: {
    duracao_minutos: number
    documentos_gerados: number
    pesquisas_realizadas: number
  }
}

export interface ExitEvaluationData {
  nps_score: number
  nota_geral: number
  nota_facilidade?: number
  nota_velocidade?: number
  nota_precisao?: number
  nota_documentos?: number
  comentario?: string
  sugestao?: string
  areas_melhoria?: string[]
  duracao_sessao_minutos?: number
  documentos_gerados?: number
  pesquisas_realizadas?: number
}

// ─── Sub-components ────────────────────────────────────────────────────────

function NpsSelector({
  value,
  onChange,
}: {
  value: number
  onChange: (v: number) => void
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">
        De 0 a 10, quanto recomendaria o ATA360?
      </p>
      <div className="flex gap-1">
        {Array.from({ length: 11 }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onChange(i)}
            className={cn(
              'w-8 h-8 rounded-lg text-xs font-semibold transition-all',
              value === i
                ? i <= 6
                  ? 'bg-red-500 text-white'
                  : i <= 8
                    ? 'bg-amber-500 text-white'
                    : 'bg-green-500 text-white'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted',
            )}
          >
            {i}
          </button>
        ))}
      </div>
      <div className="flex justify-between text-[10px] text-muted-foreground px-1">
        <span>Nada provável</span>
        <span>Muito provável</span>
      </div>
    </div>
  )
}

function StarSelector({
  label,
  value,
  onChange,
  size = 20,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  size?: number
}) {
  const [hover, setHover] = useState(0)

  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onChange(i + 1)}
            onMouseEnter={() => setHover(i + 1)}
            onMouseLeave={() => setHover(0)}
            className="cursor-pointer transition-colors"
          >
            <Star
              size={size}
              className={cn(
                'transition-colors',
                (hover ? i < hover : i < value)
                  ? 'fill-foreground text-foreground'
                  : 'text-muted-foreground/30 hover:text-muted-foreground/50',
              )}
            />
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Areas de Melhoria ─────────────────────────────────────────────────────

const AREAS_MELHORIA = [
  { id: 'velocidade', label: 'Velocidade' },
  { id: 'precisao', label: 'Precisão' },
  { id: 'interface', label: 'Interface' },
  { id: 'documentos', label: 'Documentos' },
  { id: 'chat', label: 'Chat/Respostas' },
  { id: 'precos', label: 'Preços/Pesquisa' },
  { id: 'busca', label: 'Busca' },
  { id: 'exportacao', label: 'Exportação' },
  { id: 'navegacao', label: 'Navegação' },
]

// ─── Component ─────────────────────────────────────────────────────────────

export function ExitEvaluationModal({
  open,
  onClose,
  onSubmit,
  sessionMetrics,
}: ExitEvaluationModalProps) {
  const [step, setStep] = useState<'rating' | 'details' | 'done'>('rating')
  const [npsScore, setNpsScore] = useState(-1)
  const [notaGeral, setNotaGeral] = useState(0)
  const [notaFacilidade, setNotaFacilidade] = useState(0)
  const [notaVelocidade, setNotaVelocidade] = useState(0)
  const [notaPrecisao, setNotaPrecisao] = useState(0)
  const [notaDocumentos, setNotaDocumentos] = useState(0)
  const [comentario, setComentario] = useState('')
  const [sugestao, setSugestao] = useState('')
  const [areasMelhoria, setAreasMelhoria] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const toggleArea = (id: string) => {
    setAreasMelhoria((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id],
    )
  }

  const canSubmit = npsScore >= 0 && notaGeral > 0

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) return
    setLoading(true)

    const data: ExitEvaluationData = {
      nps_score: npsScore,
      nota_geral: notaGeral,
      ...(notaFacilidade > 0 && { nota_facilidade: notaFacilidade }),
      ...(notaVelocidade > 0 && { nota_velocidade: notaVelocidade }),
      ...(notaPrecisao > 0 && { nota_precisao: notaPrecisao }),
      ...(notaDocumentos > 0 && { nota_documentos: notaDocumentos }),
      ...(comentario.trim() && { comentario: comentario.trim() }),
      ...(sugestao.trim() && { sugestao: sugestao.trim() }),
      ...(areasMelhoria.length > 0 && { areas_melhoria: areasMelhoria }),
      ...(sessionMetrics && {
        duracao_sessao_minutos: sessionMetrics.duracao_minutos,
        documentos_gerados: sessionMetrics.documentos_gerados,
        pesquisas_realizadas: sessionMetrics.pesquisas_realizadas,
      }),
    }

    try {
      await onSubmit(data)
      setStep('done')
    } catch {
      // Erro silencioso — não bloquear saída
      setStep('done')
    } finally {
      setLoading(false)
    }
  }, [npsScore, notaGeral, notaFacilidade, notaVelocidade, notaPrecisao, notaDocumentos, comentario, sugestao, areasMelhoria, sessionMetrics, canSubmit, onSubmit])

  const handleClose = () => {
    if (step === 'done') {
      onClose()
      return
    }
    // Se não avaliou, permitir sair com warning
    if (!canSubmit) {
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        {/* Step 1: Rating principal */}
        {step === 'rating' && (
          <>
            <DialogHeader className="space-y-2">
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <MessageSquare size={16} />
                Sua opinião importa!
              </DialogTitle>
              <DialogDescription className="text-xs">
                Avalie rapidamente sua experiência para nos ajudar a melhorar.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5 mt-3">
              {/* NPS */}
              <NpsSelector value={npsScore} onChange={setNpsScore} />

              {/* Satisfação geral */}
              <StarSelector
                label="Satisfação geral com o ATA360"
                value={notaGeral}
                onChange={setNotaGeral}
                size={24}
              />

              {/* Categorias opcionais */}
              <div className="grid grid-cols-2 gap-3">
                <StarSelector label="Facilidade de uso" value={notaFacilidade} onChange={setNotaFacilidade} size={16} />
                <StarSelector label="Velocidade" value={notaVelocidade} onChange={setNotaVelocidade} size={16} />
                <StarSelector label="Precisão das respostas" value={notaPrecisao} onChange={setNotaPrecisao} size={16} />
                <StarSelector label="Qualidade dos documentos" value={notaDocumentos} onChange={setNotaDocumentos} size={16} />
              </div>
            </div>

            <DialogFooter className="gap-3 mt-4 sm:justify-between">
              <Button
                variant="ghost"
                onClick={() => { onClose() }}
                className="text-xs text-muted-foreground"
              >
                <LogOut size={14} className="mr-1" />
                Sair sem avaliar
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleSubmit}
                  disabled={!canSubmit || loading}
                  className="rounded-full text-xs h-9"
                >
                  Enviar e sair
                </Button>
                <Button
                  onClick={() => setStep('details')}
                  disabled={!canSubmit}
                  className="rounded-full bg-foreground text-background hover:bg-foreground/90 text-xs h-9"
                >
                  Detalhar mais
                </Button>
              </div>
            </DialogFooter>
          </>
        )}

        {/* Step 2: Detalhes opcionais */}
        {step === 'details' && (
          <>
            <DialogHeader className="space-y-1">
              <DialogTitle className="text-base font-bold">
                Detalhes adicionais
              </DialogTitle>
              <DialogDescription className="text-xs">
                Tudo aqui é opcional. Seu tempo é valioso.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-3">
              {/* Áreas de melhoria */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium">O que podemos melhorar?</label>
                <div className="flex flex-wrap gap-1.5">
                  {AREAS_MELHORIA.map((area) => (
                    <button
                      key={area.id}
                      type="button"
                      onClick={() => toggleArea(area.id)}
                      className={cn(
                        'px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors border',
                        areasMelhoria.includes(area.id)
                          ? 'bg-foreground text-background border-foreground'
                          : 'bg-muted/50 text-muted-foreground border-border/50 hover:bg-muted',
                      )}
                    >
                      {area.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Comentário */}
              <div className="space-y-1">
                <label className="text-xs font-medium">Comentário</label>
                <Textarea
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  placeholder="O que mais gostou? O que pode melhorar?"
                  className="min-h-[60px] text-xs rounded-xl"
                />
              </div>

              {/* Sugestão */}
              <div className="space-y-1">
                <label className="text-xs font-medium">Sugestão de funcionalidade</label>
                <Textarea
                  value={sugestao}
                  onChange={(e) => setSugestao(e.target.value)}
                  placeholder="Que funcionalidade gostaria de ver?"
                  className="min-h-[50px] text-xs rounded-xl"
                />
              </div>
            </div>

            <DialogFooter className="gap-3 mt-4 sm:justify-center">
              <Button
                variant="outline"
                onClick={() => setStep('rating')}
                className="rounded-full text-xs h-9 px-6"
              >
                Voltar
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="rounded-full bg-foreground text-background hover:bg-foreground/90 text-xs h-9 px-6"
              >
                {loading ? 'Enviando...' : 'Enviar avaliação'}
              </Button>
            </DialogFooter>
          </>
        )}

        {/* Step 3: Confirmação */}
        {step === 'done' && (
          <>
            <div className="flex flex-col items-center py-8 space-y-3">
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <ThumbsUp size={24} className="text-green-600 dark:text-green-400" />
              </div>
              <p className="text-sm font-semibold">Obrigado pela avaliação!</p>
              <p className="text-xs text-muted-foreground text-center max-w-[280px]">
                Seu feedback ajuda a melhorar o ATA360 para todos os servidores públicos.
              </p>
            </div>
            <DialogFooter className="sm:justify-center">
              <Button
                onClick={onClose}
                className="rounded-full bg-foreground text-background hover:bg-foreground/90 text-xs h-9 px-8"
              >
                <LogOut size={14} className="mr-1.5" />
                Sair do sistema
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
