/**
 * ATA360 — Orquestrador: Pipeline Automático
 *
 * O coração da integração. runPipeline() executa a sequência
 * completa e SÓ PARA em 2 pontos:
 *   1. SUGESTAO_ACMA — humano revisa texto sugerido
 *   2. AGUARDANDO_DECISAO — humano decide após auditoria
 *
 * Tudo entre esses pontos é 100% automático.
 * Cada documento na trilha passa pelo ciclo completo.
 * Ao finalizar um doc, avança para o próximo automaticamente.
 *
 * @see Spec v8 Part 20.3 — Fluxo Cíclico
 * @see Spec v8 Part 20.5 — Limites de Iteração
 */

import type {
  ProcessState,
  PipelineTrigger,
  PipelineResult,
  ProcessoRow,
  Env,
} from './types'
import { PROCESS_STATES, USER_DECISIONS } from './types'
import {
  transition,
  loadProcesso,
  updateProcesso,
  saveMessage,
  enforceIterationLimits,
  decrementarSugestoes,
  calcularSeloAprovado,
  mapDecisionToState,
} from './engine'
import {
  callInsightEngine,
  callACMA,
  callDesignLaw,
  callAuditor,
} from './agents'
import { initializeTrail, advanceTrail, getTrailStatus } from './trail'

// ─── Pipeline Principal ──────────────────────────────────────────────────────

/**
 * Executa pipeline automático.
 * Retorna resultado sanitizado para o BFF/frontend.
 */
export async function runPipeline(
  processoId: string,
  trigger: PipelineTrigger,
  userId: string,
  orgaoId: string,
  env: Env,
): Promise<PipelineResult> {
  // 1. Carregar processo atual
  const processo = await loadProcesso(processoId, env)
  if (!processo) {
    return {
      sucesso: false,
      estado: PROCESS_STATES.RASCUNHO,
      mensagem: 'Processo não encontrado',
      erro: `Processo ${processoId} não existe`,
    }
  }

  const estado = processo.status as ProcessState

  try {
    // 2. Despachar com base no estado atual + trigger
    switch (estado) {
      case PROCESS_STATES.RASCUNHO:
        return await handleRascunho(processo, userId, orgaoId, env)

      case PROCESS_STATES.SUGESTAO_ACMA:
        if (trigger.tipo === 'decisao' && trigger.decisao === USER_DECISIONS.APROVAR) {
          return await handleTextoAprovado(processo, userId, orgaoId, env)
        }
        if (trigger.tipo === 'decisao' && trigger.decisao === USER_DECISIONS.DESCARTAR) {
          return await handleDescartar(processo, userId, orgaoId, env)
        }
        // Texto aprovado (usuário aceitou a sugestão)
        return {
          sucesso: true,
          estado: PROCESS_STATES.SUGESTAO_ACMA,
          sugestao_acma: sanitizeSugestao(processo.acma_sugestao_atual),
          insight_cards: processo.insight_context?.cards,
          mensagem: 'Aguardando revisão da sugestão ACMA',
        }

      case PROCESS_STATES.TEXTO_APROVADO:
        return await handleGerarEAuditar(processo, userId, orgaoId, env)

      case PROCESS_STATES.AGUARDANDO_DECISAO:
        if (trigger.tipo === 'decisao' && trigger.decisao) {
          return await handleDecisao(processo, trigger.decisao, trigger.texto_editado, userId, orgaoId, env)
        }
        return {
          sucesso: true,
          estado: PROCESS_STATES.AGUARDANDO_DECISAO,
          parecer_auditor: sanitizeParecer(processo.auditor_parecer_atual),
          artefato: processo.documento_url ? {
            url: processo.documento_url,
            hash: processo.documento_hash || '',
            versao: processo.documento_versao,
          } : undefined,
          trilha: processo.trilha,
          mensagem: 'Aguardando sua decisão',
        }

      case PROCESS_STATES.EDITANDO:
        if (trigger.texto_editado) {
          return await handleGerarEAuditar(processo, userId, orgaoId, env, trigger.texto_editado)
        }
        return {
          sucesso: true,
          estado: PROCESS_STATES.EDITANDO,
          mensagem: 'Modo edição ativo. Envie o texto editado.',
        }

      case PROCESS_STATES.FINALIZADO:
        return {
          sucesso: true,
          estado: PROCESS_STATES.FINALIZADO,
          trilha: processo.trilha,
          proximo_documento: processo.proximo_sugerido,
          mensagem: processo.proximo_sugerido
            ? `Documento finalizado! Próximo: ${processo.proximo_sugerido}`
            : 'Processo concluído! Todos os documentos da trilha foram gerados.',
        }

      case PROCESS_STATES.DESCARTADO:
        return {
          sucesso: true,
          estado: PROCESS_STATES.DESCARTADO,
          mensagem: 'Processo descartado.',
        }

      default:
        // Estados intermediários (COLETANDO_DADOS, GERANDO_DOCUMENTO, etc.)
        // São transitórios — não deveriam persistir
        return {
          sucesso: true,
          estado,
          mensagem: `Processando... (estado: ${estado})`,
        }
    }
  } catch (error) {
    const mensagemErro = error instanceof Error ? error.message : 'Erro desconhecido'
    return {
      sucesso: false,
      estado,
      mensagem: 'Erro no pipeline',
      erro: mensagemErro,
    }
  }
}

