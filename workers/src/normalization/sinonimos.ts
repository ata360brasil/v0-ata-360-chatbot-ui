/**
 * ATA360 — Camada 3: Resolução de sinônimos com contexto setorial.
 *
 * Consulta D1 `termos_normalizados` + `variantes`.
 * Quando há desambiguação, usa `setor_orgao` para resolver.
 *
 * Ex: "notebook" + setor=TI → "microcomputador portátil"
 * Ex: "monitor" + setor=SAUDE → "monitor multiparamétrico"
 * Ex: "monitor" + setor=TI → "monitor de vídeo LED"
 */

import type { PipelineStep, NormalizacaoAlerta } from './types'
import { extractTokens, removeAccents } from './tokenizer'

interface TermoRow {
  id: number
  termo_usuario: string
  termo_normalizado: string
  catmat_preferencial: string | null
  setor: string
  confianca: number
  desambiguacao: string | null
}

interface VarianteRow {
  variante: string
  termo_normalizado: string
  catmat_preferencial: string | null
  setor: string
  confianca: number
  desambiguacao: string | null
}

export interface SinonimoResult {
  resultado: string
  step: PipelineStep
  alertas: NormalizacaoAlerta[]
  catmat_encontrados: Array<{ codigo: string; termo: string; confianca: number }>
}

/**
 * Resolve sinônimos no texto usando D1 lookup + contexto setorial.
 */
