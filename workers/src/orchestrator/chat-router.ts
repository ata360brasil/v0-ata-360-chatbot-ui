/**
 * ATA360 — Orquestrador: Chat Message Router
 *
 * Roteia mensagens do chat com base no estado atual do processo.
 * Cada estado tem comportamento diferente:
 *
 * - RASCUNHO: mensagem = objeto → inicia pipeline
 * - SUGESTAO_ACMA: feedback textual → registra observação
 * - AGUARDANDO_DECISAO: dúvida → responde com Insight Engine
 * - Qualquer estado: termos → normaliza via pipeline
 * - Todas mensagens: profile.learn()
 *
 * @see Spec v8 Part 20.3 — Fluxo Cíclico
 */

import type { ChatResponse, ProcessState, ProcessoRow, Env } from './types'
import { PROCESS_STATES } from './types'
import { loadProcesso, saveMessage } from './engine'
import { runPipeline } from './pipeline'
import { guardMessage, sanitizeResponse } from './chat-guard'

// ─── Route Message ───────────────────────────────────────────────────────────

/**
 * Roteia mensagem do chat com base no estado atual.
 * Retorna resposta sanitizada para o frontend.
 */
export async function routeMessage(
  processoId: string,
  mensagem: string,
  userId: string,
  orgaoId: string,
  env: Env,
): Promise<ChatResponse> {
  // 1. Carregar processo
  const processo = await loadProcesso(processoId, env)
  if (!processo) {
    return {
      role: 'system',
      content: 'Processo não encontrado.',
      pipeline_acionado: false,
    }
  }

  const estado = processo.status as ProcessState

  // 2. Chat Guard — verificar segurança da mensagem (Part 19 + anti-fraude)
  const guardResult = guardMessage(mensagem)
  if (!guardResult.permitido && guardResult.resposta_segura) {
    // Salvar mensagem do usuário (para audit trail) + resposta de bloqueio
    await saveMessage(processoId, orgaoId, 'user', mensagem, estado, env)
    await saveMessage(processoId, orgaoId, 'system', guardResult.resposta_segura, estado, env, {
      agente: 'chat_guard',
      metadata: {
        tipo_bloqueio: guardResult.tipo_bloqueio,
        termos_detectados: guardResult.termos_detectados,
        confianca: guardResult.confianca,
      },
    })
    return {
      role: 'assistant',
      content: guardResult.resposta_segura,
      pipeline_acionado: false,
    }
  }

  // 3. Salvar mensagem do usuário
  await saveMessage(processoId, orgaoId, 'user', mensagem, estado, env)

  // 4. Aprender com a mensagem (profile learning — async, não bloqueia)
  learnFromMessage(userId, orgaoId, mensagem, env).catch(() => {})

  // 5. Rotear com base no estado
  switch (estado) {
    case PROCESS_STATES.RASCUNHO:
      return await handleRascunhoChat(processo, mensagem, userId, orgaoId, env)

    case PROCESS_STATES.SUGESTAO_ACMA:
      return await handleSugestaoChat(processo, mensagem, userId, orgaoId, env)

    case PROCESS_STATES.AGUARDANDO_DECISAO:
      return await handleDecisaoChat(processo, mensagem, userId, orgaoId, env)

    case PROCESS_STATES.EDITANDO:
      return await handleEditandoChat(processo, mensagem, userId, orgaoId, env)

    case PROCESS_STATES.FINALIZADO:
      return await handleFinalizadoChat(processo, mensagem, userId, orgaoId, env)

    case PROCESS_STATES.DESCARTADO:
      return {
        role: 'assistant',
        content: 'Este processo foi descartado. Crie um novo processo para continuar.',
        pipeline_acionado: false,
      }

    default:
      // Estados intermediários (COLETANDO_DADOS, GERANDO_DOCUMENTO, AUDITANDO)
      return {
        role: 'assistant',
        content: `Processando... Por favor aguarde. Estado atual: ${estado}`,
        pipeline_acionado: false,
      }
  }
}

// ─── State-specific Chat Handlers ────────────────────────────────────────────

/**
 * RASCUNHO: primeira mensagem inicia o pipeline.
 */
async function handleRascunhoChat(
  processo: ProcessoRow,
  mensagem: string,
  userId: string,
  orgaoId: string,
  env: Env,
): Promise<ChatResponse> {
  // Iniciar pipeline automaticamente
  const result = await runPipeline(
    processo.id,
    { tipo: 'chat', mensagem },
    userId,
    orgaoId,
    env,
  )

  return {
    role: 'assistant',
    content: result.mensagem,
    insight_cards: result.insight_cards,
    artefato: result.sugestao_acma ? {
      tipo: processo.documento_atual || 'DFD',
      dados: result.sugestao_acma as unknown as Record<string, unknown>,
    } : null,
    pipeline_acionado: true,
    pipeline_result: result,
  }
}