// ─── Stage Handlers ──────────────────────────────────────────────────────────

/**
 * RASCUNHO → COLETANDO_DADOS → SUGESTAO_ACMA
 * Automático: coleta dados + gera sugestão + PARA
 */
async function handleRascunho(
  processo: ProcessoRow,
  userId: string,
  orgaoId: string,
  env: Env,
): Promise<PipelineResult> {
  const documentoTipo = processo.documento_atual || processo.trilha[processo.trilha_posicao]?.tipo || 'DFD'

  // 1. RASCUNHO → COLETANDO_DADOS
  await transition(processo.id, PROCESS_STATES.RASCUNHO, PROCESS_STATES.COLETANDO_DADOS, env, userId)

  // 2. Chamar Insight Engine
  await saveMessage(processo.id, orgaoId, 'orquestrador', 'Coletando dados oficiais...', PROCESS_STATES.COLETANDO_DADOS, env, { agente: 'insight_engine' })

  const insightContext = await callInsightEngine(
    processo.id,
    processo.objeto,
    documentoTipo,
    orgaoId,
    env,
  )

  // Salvar insight context no processo
  await updateProcesso(processo.id, {
    insight_context: insightContext,
    documento_atual: documentoTipo,
  } as Partial<ProcessoRow>, env)

  // Registrar mensagem do Insight Engine
  await saveMessage(processo.id, orgaoId, 'insight', `Dados coletados: ${insightContext.cards.length} cards de contexto`, PROCESS_STATES.COLETANDO_DADOS, env, {
    insight_cards: insightContext.cards,
    agente: 'insight_engine',
  })

  // 3. COLETANDO_DADOS → SUGESTAO_ACMA
  await transition(processo.id, PROCESS_STATES.COLETANDO_DADOS, PROCESS_STATES.SUGESTAO_ACMA, env, userId)

  // 4. Chamar ACMA
  await saveMessage(processo.id, orgaoId, 'orquestrador', `Gerando sugestão para ${documentoTipo}...`, PROCESS_STATES.SUGESTAO_ACMA, env, { agente: 'acma' })

  const sugestao = await callACMA(
    processo.id,
    documentoTipo,
    'completo', // Seção completa por padrão
    insightContext,
    processo.iteracao,
    env,
  )

  // Salvar sugestão no processo
  await updateProcesso(processo.id, {
    acma_sugestao_atual: sugestao,
  } as Partial<ProcessoRow>, env)

  // Registrar mensagem ACMA (sanitizada — Part 19)
  await saveMessage(processo.id, orgaoId, 'acma', sugestao.texto_sugerido, PROCESS_STATES.SUGESTAO_ACMA, env, {
    agente: 'acma',
    metadata: {
      prompt_hash: sugestao.prompt_hash,
      modelo: sugestao.modelo_usado,
      tier: sugestao.tier,
      tokens_input: sugestao.tokens_input,
      tokens_output: sugestao.tokens_output,
      latencia_ms: sugestao.latencia_ms,
      iteracao: sugestao.iteracao,
    },
  })

  // ← PONTO DE PARADA 1: retornar sugestão ao humano
  return {
    sucesso: true,
    estado: PROCESS_STATES.SUGESTAO_ACMA,
    sugestao_acma: {
      texto_sugerido: sugestao.texto_sugerido,
      resumo: sugestao.resumo,
      secoes_geradas: sugestao.secoes_geradas,
      iteracao: sugestao.iteracao,
    },
    insight_cards: insightContext.cards,
    trilha: await getTrailStatus(processo.id, env),
    mensagem: `Sugestão gerada para ${documentoTipo}. Revise e aprove ou solicite alterações.`,
  }
}

