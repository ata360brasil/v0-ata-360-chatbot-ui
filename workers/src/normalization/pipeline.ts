/**
 * ATA360 — Pipeline de Normalização: Orquestrador das 6 camadas.
 *
 * Fluxo sequencial:
 *   Input → tokenize → abreviaturas → sinônimos → regionalismos → marcas → semântico → Output
 *
 * Cache KV: chave `norm:{sha256(texto+setor+uf)}`, TTL 24h.
 *
 * @see Spec v8 Part 16 — Normalização Linguística
 */

import type {
  NormalizationEnv,
  NormalizeRequest,
  NormalizeResponse,
  PipelineStep,
  CatmatSugestao,
  NormalizacaoAlerta,
} from './types'

import { tokenize } from './tokenizer'
import { expandAbreviaturas } from './abreviaturas'
import { resolveSinonimos } from './sinonimos'
import { resolveRegionalismos } from './regionalismos'
import { detectBrands } from './marcas'
import { semanticSearch } from './semantico'

// ─── Cache ─────────────────────────────────────────────────────────────────

const CACHE_TTL = 86_400 // 24h

/**
 * Gera chave de cache determinística.
 * Usa Web Crypto (disponível em Workers) para SHA-256.
 */
async function cacheKey(texto: string, setor?: string, uf?: string): Promise<string> {
  const raw = `${texto}|${setor || ''}|${uf || ''}`
  const data = new TextEncoder().encode(raw)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  return `norm:${hashHex}`
}

// ─── Pipeline ──────────────────────────────────────────────────────────────

/**
 * Executa pipeline completo de normalização em 6 camadas sequenciais.
 *
 * Cada camada recebe o texto_saida da camada anterior.
 * Alertas e CATMAT sugeridos são acumulados ao longo do pipeline.
 * Cache KV evita reprocessamento de textos idênticos (mesmo setor/UF).
 */
