/**
 * NormalizationFeedback — Widget inline para feedback de normalização.
 *
 * Mostra resultado da normalização com:
 * - Pipeline visual (cada camada aplicada)
 * - CATMAT sugeridos com assertividade
 * - Alertas (marcas, ambiguidades, regionalismos)
 * - Botões de feedback: 👍 Aprovar | ✏️ Corrigir | 👎 Rejeitar
 *
 * @see Spec v8 Part 16 — Normalização Linguística
 * @see Spec v8 Part 19 — scores/pesos nunca expostos em detalhe
 */
'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useNormalization } from '@/hooks/use-normalization'

// ─── Types ─────────────────────────────────────────────────────────────────

interface CatmatSugestao {
  codigo: string
  tipo: 'catmat' | 'catser'
  descricao: string
  assertividade: number
  fonte: string
}

interface Alerta {
  tipo: string
  mensagem: string
  sugestao: string | null
  base_legal?: string
}

interface NormalizationFeedbackProps {
  textoOriginal: string
  textoNormalizado: string
  catmatSugeridos: CatmatSugestao[]
  alertas: Alerta[]
  processoId?: string
  setor?: string
  regiaoUf?: string
  /** Callback quando feedback é enviado com sucesso */
  onFeedbackSent?: (tipo: string) => void
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function assertividadeLabel(score: number): { text: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' } {
  if (score >= 0.85) return { text: 'Alta confiança', variant: 'default' }
  if (score >= 0.65) return { text: 'Média confiança', variant: 'secondary' }
  if (score >= 0.45) return { text: 'Baixa confiança', variant: 'outline' }
  return { text: 'Incerto', variant: 'destructive' }
}

function alertaIcon(tipo: string): string {
  switch (tipo) {
    case 'marca_detectada': return '⚠️'
    case 'termo_ambiguo': return '🔀'
    case 'regionalismo': return '🗺️'
    case 'medicamento_dcb': return '💊'
    case 'codigo_obsoleto': return '🚫'
    default: return 'ℹ️'
  }
}

// ─── Component ─────────────────────────────────────────────────────────────

export function NormalizationFeedback({
  textoOriginal,
  textoNormalizado,
  catmatSugeridos,
  alertas,
  processoId,
  setor,
  regiaoUf,
  onFeedbackSent,
}: NormalizationFeedbackProps) {
  const { enviarFeedback, loading } = useNormalization()
  const [modo, setModo] = useState<'visualizar' | 'corrigir'>('visualizar')
  const [termoCorrigido, setTermoCorrigido] = useState(textoNormalizado)
  const [catmatCorrigido, setCatmatCorrigido] = useState('')
  const [enviado, setEnviado] = useState(false)

  const houveMudanca = textoOriginal.toLowerCase().trim() !== textoNormalizado.toLowerCase().trim()

  const handleAprovar = useCallback(async () => {
    const sucesso = await enviarFeedback({
      processo_id: processoId,
      termo_original: textoOriginal,
      termo_normalizado_sistema: textoNormalizado,
      catmat_sugerido_sistema: catmatSugeridos[0]?.codigo,
      tipo_feedback: 'aprovacao',
      setor,
      regiao_uf: regiaoUf,
    })
    if (sucesso) {
      setEnviado(true)
      onFeedbackSent?.('aprovacao')
    }
  }, [textoOriginal, textoNormalizado, catmatSugeridos, processoId, setor, regiaoUf, enviarFeedback, onFeedbackSent])

  const handleRejeitar = useCallback(async () => {
    const sucesso = await enviarFeedback({
      processo_id: processoId,
      termo_original: textoOriginal,
      termo_normalizado_sistema: textoNormalizado,
      tipo_feedback: 'rejeicao',
      setor,
      regiao_uf: regiaoUf,
    })
    if (sucesso) {
      setEnviado(true)
      onFeedbackSent?.('rejeicao')
    }
  }, [textoOriginal, textoNormalizado, processoId, setor, regiaoUf, enviarFeedback, onFeedbackSent])

  const handleCorrigir = useCallback(async () => {
    if (!termoCorrigido.trim()) return

    const tipo = catmatCorrigido ? 'correcao_catmat' : 'correcao_termo'
    const sucesso = await enviarFeedback({
      processo_id: processoId,
      termo_original: textoOriginal,
      termo_normalizado_sistema: textoNormalizado,
      catmat_sugerido_sistema: catmatSugeridos[0]?.codigo,
      termo_corrigido_usuario: termoCorrigido.trim(),
      catmat_corrigido_usuario: catmatCorrigido.trim() || undefined,
      tipo_feedback: tipo,
      setor,
      regiao_uf: regiaoUf,
    })
    if (sucesso) {
      setEnviado(true)
      setModo('visualizar')
      onFeedbackSent?.(tipo)
    }
  }, [textoOriginal, textoNormalizado, termoCorrigido, catmatCorrigido, catmatSugeridos, processoId, setor, regiaoUf, enviarFeedback, onFeedbackSent])

  // Feedback já enviado — mostrar confirmação
  if (enviado) {
    return (
      <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20">
        <CardContent className="py-3 text-center">
          <p className="text-sm text-green-700 dark:text-green-300">
            Feedback registrado. Obrigado por melhorar o sistema!
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-blue-200 dark:border-blue-800">
      {/* Normalização */}
      {houveMudanca && (
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Normalização aplicada
          </CardTitle>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground line-through">{textoOriginal}</p>
            <p className="text-sm font-medium">{textoNormalizado}</p>
          </div>
        </CardHeader>
      )}

      <CardContent className="space-y-3 pt-2">
        {/* CATMAT Sugeridos */}
        {catmatSugeridos.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">Códigos sugeridos</p>
            <div className="space-y-1">
              {catmatSugeridos.slice(0, 3).map((cat) => {
                const { text, variant } = assertividadeLabel(cat.assertividade)
                return (
                  <div
                    key={cat.codigo}
                    className="flex items-center justify-between gap-2 rounded-md bg-muted/50 px-2 py-1"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Badge variant="outline" className="shrink-0 text-xs">
                        {cat.tipo.toUpperCase()} {cat.codigo}
                      </Badge>
                      <span className="text-xs truncate">{cat.descricao}</span>
                    </div>
                    <Badge variant={variant} className="shrink-0 text-xs">
                      {text}
                    </Badge>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Alertas */}
        {alertas.length > 0 && (
          <div className="space-y-1">
            {alertas.slice(0, 3).map((alerta, i) => (
              <div
                key={i}
                className="flex items-start gap-2 rounded-md bg-yellow-50 dark:bg-yellow-950/20 px-2 py-1.5"
              >
                <span className="text-sm shrink-0">{alertaIcon(alerta.tipo)}</span>
                <div className="min-w-0">
                  <p className="text-xs">{alerta.mensagem}</p>
                  {alerta.sugestao && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Sugestão: <strong>{alerta.sugestao}</strong>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modo Correção */}
        {modo === 'corrigir' && (
          <div className="space-y-2 border-t pt-2">
            <div>
              <label className="text-xs text-muted-foreground">Termo correto</label>
              <Input
                value={termoCorrigido}
                onChange={(e) => setTermoCorrigido(e.target.value)}
                placeholder="Digite o termo correto..."
                className="h-8 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Código CATMAT/CATSER (opcional)</label>
              <Input
                value={catmatCorrigido}
                onChange={(e) => setCatmatCorrigido(e.target.value)}
                placeholder="Ex: 150374"
                className="h-8 text-sm"
              />
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="default" onClick={handleCorrigir} disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar correção'}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setModo('visualizar')}>
                Cancelar
              </Button>
            </div>
          </div>
        )}

        {/* Botões de Feedback */}
        {modo === 'visualizar' && (
          <div className="flex items-center gap-2 border-t pt-2">
            <span className="text-xs text-muted-foreground mr-auto">Está correto?</span>
            <Button size="sm" variant="ghost" onClick={handleAprovar} disabled={loading} className="h-7 text-xs">
              Sim
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setModo('corrigir')} disabled={loading} className="h-7 text-xs">
              Corrigir
            </Button>
            <Button size="sm" variant="ghost" onClick={handleRejeitar} disabled={loading} className="h-7 text-xs text-destructive">
              Errado
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