/**
 * Transiciona para TEXTO_APROVADO quando o usuário aprova a sugestão ACMA.
 */
async function handleTextoAprovado(
  processo: ProcessoRow,
  userId: string,
  orgaoId: string,
  env: Env,
): Promise<PipelineResult> {
  // SUGESTAO_ACMA → TEXTO_APROVADO
  await transition(processo.id, PROCESS_STATES.SUGESTAO_ACMA, PROCESS_STATES.TEXTO_APROVADO, env, userId, { decisao: 'APROVAR' })

  await saveMessage(processo.id, orgaoId, 'user', 'Texto aprovado', PROCESS_STATES.TEXTO_APROVADO, env)

  // Continuar automaticamente: gerar documento + auditar
  const processoAtualizado = await loadProcesso(processo.id, env)
  if (!processoAtualizado) {
    return { sucesso: false, estado: PROCESS_STATES.TEXTO_APROVADO, mensagem: 'Erro ao carregar processo', erro: 'Processo não encontrado' }
  }

  return await handleGerarEAuditar(processoAtualizado, userId, orgaoId, env)
}

/**
 * TEXTO_APROVADO → GERANDO_DOCUMENTO → GERADO → AUDITANDO → AUDITADO → AGUARDANDO_DECISAO
 * Automático: gera PDF + audita + PARA
 */