export async function resolveSinonimos(
  texto: string,
  setorOrgao: string | undefined,
  db: D1Database,
): Promise<SinonimoResult> {
  const original = texto
  const tokens = extractTokens(texto)
  const alertas: NormalizacaoAlerta[] = []
  const catmat_encontrados: Array<{ codigo: string; termo: string; confianca: number }> = []
  const substituicoes: string[] = []

  let resultado = texto

  // Para cada token, tentar match exato e depois fuzzy
  for (const token of tokens) {
    // 1. Match exato em termos_normalizados
    const termoExato = await db
      .prepare(
        `SELECT id, termo_usuario, termo_normalizado, catmat_preferencial, setor, confianca, desambiguacao
         FROM termos_normalizados
         WHERE termo_usuario = ? AND ativo = 1
         ORDER BY confianca DESC
         LIMIT 5`
      )
      .bind(token)
      .all<TermoRow>()

    let matched = false

    if (termoExato.results && termoExato.results.length > 0) {
      const match = resolveWithContext(termoExato.results, setorOrgao)

      if (match) {
        // Substituir no texto
        const regex = new RegExp(`\\b${escapeRegex(token)}\\b`, 'gi')
        const antes = resultado
        resultado = resultado.replace(regex, match.termo_normalizado)

        if (resultado !== antes) {
          substituicoes.push(`"${token}" → "${match.termo_normalizado}"`)
          matched = true

          if (match.catmat_preferencial) {
            catmat_encontrados.push({
              codigo: match.catmat_preferencial,
              termo: match.termo_normalizado,
              confianca: match.confianca,
            })
          }

          // Gerar alerta de ambiguidade se havia múltiplos setores
          if (termoExato.results.length > 1 && match.desambiguacao) {
            alertas.push({
              tipo: 'termo_ambiguo',
              mensagem: `"${token}" tem significados diferentes por setor. Usando interpretação de ${setorOrgao || 'contexto geral'}.`,
              sugestao: match.termo_normalizado,
            })
          }
        }
      }
    }

    // 2. Se não achou exato, tentar variantes
    if (!matched) {
      const varianteMatch = await db
        .prepare(
          `SELECT v.variante, tn.termo_normalizado, tn.catmat_preferencial, tn.setor, tn.confianca, tn.desambiguacao
           FROM variantes v
           JOIN termos_normalizados tn ON v.termo_id = tn.id
           WHERE v.variante = ? AND tn.ativo = 1
           ORDER BY v.confianca DESC
           LIMIT 5`
        )
        .bind(token)
        .all<VarianteRow>()

      if (varianteMatch.results && varianteMatch.results.length > 0) {
        const match = resolveWithContext(
          varianteMatch.results.map(v => ({
            id: 0,
            termo_usuario: v.variante,
            termo_normalizado: v.termo_normalizado,
            catmat_preferencial: v.catmat_preferencial,
            setor: v.setor,
            confianca: v.confianca,
            desambiguacao: v.desambiguacao,
          })),
          setorOrgao,
        )

        if (match) {
          const regex = new RegExp(`\\b${escapeRegex(token)}\\b`, 'gi')
          const antes = resultado
          resultado = resultado.replace(regex, match.termo_normalizado)

          if (resultado !== antes) {
            substituicoes.push(`"${token}" → "${match.termo_normalizado}" (variante)`)

            if (match.catmat_preferencial) {
              catmat_encontrados.push({
                codigo: match.catmat_preferencial,
                termo: match.termo_normalizado,
                confianca: match.confianca * 0.9, // variante tem confiança ligeiramente menor
              })
            }
          }
        }
      }
    }

    // 3. Se ainda não achou, tentar FTS (busca textual)
    if (!matched && token.length >= 4) {
      const ftsMatch = await db
        .prepare(
          `SELECT tn.termo_normalizado, tn.catmat_preferencial, tn.setor, tn.confianca
           FROM fts_termos ft
           JOIN termos_normalizados tn ON ft.rowid = tn.id
           WHERE fts_termos MATCH ? AND tn.ativo = 1
           ORDER BY rank
           LIMIT 3`
        )
        .bind(token)
        .all<TermoRow>()

      // FTS results são sugestões, não substituições automáticas
      if (ftsMatch.results && ftsMatch.results.length > 0) {
        const best = ftsMatch.results[0]
        if (best.confianca >= 0.7) {
          catmat_encontrados.push({
            codigo: best.catmat_preferencial || '',
            termo: best.termo_normalizado,
            confianca: best.confianca * 0.7, // FTS tem confiança menor
          })
        }
      }
    }
  }

  return {
    resultado,
    step: {
      camada: 'sinonimo',
      texto_entrada: original,
      texto_saida: resultado,
      transformacao: substituicoes.length > 0
        ? `Resolvidos ${substituicoes.length} sinônimo(s): ${substituicoes.slice(0, 3).join(', ')}${substituicoes.length > 3 ? '...' : ''}`
        : null,
      confianca: substituicoes.length > 0 ? 0.85 : 1.0,
      detalhes: substituicoes.length > 0 ? { substituicoes } : undefined,
    },
    alertas,
    catmat_encontrados,
  }
}

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Resolve qual termo usar com base no setor do órgão.
 * Se há desambiguação e setor bate, usa esse. Senão, usa o de maior confiança.
 */
function resolveWithContext(
  matches: TermoRow[],
  setorOrgao: string | undefined,
): TermoRow | null {
  if (matches.length === 0) return null

  // Se setor informado, priorizar match do setor
  if (setorOrgao) {
    // 1. Match exato de setor
    const setorMatch = matches.find(m => m.setor === setorOrgao)
    if (setorMatch) {
      // Se tem desambiguação, usar o valor do setor
      if (setorMatch.desambiguacao) {
        try {
          const desamb = JSON.parse(setorMatch.desambiguacao) as Record<string, string>
          if (desamb[setorOrgao]) {
            return { ...setorMatch, termo_normalizado: desamb[setorOrgao] }
          }
        } catch { /* parse error, ignore */ }
      }
      return setorMatch
    }

    // 2. Qualquer match com desambiguação para este setor
    for (const m of matches) {
      if (m.desambiguacao) {
        try {
          const desamb = JSON.parse(m.desambiguacao) as Record<string, string>
          if (desamb[setorOrgao]) {
            return { ...m, termo_normalizado: desamb[setorOrgao] }
          }
        } catch { /* parse error, ignore */ }
      }
    }
  }

  // 3. Fallback: maior confiança
  return matches[0]
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