/**
 * SUGESTAO_ACMA: feedback textual sobre a sugestão.
 * Registra observação, mas não aciona pipeline.
 * O usuário precisa clicar APROVAR/EDITAR/NOVA_SUGESTAO na decision-bar.
 */
async function handleSugestaoChat(
  processo: ProcessoRow,
  mensagem: string,
  userId: string,
  orgaoId: string,
  env: Env,
): Promise<ChatResponse> {
  // Verificar se é um pedido de normalização
  if (isNormalizationRequest(mensagem)) {
    return await handleNormalization(processo, mensagem, userId, orgaoId, env)
  }

  // Registrar como observação (não aciona pipeline)
  await saveMessage(processo.id, orgaoId, 'assistant',
    `Observação registrada. Para prosseguir, use os botões de decisão:\n` +
    `• ✅ Aprovar — aceita o texto sugerido\n` +
    `• ✏️ Editar — faz ajustes manuais\n` +
    `• 🔄 Nova sugestão — pede nova geração\n` +
    `• ❌ Descartar — cancela este documento`,
    PROCESS_STATES.SUGESTAO_ACMA, env, { agente: 'orquestrador' },
  )

  return {
    role: 'assistant',
    content: `Sua observação foi registrada: "${mensagem.slice(0, 100)}${mensagem.length > 100 ? '...' : ''}"\n\nPara prosseguir, use os botões de decisão na barra inferior.`,
    pipeline_acionado: false,
  }
}

/**
 * AGUARDANDO_DECISAO: responde dúvidas usando contexto.
 */
async function handleDecisaoChat(
  processo: ProcessoRow,
  mensagem: string,
  userId: string,
  orgaoId: string,
  env: Env,
): Promise<ChatResponse> {
  // Verificar se é um pedido de normalização
  if (isNormalizationRequest(mensagem)) {
    return await handleNormalization(processo, mensagem, userId, orgaoId, env)
  }

  // Responder com base no contexto do Insight Engine
  const insightContext = processo.insight_context
  const parecer = processo.auditor_parecer_atual

  let responseContent = ''

  if (parecer) {
    const naoConformes = parecer.checklist_publico.filter(c => !c.conforme)
    if (naoConformes.length > 0) {
      responseContent = `**Achados da auditoria:**\n`
      for (const achado of naoConformes) {
        responseContent += `• ${achado.descricao}: ${achado.achado || 'Não atendido'}\n`
        if (achado.fundamentacao) {
          responseContent += `  _Fundamento: ${achado.fundamentacao}_\n`
        }
      }
      responseContent += `\nPara prosseguir, use os botões de decisão na barra inferior.`
    }
  }

  if (!responseContent) {
    responseContent = `O documento está aguardando sua decisão.\n\n` +
      `• ✅ Aprovar — finaliza com selo de qualidade\n` +
      `• ✏️ Editar — ajusta e reaudita\n` +
      `• 🔄 Nova sugestão — gera novo texto\n` +
      `• ⏩ Prosseguir — finaliza sem selo\n` +
      `• ❌ Descartar — cancela`
  }

  await saveMessage(processo.id, orgaoId, 'assistant', responseContent, PROCESS_STATES.AGUARDANDO_DECISAO, env, { agente: 'orquestrador' })

  return {
    role: 'assistant',
    content: responseContent,
    pipeline_acionado: false,
  }
}

/**
 * EDITANDO: recebe texto editado e re-processa.
 */
async function handleEditandoChat(
  processo: ProcessoRow,
  mensagem: string,
  userId: string,
  orgaoId: string,
  env: Env,
): Promise<ChatResponse> {
  // Mensagem é o texto editado — acionar pipeline
  const result = await runPipeline(
    processo.id,
    { tipo: 'decisao', decisao: 'EDITAR' as any, texto_editado: mensagem },
    userId,
    orgaoId,
    env,
  )

  return {
    role: 'assistant',
    content: result.mensagem,
    artefato: result.artefato ? {
      tipo: processo.documento_atual || 'DFD',
      url: result.artefato.url,
      hash: result.artefato.hash,
      versao: result.artefato.versao,
    } : null,
    pipeline_acionado: true,
    pipeline_result: result,
  }
}

/**
 * FINALIZADO: informações sobre próximo passo.
 */
async function handleFinalizadoChat(
  processo: ProcessoRow,
  mensagem: string,
  userId: string,
  orgaoId: string,
  env: Env,
): Promise<ChatResponse> {
  const proximo = processo.proximo_sugerido

  if (proximo) {
    return {
      role: 'assistant',
      content: `O documento ${processo.documento_atual} foi finalizado.\n\nPróximo documento na trilha: **${proximo}**. O pipeline será iniciado automaticamente.`,
      pipeline_acionado: false,
    }
  }

  return {
    role: 'assistant',
    content: `Todos os documentos da trilha foram concluídos! O processo está finalizado.\n\nVocê pode iniciar o fluxo de publicação (assinatura digital + carimbo do tempo) através do menu de ações.`,
    pipeline_acionado: false,
  }
}