export async function executePipeline(
  request: NormalizeRequest,
  env: NormalizationEnv,
): Promise<NormalizeResponse> {
  const startTime = Date.now()
  const { texto, setor_orgao, regiao_uf, incluir_catmat } = request

  // ─── 1. Checar cache ─────────────────────────────────────────────────────

  const key = await cacheKey(texto, setor_orgao, regiao_uf)

  try {
    const cached = await env.KV_CACHE.get(key, { type: 'text' })
    if (cached) {
      const parsed = JSON.parse(cached) as NormalizeResponse
      return { ...parsed, cache_hit: true, duracao_ms: Date.now() - startTime }
    }
  } catch {
    // Cache miss ou erro — prosseguir normalmente
  }

  // ─── 2. Executar pipeline sequencial ──────────────────────────────────────

  const steps: PipelineStep[] = []
  const allAlertas: NormalizacaoAlerta[] = []
  const allCatmat: CatmatSugestao[] = []

  // Camada 1: Tokenização
  const { resultado: textoTokenizado, step: stepToken } = tokenize(texto)
  steps.push(stepToken)

  // Camada 2: Abreviaturas
  let textoAtual = textoTokenizado
  try {
    const { resultado, step } = await expandAbreviaturas(textoAtual, env.D1_NORMALIZACAO)
    textoAtual = resultado
    steps.push(step)
  } catch {
    steps.push({
      camada: 'abreviatura',
      texto_entrada: textoAtual,
      texto_saida: textoAtual,
      transformacao: null,
      confianca: 1.0,
      detalhes: { erro: 'Falha na expansão de abreviaturas' },
    })
  }

  // Camada 3: Sinônimos
  try {
    const sinResult = await resolveSinonimos(textoAtual, setor_orgao, env.D1_NORMALIZACAO)
    textoAtual = sinResult.resultado
    steps.push(sinResult.step)
    allAlertas.push(...sinResult.alertas)

    // CATMAT encontrados via sinônimos (match direto)
    for (const cm of sinResult.catmat_encontrados) {
      if (cm.codigo) {
        allCatmat.push({
          codigo: cm.codigo,
          tipo: 'catmat',
          descricao: cm.termo,
          assertividade: cm.confianca,
          fonte: 'EXACT_MATCH',
        })
      }
    }
  } catch {
    steps.push({
      camada: 'sinonimo',
      texto_entrada: textoAtual,
      texto_saida: textoAtual,
      transformacao: null,
      confianca: 1.0,
      detalhes: { erro: 'Falha na resolução de sinônimos' },
    })
  }

  // Camada 4: Regionalismos
  try {
    const regResult = await resolveRegionalismos(textoAtual, regiao_uf, env.D1_NORMALIZACAO)
    textoAtual = regResult.resultado
    steps.push(regResult.step)
    allAlertas.push(...regResult.alertas)
  } catch {
    steps.push({
      camada: 'regional',
      texto_entrada: textoAtual,
      texto_saida: textoAtual,
      transformacao: null,
      confianca: 1.0,
      detalhes: { erro: 'Falha na resolução de regionalismos' },
    })
  }

  // Camada 5: Marcas
  try {
    const marcaResult = await detectBrands(textoAtual, env.D1_NORMALIZACAO)
    textoAtual = marcaResult.resultado // Marcas não alteram texto, mas mantemos consistência
    steps.push(marcaResult.step)
    allAlertas.push(...marcaResult.alertas)
  } catch {
    steps.push({
      camada: 'marca',
      texto_entrada: textoAtual,
      texto_saida: textoAtual,
      transformacao: null,
      confianca: 1.0,
      detalhes: { erro: 'Falha na detecção de marcas' },
    })
  }

  // Camada 6: Busca semântica (somente se incluir_catmat = true)
  if (incluir_catmat) {
    try {
      const semResult = await semanticSearch(textoAtual, setor_orgao, env)
      steps.push(semResult.step)
      allAlertas.push(...semResult.alertas)
      allCatmat.push(...semResult.catmat_sugeridos)
    } catch {
      steps.push({
        camada: 'semantico',
        texto_entrada: textoAtual,
        texto_saida: textoAtual,
        transformacao: null,
        confianca: 0,
        detalhes: { erro: 'Falha na busca semântica' },
      })
    }
  }

  // ─── 3. Deduplicar e ordenar CATMAT ─────────────────────────────────────

  const catmatMap = new Map<string, CatmatSugestao>()
  for (const s of allCatmat) {
    const existing = catmatMap.get(s.codigo)
    if (!existing || existing.assertividade < s.assertividade) {
      catmatMap.set(s.codigo, s)
    }
  }

  const catmat_sugeridos = Array.from(catmatMap.values())
    .sort((a, b) => b.assertividade - a.assertividade)
    .slice(0, 10) // Top 10

  // ─── 4. Deduplicar alertas ──────────────────────────────────────────────

  const alertasUnicos: NormalizacaoAlerta[] = []
  const alertasSeen = new Set<string>()
  for (const a of allAlertas) {
    const key = `${a.tipo}:${a.mensagem}`
    if (!alertasSeen.has(key)) {
      alertasSeen.add(key)
      alertasUnicos.push(a)
    }
  }

  // ─── 5. Montar resposta ─────────────────────────────────────────────────

  const response: NormalizeResponse = {
    texto_original: texto,
    texto_normalizado: textoAtual,
    pipeline_aplicado: steps,
    catmat_sugeridos,
    alertas: alertasUnicos,
    cache_hit: false,
    duracao_ms: Date.now() - startTime,
  }

  // ─── 6. Salvar no cache ─────────────────────────────────────────────────

  try {
    await env.KV_CACHE.put(key, JSON.stringify(response), { expirationTtl: CACHE_TTL })
  } catch {
    // Falha no cache não é crítica
  }

  return response
}
