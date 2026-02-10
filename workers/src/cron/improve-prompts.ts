/**
 * ATA360 — Cron: Melhoria de Prompts ACMA
 *
 * Executado semanalmente. Analisa edições recorrentes e propõe melhorias.
 *
 * Fluxo:
 * 1. Analisa sugestões da última semana com edit_ratio > 0.20
 * 2. Agrupa edições recorrentes por (documento_tipo, seção)
 * 3. Se taxa_aprovacao < 70% → marca para melhoria
 * 4. Insere padrões de edição recorrentes em acma_padroes_edicao
 * 5. Opcionalmente: gera nova versão de prompt (ativo=false, aguarda revisão)
 *
 * @see Spec v8 Part 08 — ACMA Agent Learning
 */

interface CronEnv {
  SUPABASE_URL: string
  SUPABASE_SERVICE_KEY: string
}

interface SugestaoRow {
  documento_tipo: string
  secao: string
  texto_sugerido: string
  texto_final: string
  decisao: string
  edit_ratio: number
  setor: string | null
}

export interface PromptImprovementResult {
  semana: string
  padroes_detectados: number
  padroes_inseridos: number
  secoes_abaixo_meta: Array<{
    documento_tipo: string
    secao: string
    taxa_aprovacao: number
    edit_ratio_medio: number
    total_sugestoes: number
  }>
  erros: string[]
}

/**
 * Analisa edições da semana e detecta padrões recorrentes.
 */
export async function improvePrompts(env: CronEnv): Promise<PromptImprovementResult> {
  const result: PromptImprovementResult = {
    semana: new Date().toISOString().slice(0, 10),
    padroes_detectados: 0,
    padroes_inseridos: 0,
    secoes_abaixo_meta: [],
    erros: [],
  }

  const headers = {
    'Content-Type': 'application/json',
    'apikey': env.SUPABASE_SERVICE_KEY,
    'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
  }

  try {
    // 1. Buscar sugestões editadas da última semana
    const umaSemanaAtras = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

    const sugResponse = await fetch(
      `${env.SUPABASE_URL}/rest/v1/acma_sugestoes?created_at=gte.${umaSemanaAtras}&decisao=eq.EDITAR&select=documento_tipo,secao,texto_sugerido,texto_final,decisao,edit_ratio,setor&order=created_at.desc&limit=500`,
      { headers },
    )

    if (!sugResponse.ok) {
      result.erros.push(`Falha ao buscar sugestões: ${sugResponse.status}`)
      return result
    }

    const sugestoes = await sugResponse.json() as SugestaoRow[]
    if (sugestoes.length === 0) return result

    // 2. Agrupar por (documento_tipo, seção) e analisar
    const grupos = new Map<string, SugestaoRow[]>()
    for (const s of sugestoes) {
      const key = `${s.documento_tipo}|${s.secao}`
      if (!grupos.has(key)) grupos.set(key, [])
      grupos.get(key)!.push(s)
    }

    // 3. Para cada grupo, detectar padrões
    for (const [key, items] of grupos) {
      const [documentoTipo, secao] = key.split('|')

      // Calcular métricas
      const editRatioMedio = items.reduce((sum, i) => sum + (i.edit_ratio || 0), 0) / items.length

      // Buscar total de sugestões (incluindo APROVARs) para calcular taxa
      const totalResponse = await fetch(
        `${env.SUPABASE_URL}/rest/v1/acma_sugestoes?created_at=gte.${umaSemanaAtras}&documento_tipo=eq.${documentoTipo}&secao=eq.${secao}&select=decisao`,
        { headers },
      )

      let taxaAprovacao = 0
      let totalSugestoes = 0
      if (totalResponse.ok) {
        const todas = await totalResponse.json() as Array<{ decisao: string }>
        totalSugestoes = todas.length
        const aprovadas = todas.filter(t => t.decisao === 'APROVAR').length
        taxaAprovacao = totalSugestoes > 0 ? (aprovadas / totalSugestoes) * 100 : 0
      }

      // Se taxa_aprovacao < 70%, marcar para melhoria
      if (taxaAprovacao < 70 && totalSugestoes >= 5) {
        result.secoes_abaixo_meta.push({
          documento_tipo: documentoTipo,
          secao,
          taxa_aprovacao: Math.round(taxaAprovacao),
          edit_ratio_medio: Math.round(editRatioMedio * 1000) / 1000,
          total_sugestoes: totalSugestoes,
        })
      }

      // 4. Detectar e inserir padrões de edição recorrentes
      // Simplificação: extrair frases removidas/adicionadas frequentemente
      const setoresUsados = [...new Set(items.map(i => i.setor).filter(Boolean))]

      // Identificar correções recorrentes (mesma edição 3+ vezes)
      const correcoes = new Map<string, { original: string; corrigido: string; count: number }>()

      for (const item of items) {
        if (!item.texto_sugerido || !item.texto_final) continue

        // Heurística: extrair frases curtas que mudam
        const wordsOriginal = item.texto_sugerido.split(/\s+/).slice(0, 50)
        const wordsFinal = item.texto_final.split(/\s+/).slice(0, 50)

        // Encontrar subsequências que mudaram
        for (let i = 0; i < Math.min(wordsOriginal.length, wordsFinal.length); i++) {
          if (wordsOriginal[i] !== wordsFinal[i]) {
            const chunkOriginal = wordsOriginal.slice(Math.max(0, i - 1), i + 2).join(' ')
            const chunkFinal = wordsFinal.slice(Math.max(0, i - 1), i + 2).join(' ')
            const key = `${chunkOriginal}→${chunkFinal}`
            const existing = correcoes.get(key)
            if (existing) {
              existing.count++
            } else {
              correcoes.set(key, { original: chunkOriginal, corrigido: chunkFinal, count: 1 })
            }
          }
        }
      }

      // Inserir padrões com 3+ ocorrências
      for (const [, correcao] of correcoes) {
        if (correcao.count >= 3) {
          result.padroes_detectados++

          try {
            const insertResponse = await fetch(
              `${env.SUPABASE_URL}/rest/v1/acma_padroes_edicao`,
              {
                method: 'POST',
                headers: { ...headers, 'Prefer': 'return=minimal' },
                body: JSON.stringify({
                  documento_tipo: documentoTipo,
                  secao,
                  padrao_original: correcao.original,
                  padrao_corrigido: correcao.corrigido,
                  frequencia: correcao.count,
                  confianca: Math.min(0.95, 0.5 + (correcao.count * 0.05)),
                  setores: setoresUsados.length > 0 ? setoresUsados : null,
                }),
              },
            )

            if (insertResponse.ok) {
              result.padroes_inseridos++
            }
          } catch {
            // Continuar com próximo padrão
          }
        }
      }
    }

    // 5. Registrar no audit_trail
    await fetch(`${env.SUPABASE_URL}/rest/v1/audit_trail`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        orgao_id: '00000000-0000-0000-0000-000000000000',
        acao: 'ACMA_MELHORIA_PROMPTS',
        agente: 'cron_improve_prompts',
        hash: crypto.randomUUID(),
        detalhes: {
          semana: result.semana,
          padroes_detectados: result.padroes_detectados,
          padroes_inseridos: result.padroes_inseridos,
          secoes_abaixo_meta: result.secoes_abaixo_meta,
        },
        criado_por: '00000000-0000-0000-0000-000000000000',
      }),
    })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Erro geral'
    result.erros.push(`Erro geral na melhoria: ${msg}`)
  }

  return result
}