async function handleGerarEAuditar(
  processo: ProcessoRow,
  userId: string,
  orgaoId: string,
  env: Env,
  textoEditado?: string,
): Promise<PipelineResult> {
  const documentoTipo = processo.documento_atual || 'DFD'
  const textoAprovado = textoEditado || processo.acma_sugestao_atual?.texto_sugerido || ''
  const versao = processo.documento_versao + 1

  // Determinar estado inicial correto
  const estadoInicial = processo.status as ProcessState
  const estadoDestino = PROCESS_STATES.GERANDO_DOCUMENTO

  // Transição para GERANDO_DOCUMENTO
  if (estadoInicial === PROCESS_STATES.TEXTO_APROVADO || estadoInicial === PROCESS_STATES.EDITANDO) {
    await transition(processo.id, estadoInicial, estadoDestino, env, userId)
  }

  // 1. Chamar DESIGN_LAW
  await saveMessage(processo.id, orgaoId, 'orquestrador', `Gerando documento ${documentoTipo} v${versao}...`, PROCESS_STATES.GERANDO_DOCUMENTO, env, { agente: 'design_law' })

  const insightContext = processo.insight_context || {
    processo_id: processo.id,
    objeto: processo.objeto,
    documento_tipo: documentoTipo,
    cards: [],
    precos_referencia: null,
    dados_municipio: null,
    sancoes: [],
    jurisprudencia: [],
    recursos_disponiveis: [],
    normativos_aplicaveis: [],
    perfil_usuario: null,
    parametros_orgao: null,
    coletado_em: new Date().toISOString(),
  }

  const artefato = await callDesignLaw(
    processo.id,
    documentoTipo,
    textoAprovado,
    insightContext,
    versao,
    env,
  )

  // Salvar artefato no processo
  await updateProcesso(processo.id, {
    documento_url: artefato.url,
    documento_hash: artefato.hash_sha256,
    documento_versao: artefato.versao,
  } as Partial<ProcessoRow>, env)

  // Registrar mensagem DESIGN_LAW
  await saveMessage(processo.id, orgaoId, 'design_law', `Documento ${documentoTipo} v${versao} gerado`, PROCESS_STATES.GERANDO_DOCUMENTO, env, {
    artefato: {
      tipo: documentoTipo,
      url: artefato.url,
      hash: artefato.hash_sha256,
      versao: artefato.versao,
    },
    agente: 'design_law',
  })

  // GERANDO_DOCUMENTO → GERADO
  await transition(processo.id, PROCESS_STATES.GERANDO_DOCUMENTO, PROCESS_STATES.GERADO, env, userId)

  // GERADO → AUDITANDO
  await transition(processo.id, PROCESS_STATES.GERADO, PROCESS_STATES.AUDITANDO, env, userId)

  // 2. Chamar AUDITOR
  await saveMessage(processo.id, orgaoId, 'orquestrador', `Auditando ${documentoTipo}...`, PROCESS_STATES.AUDITANDO, env, { agente: 'auditor' })

  const parecer = await callAuditor(
    processo.id,
    documentoTipo,
    artefato.url,
    artefato.hash_sha256,
    insightContext,
    env,
  )

  // Salvar parecer no processo
  await updateProcesso(processo.id, {
    auditor_parecer_atual: parecer,
    selo_aprovado: parecer.selo_aprovado,
  } as Partial<ProcessoRow>, env)

  // Registrar mensagem AUDITOR (sanitizada — Part 19)
  await saveMessage(processo.id, orgaoId, 'auditor', `Parecer: ${parecer.veredicto} (score: ${parecer.score}/100)`, PROCESS_STATES.AUDITANDO, env, {
    agente: 'auditor',
    metadata: {
      veredicto: parecer.veredicto,
      score: parecer.score,
      selo_aprovado: parecer.selo_aprovado,
      thresholds_usados: parecer.thresholds_usados,
      modelo: parecer.modelo_usado,
      tokens_input: parecer.tokens_input,
      tokens_output: parecer.tokens_output,
      latencia_ms: parecer.latencia_ms,
    },
  })

  // AUDITANDO → AUDITADO → AGUARDANDO_DECISAO
  await transition(processo.id, PROCESS_STATES.AUDITANDO, PROCESS_STATES.AUDITADO, env, userId)
  await transition(processo.id, PROCESS_STATES.AUDITADO, PROCESS_STATES.AGUARDANDO_DECISAO, env, userId)

  // ← PONTO DE PARADA 2: retornar parecer ao humano
  return {
    sucesso: true,
    estado: PROCESS_STATES.AGUARDANDO_DECISAO,
    parecer_auditor: {
      veredicto: parecer.veredicto,
      score: parecer.score,
      checklist: parecer.checklist_publico,
      selo_aprovado: parecer.selo_aprovado,
      iteracao: parecer.iteracao,
    },
    artefato: {
      url: artefato.url,
      hash: artefato.hash_sha256,
      versao: artefato.versao,
    },
    insight_cards: insightContext.cards,
    trilha: await getTrailStatus(processo.id, env),
    mensagem: `Auditoria concluída: ${parecer.veredicto}. ${parecer.selo_aprovado ? 'Selo aprovado!' : 'Revise os achados.'}`,
  }
}

/**
 * AGUARDANDO_DECISAO → processa decisão do usuário
 */
