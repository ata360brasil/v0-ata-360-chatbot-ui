/**
 * ATA360 — Camada 6: Busca semântica via D1 FTS + Vectorize (fallback).
 *
 * Quando as camadas anteriores não encontraram CATMAT, busca por:
 * 1. FTS (Full-Text Search) no D1 catmat_enriquecido
 * 2. Vectorize embeddings (se disponível) — mais lento, mais preciso
 *
 * Retorna sugestões de CATMAT com score de assertividade.
 */

import type { PipelineStep, CatmatSugestao, NormalizacaoAlerta, NormalizationEnv } from './types'
import { removeAccents, extractTokens } from './tokenizer'

interface CatmatRow {
  codigo: string
  tipo: string
  descricao_oficial: string
  descricao_enriquecida: string | null
  assertividade_base: number
  volume_estimado: string | null
  termos_busca: string  // JSON array
  desambiguacao: string | null  // JSON map
  alerta: string | null
  categoria: string
  dcb: string | null
}

export interface SemanticoResult {
  step: PipelineStep
  catmat_sugeridos: CatmatSugestao[]
  alertas: NormalizacaoAlerta[]
}

/**
 * Busca CATMAT/CATSER por FTS e opcionalmente por embedding.
 */
export async function semanticSearch(
  texto: string,
  setorOrgao: string | undefined,
  env: NormalizationEnv,
): Promise<SemanticoResult> {
  const catmat_sugeridos: CatmatSugestao[] = []
  const alertas: NormalizacaoAlerta[] = []

  // 1. FTS Search no D1
  const tokens = extractTokens(texto)
  if (tokens.length > 0) {
    const ftsQuery = tokens.join(' OR ')

    try {
      const ftsResults = await env.D1_NORMALIZACAO
        .prepare(
          `SELECT ce.codigo, ce.tipo, ce.descricao_oficial, ce.descricao_enriquecida,
                  ce.assertividade_base, ce.volume_estimado, ce.termos_busca,
                  ce.desambiguacao, ce.alerta, ce.categoria, ce.dcb
           FROM fts_catmat fc
           JOIN catmat_enriquecido ce ON fc.rowid = ce.id
           WHERE fts_catmat MATCH ? AND ce.status = 'ATIVO'
           ORDER BY rank
           LIMIT 10`
        )
        .bind(ftsQuery)
        .all<CatmatRow>()

      if (ftsResults.results) {
        for (const row of ftsResults.results) {
          // Calcular assertividade ajustada
          let assertividade = row.assertividade_base

          // Boost por volume
          const volumeBoost: Record<string, number> = {
            'muito_alto': 0.10,
            'alto': 0.05,
            'medio': 0.00,
            'baixo': -0.05,
          }
          assertividade += volumeBoost[row.volume_estimado || 'medio'] || 0

          // Se tem desambiguação e setor combina, boost
          if (row.desambiguacao && setorOrgao) {
            try {
              const desamb = JSON.parse(row.desambiguacao) as Record<string, string>
              if (desamb[setorOrgao]) {
                assertividade += 0.10 // Setor-specific match bonus
              }
            } catch { /* ignore */ }
          }

          // Clamp 0-1
          assertividade = Math.max(0, Math.min(1, assertividade))

          catmat_sugeridos.push({
            codigo: row.codigo,
            tipo: row.tipo as 'catmat' | 'catser',
            descricao: row.descricao_enriquecida || row.descricao_oficial,
            assertividade,
            fonte: 'D1_FTS',
          })

          // Alertas especiais
          if (row.dcb) {
            alertas.push({
              tipo: 'medicamento_dcb',
              mensagem: `Medicamento deve usar DCB (Denominação Comum Brasileira): "${row.dcb}". Lei 9.787/1999.`,
              sugestao: row.dcb,
              base_legal: 'Lei 9.787/1999',
            })
          }

          if (row.alerta) {
            alertas.push({
              tipo: 'termo_ambiguo',
              mensagem: row.alerta,
              sugestao: null,
            })
          }
        }
      }
    } catch {
      // FTS falhou — continuar sem resultados FTS
    }
  }

  // 2. Vectorize (se disponível e se FTS não retornou resultados confiantes)
  const hasConfidentFTS = catmat_sugeridos.some(s => s.assertividade >= 0.75)

  if (!hasConfidentFTS && env.VECTORIZE_CATMAT && env.AI_GATEWAY) {
    try {
      // Gerar embedding do texto
      const embeddingResponse = await env.AI_GATEWAY.fetch(
        'https://api.openai.com/v1/embeddings',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            input: texto,
            model: 'text-embedding-3-small',
          }),
        },
      )

      if (embeddingResponse.ok) {
        const embData = await embeddingResponse.json() as {
          data: Array<{ embedding: number[] }>
        }

        if (embData.data?.[0]?.embedding) {
          const vectorResults = await env.VECTORIZE_CATMAT.query(
            embData.data[0].embedding,
            { topK: 5, returnMetadata: true },
          )

          for (const match of vectorResults.matches) {
            // Não duplicar com FTS results
            if (catmat_sugeridos.some(s => s.codigo === match.id)) continue

            catmat_sugeridos.push({
              codigo: match.id,
              tipo: 'catmat',
              descricao: (match.metadata?.descricao as string) || match.id,
              assertividade: match.score * 0.8, // Vectorize score scaled down
              fonte: 'VECTORIZE',
            })
          }
        }
      }
    } catch {
      // Vectorize falhou — continuar sem resultados semânticos
    }
  }

  // Ordenar por assertividade decrescente
  catmat_sugeridos.sort((a, b) => b.assertividade - a.assertividade)

  // Limitar a top 5
  const topSugeridos = catmat_sugeridos.slice(0, 5)

  return {
    step: {
      camada: 'semantico',
      texto_entrada: texto,
      texto_saida: texto, // Busca semântica não altera texto
      transformacao: topSugeridos.length > 0
        ? `Encontrados ${topSugeridos.length} código(s) CATMAT/CATSER`
        : null,
      confianca: topSugeridos.length > 0 ? topSugeridos[0].assertividade : 0,
      detalhes: topSugeridos.length > 0 ? {
        codigos: topSugeridos.map(s => `${s.codigo} (${s.assertividade.toFixed(2)})`)
      } : undefined,
    },
    catmat_sugeridos: topSugeridos,
    alertas,
  }
}