// ─── Normalization Helper ────────────────────────────────────────────────────

function isNormalizationRequest(mensagem: string): boolean {
  const keywords = ['normaliz', 'catmat', 'catser', 'código', 'termo', 'sinônim', 'sinonim']
  const lower = mensagem.toLowerCase()
  return keywords.some(k => lower.includes(k))
}

async function handleNormalization(
  processo: ProcessoRow,
  mensagem: string,
  userId: string,
  orgaoId: string,
  env: Env,
): Promise<ChatResponse> {
  // Extrair termo para normalizar
  const termo = mensagem
    .replace(/normaliz(ar|e|ação)?/gi, '')
    .replace(/catmat|catser|código|termo|sinônim[oa]?s?/gi, '')
    .trim()

  if (!termo) {
    return {
      role: 'assistant',
      content: 'Qual termo você gostaria de normalizar? Envie o nome do item ou material.',
      pipeline_acionado: false,
    }
  }

  // Chamar pipeline de normalização via fetch interno
  // A rota /api/v1/normalize já existe no Workers
  try {
    // Chamada interna ao Workers — usar self-reference via env.WORKERS_URL ou relativo
    // Em produção, o Worker pode chamar a si mesmo via Service Binding ou URL real
    const workersBaseUrl = env.WORKERS_URL || 'https://api.ata360.com.br'
    const normResponse = await fetch(`${workersBaseUrl}/api/v1/normalize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        texto: termo,
        setor_orgao: processo.insight_context?.perfil_usuario?.segmento_principal,
        incluir_catmat: true,
      }),
    })

    if (normResponse.ok) {
      const normData = await normResponse.json() as {
        texto_normalizado: string
        catmat_sugeridos: Array<{ codigo: string; descricao: string; assertividade: number }>
        alertas: Array<{ tipo: string; mensagem: string }>
      }

      let content = `**Normalização de "${termo}":**\n`
      content += `→ ${normData.texto_normalizado}\n`

      if (normData.catmat_sugeridos.length > 0) {
        content += `\n**CATMAT sugeridos:**\n`
        for (const cat of normData.catmat_sugeridos.slice(0, 5)) {
          content += `• ${cat.codigo} — ${cat.descricao} (${Math.round(cat.assertividade * 100)}%)\n`
        }
      }

      if (normData.alertas.length > 0) {
        content += `\n**Alertas:**\n`
        for (const alerta of normData.alertas) {
          content += `⚠ ${alerta.mensagem}\n`
        }
      }

      return { role: 'assistant', content, pipeline_acionado: false }
    }
  } catch {
    // Falha na normalização — responder genericamente
  }

  return {
    role: 'assistant',
    content: `Normalização de "${termo}" — serviço temporariamente indisponível. Tente novamente.`,
    pipeline_acionado: false,
  }
}

// ─── Profile Learning ────────────────────────────────────────────────────────

async function learnFromMessage(
  userId: string,
  orgaoId: string,
  mensagem: string,
  env: Env,
): Promise<void> {
  try {
    // Usar KV para debounce (aprender a cada N mensagens)
    const countKey = `profile:learn:count:${userId}`
    const countStr = await env.CACHE.get(countKey)
    const count = parseInt(countStr || '0', 10)

    if (count < 4) {
      // Acumular mensagens
      const bufferKey = `profile:learn:buffer:${userId}`
      const bufferStr = await env.CACHE.get(bufferKey)
      const buffer: string[] = bufferStr ? JSON.parse(bufferStr) : []
      buffer.push(mensagem)
      await env.CACHE.put(bufferKey, JSON.stringify(buffer), { expirationTtl: 3600 })
      await env.CACHE.put(countKey, String(count + 1), { expirationTtl: 3600 })
    } else {
      // Flush: enviar todas as mensagens acumuladas para profile learning
      const bufferKey = `profile:learn:buffer:${userId}`
      const bufferStr = await env.CACHE.get(bufferKey)
      const buffer: string[] = bufferStr ? JSON.parse(bufferStr) : []
      buffer.push(mensagem)

      // Chamar profile learner
      const headers = {
        'Content-Type': 'application/json',
        'apikey': env.SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
      }

      // Chamada interna ao Workers — usar URL de produção ou env
      const workersUrl = env.WORKERS_URL || 'https://api.ata360.com.br'
      await fetch(`${workersUrl}/api/v1/profile/learn`, {
        method: 'POST',
        headers: {
          ...headers,
          'X-User-Id': userId,
          'X-Orgao-Id': orgaoId,
        },
        body: JSON.stringify({ textos: buffer }),
      })

      // Reset buffer
      await env.CACHE.delete(bufferKey)
      await env.CACHE.put(countKey, '0', { expirationTtl: 3600 })
    }
  } catch {
    // Profile learning é best-effort — não bloquear o chat
  }
}