async function handleDecisao(
  processo: ProcessoRow,
  decisao: string,
  textoEditado: string | undefined,
  userId: string,
  orgaoId: string,
  env: Env,
): Promise<PipelineResult> {
  const limites = enforceIterationLimits(processo)
  const mapping = mapDecisionToState(decisao as any, limites)

  if (mapping.erro) {
    return {
      sucesso: false,
      estado: PROCESS_STATES.AGUARDANDO_DECISAO,
      mensagem: mapping.erro,
      erro: mapping.erro,
    }
  }

  // Registrar decisão
  await saveMessage(processo.id, orgaoId, 'user', `Decisão: ${decisao}`, PROCESS_STATES.AGUARDANDO_DECISAO, env)

  switch (decisao) {
    case USER_DECISIONS.APROVAR: {
      // Recalcular selo com decisão do usuário
      const veredicto = processo.auditor_parecer_atual?.veredicto || 'CONFORME'
      const seloFinal = calcularSeloAprovado(veredicto as any, USER_DECISIONS.APROVAR)

      await updateProcesso(processo.id, { selo_aprovado: seloFinal } as Partial<ProcessoRow>, env)

      // AGUARDANDO_DECISAO → FINALIZADO
      await transition(processo.id, PROCESS_STATES.AGUARDANDO_DECISAO, PROCESS_STATES.FINALIZADO, env, userId, {
        decisao: 'APROVAR',
        selo_aprovado: seloFinal,
      })

      // Avançar trilha
      const { proximo, posicao } = await advanceTrail(processo.id, env)

      if (proximo) {
        // Ainda tem documentos na trilha — resetar para RASCUNHO do próximo
        await updateProcesso(processo.id, {
          status: PROCESS_STATES.RASCUNHO,
          documento_atual: proximo,
          trilha_posicao: posicao,
          iteracao: 1,
          sugestoes_restantes: 3,
          reauditorias_restantes: 5,
          acma_sugestao_atual: null,
          auditor_parecer_atual: null,
          documento_url: null,
          documento_hash: null,
          documento_versao: 0,
          proximo_sugerido: proximo,
        } as Partial<ProcessoRow>, env)

        await saveMessage(processo.id, orgaoId, 'orquestrador',
          `✓ ${processo.documento_atual} finalizado com selo ${seloFinal ? 'aprovado' : 'ausente'}. Próximo: ${proximo}`,
          PROCESS_STATES.RASCUNHO, env, { agente: 'orquestrador' },
        )

        // Auto-loop: iniciar pipeline para o próximo documento
        const processoNovo = await loadProcesso(processo.id, env)
        if (processoNovo) {
          return await handleRascunho(processoNovo, userId, orgaoId, env)
        }
      }

      // Trilha completa
      return {
        sucesso: true,
        estado: PROCESS_STATES.FINALIZADO,
        trilha: await getTrailStatus(processo.id, env),
        proximo_documento: null,
        mensagem: 'Processo concluído! Todos os documentos da trilha foram gerados e aprovados.',
      }
    }

    case USER_DECISIONS.EDITAR: {
      // AGUARDANDO_DECISAO → EDITANDO
      await transition(processo.id, PROCESS_STATES.AGUARDANDO_DECISAO, PROCESS_STATES.EDITANDO, env, userId, { decisao: 'EDITAR' })

      // Decrementar reauditorias
      await decrementarSugestoes(processo.id, 'reauditorias_restantes', env)

      if (textoEditado) {
        // Texto editado fornecido — continuar automaticamente
        const processoAtualizado = await loadProcesso(processo.id, env)
        if (processoAtualizado) {
          return await handleGerarEAuditar(processoAtualizado, userId, orgaoId, env, textoEditado)
        }
      }

      return {
        sucesso: true,
        estado: PROCESS_STATES.EDITANDO,
        mensagem: 'Modo edição ativo. Envie o texto editado para regenerar o documento.',
      }
    }

    case USER_DECISIONS.NOVA_SUGESTAO: {
      if (!limites.pode_nova_sugestao) {
        return {
          sucesso: false,
          estado: PROCESS_STATES.AGUARDANDO_DECISAO,
          mensagem: `Limite de sugestões atingido (máx. 3). Restam ${limites.sugestoes_restantes}.`,
          erro: 'LIMITE_SUGESTOES',
        }
      }

      // AGUARDANDO_DECISAO → SUGESTAO_ACMA
      await transition(processo.id, PROCESS_STATES.AGUARDANDO_DECISAO, PROCESS_STATES.SUGESTAO_ACMA, env, userId, { decisao: 'NOVA_SUGESTAO' })

      // Decrementar sugestões
      await decrementarSugestoes(processo.id, 'sugestoes_restantes', env)

      // Chamar ACMA novamente com nova iteração
      const insightContext = processo.insight_context || {
        processo_id: processo.id,
        objeto: processo.objeto,
        documento_tipo: processo.documento_atual || 'DFD',
        cards: [],
        precos_referencia: null,
        dados_municipio: null,
        sancoes: [],
        jurisprudencia: [],
        recursos_disponiveis: [],
        normativos_aplicaveis: [],
        perfil_usuario: null,
        parametros_orgao: null,
        coletado_em: new Date().toISOString(),
      }

      const sugestao = await callACMA(
        processo.id,
        processo.documento_atual || 'DFD',
        'completo',
        insightContext,
        processo.iteracao + 1,
        env,
      )

      await updateProcesso(processo.id, {
        acma_sugestao_atual: sugestao,
        iteracao: processo.iteracao + 1,
      } as Partial<ProcessoRow>, env)

      await saveMessage(processo.id, orgaoId, 'acma', sugestao.texto_sugerido, PROCESS_STATES.SUGESTAO_ACMA, env, {
        agente: 'acma',
        metadata: {
          prompt_hash: sugestao.prompt_hash,
          iteracao: sugestao.iteracao,
        },
      })

      return {
        sucesso: true,
        estado: PROCESS_STATES.SUGESTAO_ACMA,
        sugestao_acma: {
          texto_sugerido: sugestao.texto_sugerido,
          resumo: sugestao.resumo,
          secoes_geradas: sugestao.secoes_geradas,
          iteracao: sugestao.iteracao,
        },
        insight_cards: insightContext.cards,
        trilha: await getTrailStatus(processo.id, env),
        mensagem: `Nova sugestão (iteração ${sugestao.iteracao}). Restam ${limites.sugestoes_restantes - 1} tentativa(s).`,
      }
    }

    case USER_DECISIONS.PROSSEGUIR: {
      // selo_aprovado = false (silencioso, Part 19.10.3)
      await updateProcesso(processo.id, { selo_aprovado: false } as Partial<ProcessoRow>, env)

      // AGUARDANDO_DECISAO → FINALIZADO
      await transition(processo.id, PROCESS_STATES.AGUARDANDO_DECISAO, PROCESS_STATES.FINALIZADO, env, userId, {
        decisao: 'PROSSEGUIR',
        selo_aprovado: false,
      })

      // Avançar trilha
      const { proximo, posicao } = await advanceTrail(processo.id, env)

      if (proximo) {
        await updateProcesso(processo.id, {
          status: PROCESS_STATES.RASCUNHO,
          documento_atual: proximo,
          trilha_posicao: posicao,
          iteracao: 1,
          sugestoes_restantes: 3,
          reauditorias_restantes: 5,
          acma_sugestao_atual: null,
          auditor_parecer_atual: null,
          documento_url: null,
          documento_hash: null,
          documento_versao: 0,
          proximo_sugerido: proximo,
        } as Partial<ProcessoRow>, env)

        // Auto-loop
        const processoNovo = await loadProcesso(processo.id, env)
        if (processoNovo) {
          return await handleRascunho(processoNovo, userId, orgaoId, env)
        }
      }

      return {
        sucesso: true,
        estado: PROCESS_STATES.FINALIZADO,
        trilha: await getTrailStatus(processo.id, env),
        mensagem: 'Prosseguindo sem selo de qualidade.',
      }
    }

    case USER_DECISIONS.DESCARTAR:
      return await handleDescartar(processo, userId, orgaoId, env)

    default:
      return {
        sucesso: false,
        estado: PROCESS_STATES.AGUARDANDO_DECISAO,
        mensagem: `Decisão não reconhecida: ${decisao}`,
        erro: 'DECISAO_INVALIDA',
      }
  }
}

