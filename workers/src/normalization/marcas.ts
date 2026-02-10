/**
 * ATA360 — Camada 5: Detecção de marcas e substituição por termo genérico.
 *
 * Lei 14.133/2021, art. 41 §I — vedação de indicação de marca em licitação.
 * Súmula TCU 270 — vedação de marca salvo justificativa técnica.
 *
 * Quando detecta marca: gera ALERTA + sugere termo genérico.
 * Não substitui automaticamente no texto (marca pode ser referência legítima com justificativa).
 */

import type { PipelineStep, NormalizacaoAlerta } from './types'

interface MarcaRow {
  marca: string
  termo_generico: string
  catmat_grupo: string | null
  categoria: string
  alerta: string | null
  exemplo_descritivo: string | null
  base_legal_especifica: string | null
}

export interface MarcaResult {
  resultado: string
  step: PipelineStep
  alertas: NormalizacaoAlerta[]
}

/**
 * Detecta marcas comerciais no texto e gera alertas de vedação legal.
 * NÃO substitui automaticamente — apenas alerta.
 */
export async function detectBrands(
  texto: string,
  db: D1Database,
): Promise<MarcaResult> {
  const original = texto
  const alertas: NormalizacaoAlerta[] = []
  const deteccoes: string[] = []

  // Carregar marcas (tabela ~160 rows)
  const { results } = await db
    .prepare(
      `SELECT marca, termo_generico, catmat_grupo, categoria, alerta, exemplo_descritivo, base_legal_especifica
       FROM marcas_genericas
       ORDER BY length(marca) DESC`
    )
    .all<MarcaRow>()

  if (!results || results.length === 0) {
    return {
      resultado: texto,
      step: {
        camada: 'marca',
        texto_entrada: original,
        texto_saida: texto,
        transformacao: null,
        confianca: 1.0,
      },
      alertas: [],
    }
  }

  // Para cada marca, verificar se aparece no texto
  for (const row of results) {
    // Marcas podem conter "/" para alternativas: "HP / Hewlett-Packard"
    const nomesMarca = row.marca.split('/').map(m => m.trim())

    for (const nome of nomesMarca) {
      if (nome.length < 2) continue

      const escaped = nome.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      // Match case-insensitive, word boundary
      const regex = new RegExp(`\\b${escaped}\\b`, 'gi')

      if (regex.test(texto)) {
        deteccoes.push(nome)

        const baseLegal = row.base_legal_especifica
          || 'Lei 14.133/2021, art. 41 §I; Súmula TCU 270'

        alertas.push({
          tipo: 'marca_detectada',
          mensagem: `⚠️ Marca "${nome}" detectada. ${row.alerta || 'Vedação de marca em licitação salvo justificativa técnica.'}`,
          sugestao: row.exemplo_descritivo || row.termo_generico,
          base_legal: baseLegal,
        })

        break // Uma detecção por marca é suficiente
      }
    }
  }

  // Marca detectada NÃO altera o texto (só gera alerta)
  return {
    resultado: texto,
    step: {
      camada: 'marca',
      texto_entrada: original,
      texto_saida: texto, // texto inalterado
      transformacao: deteccoes.length > 0
        ? `Detectada(s) ${deteccoes.length} marca(s): ${deteccoes.slice(0, 3).join(', ')}${deteccoes.length > 3 ? '...' : ''}`
        : null,
      confianca: 1.0,
      detalhes: deteccoes.length > 0 ? { marcas_detectadas: deteccoes } : undefined,
    },
    alertas,
  }
}