/**
 * Descarta processo.
 */
async function handleDescartar(
  processo: ProcessoRow,
  userId: string,
  orgaoId: string,
  env: Env,
): Promise<PipelineResult> {
  const estadoAtual = processo.status as ProcessState
  await transition(processo.id, estadoAtual, PROCESS_STATES.DESCARTADO, env, userId, { decisao: 'DESCARTAR' })

  await saveMessage(processo.id, orgaoId, 'user', 'Processo descartado', PROCESS_STATES.DESCARTADO, env)

  return {
    sucesso: true,
    estado: PROCESS_STATES.DESCARTADO,
    mensagem: 'Processo descartado.',
  }
}

// ─── Sanitization Helpers ────────────────────────────────────────────────────
// Part 19: remover dados internos antes de enviar ao frontend

function sanitizeSugestao(sugestao: ProcessoRow['acma_sugestao_atual']): PipelineResult['sugestao_acma'] {
  if (!sugestao) return undefined
  return {
    texto_sugerido: sugestao.texto_sugerido,
    resumo: sugestao.resumo,
    secoes_geradas: sugestao.secoes_geradas,
    iteracao: sugestao.iteracao,
  }
}

function sanitizeParecer(parecer: ProcessoRow['auditor_parecer_atual']): PipelineResult['parecer_auditor'] {
  if (!parecer) return undefined
  return {
    veredicto: parecer.veredicto,
    score: parecer.score,
    checklist: parecer.checklist_publico,
    selo_aprovado: parecer.selo_aprovado,
    iteracao: parecer.iteracao,
  }
}
