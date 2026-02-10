/**
 * ATA360 — Controle de Prazos e Alertas
 *
 * Monitora prazos em TODAS as fases, procedimentos, atos, artefatos e contratos.
 * Alertas em tempo real para membros, setores e entes públicos.
 *
 * Níveis de alerta:
 * - INFORMATIVO (azul): prazo distante
 * - ATENCAO (amarelo): 50% do tempo restante
 * - URGENTE (laranja): menos de 25% restante
 * - CRITICO (vermelho): vencido ou vencendo em 24h
 *
 * Destinatários:
 * - MEMBRO: alerta individual
 * - SETOR: alerta departamental
 * - ORGAO: alerta institucional
 * - GERAL: alertas sistêmicos
 *
 * @see Lei 14.133/2021 — prazos legais
 * @see DOCUMENTACAO.md — Seção 10 — Controle de Prazos
 */

import type { Env } from '../orchestrator/types'

// ─── Tipos ──────────────────────────────────────────────────────────────────

export interface Prazo {
  id: string
  orgao_id: string
  processo_id: string | null
  tipo: string
  descricao: string
  data_inicio: string
  data_limite: string
  data_alerta: string | null
  status: string
  destinatario_tipo: 'membro' | 'setor' | 'orgao' | 'geral'
  destinatario_id: string | null
  setor: string | null
  nivel_alerta: 'informativo' | 'atencao' | 'urgente' | 'critico'
  base_legal: string | null
  dias_legais: number | null
  dias_uteis: boolean
}

export interface Alerta {
  tipo: string
  nivel: 'informativo' | 'atencao' | 'urgente' | 'critico'
  titulo: string
  mensagem: string
  destinatario_tipo: string
  destinatario_id: string | null
  prazo_id: string | null
}

// ─── Prazos Legais Padrão (Lei 14.133/2021) ────────────────────────────────

export const PRAZOS_LEGAIS: Record<string, {
  descricao: string
  dias: number
  uteis: boolean
  base_legal: string
  fase: string
}> = {
  publicacao_pca: {
    descricao: 'Publicação do PCA no PNCP',
    dias: 365, // Até 31/dez do ano anterior
    uteis: false,
    base_legal: 'Dec. 10.947/2022, Art. 2°',
    fase: 'planejamento',
  },
  pesquisa_precos_validade: {
    descricao: 'Validade da pesquisa de preços',
    dias: 365,
    uteis: false,
    base_legal: 'IN SEGES/MGI 52/2025',
    fase: 'preparatoria',
  },
  publicacao_edital_pregao: {
    descricao: 'Publicação do edital (pregão)',
    dias: 8,
    uteis: true,
    base_legal: 'Lei 14.133/2021, Art. 55, I',
    fase: 'selecao',
  },
  publicacao_edital_concorrencia: {
    descricao: 'Publicação do edital (concorrência)',
    dias: 15,
    uteis: true,
    base_legal: 'Lei 14.133/2021, Art. 55, II',
    fase: 'selecao',
  },
  impugnacao_edital: {
    descricao: 'Prazo para impugnação do edital',
    dias: 3,
    uteis: true,
    base_legal: 'Lei 14.133/2021, Art. 164',
    fase: 'selecao',
  },
  recurso_administrativo: {
    descricao: 'Prazo para recurso administrativo',
    dias: 3,
    uteis: true,
    base_legal: 'Lei 14.133/2021, Art. 165, I',
    fase: 'selecao',
  },
  contrarrazoes: {
    descricao: 'Prazo para contrarrazões',
    dias: 3,
    uteis: true,
    base_legal: 'Lei 14.133/2021, Art. 165, II',
    fase: 'selecao',
  },
  homologacao: {
    descricao: 'Homologação do resultado',
    dias: 30,
    uteis: false,
    base_legal: 'Lei 14.133/2021, Art. 71',
    fase: 'contratacao',
  },
  assinatura_contrato: {
    descricao: 'Assinatura do contrato',
    dias: 30,
    uteis: false,
    base_legal: 'Lei 14.133/2021, Art. 90',
    fase: 'contratacao',
  },
  publicacao_pncp: {
    descricao: 'Publicação no PNCP',
    dias: 20,
    uteis: true,
    base_legal: 'Lei 14.133/2021, Art. 174',
    fase: 'contratacao',
  },
  vigencia_contrato: {
    descricao: 'Vigência do contrato',
    dias: 1825, // 5 anos (regra geral)
    uteis: false,
    base_legal: 'Lei 14.133/2021, Art. 105',
    fase: 'execucao',
  },
  prestacao_contas: {
    descricao: 'Prestação de contas',
    dias: 90,
    uteis: false,
    base_legal: 'Lei 14.133/2021, Art. 140',
    fase: 'encerramento',
  },
}

// ─── Criar Prazo ────────────────────────────────────────────────────────────

/**
 * Cria um prazo monitorado para um processo/contrato/ato.
 */
export async function criarPrazo(
  orgaoId: string,
  tipo: string,
  descricao: string,
  dataLimite: Date,
  env: Env,
  opcoes?: {
    processo_id?: string
    documento_tipo?: string
    destinatario_tipo?: 'membro' | 'setor' | 'orgao' | 'geral'
    destinatario_id?: string
    setor?: string
    base_legal?: string
    dias_legais?: number
    dias_uteis?: boolean
    recorrente?: boolean
    frequencia?: string
    criado_por?: string
  },
): Promise<string> {
  const headers = {
    'Content-Type': 'application/json',
    'apikey': env.SUPABASE_SERVICE_KEY,
    'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
    'Prefer': 'return=representation',
  }

  // Calcular data de alerta (50% do tempo)
  const agora = new Date()
  const tempoTotal = dataLimite.getTime() - agora.getTime()
  const dataAlerta = new Date(agora.getTime() + tempoTotal * 0.5)

  // Determinar nível de alerta inicial
  const nivelAlerta = calcularNivelAlerta(dataLimite)

  const body = {
    orgao_id: orgaoId,
    processo_id: opcoes?.processo_id || null,
    documento_tipo: opcoes?.documento_tipo || null,
    tipo,
    descricao,
    data_inicio: agora.toISOString(),
    data_limite: dataLimite.toISOString(),
    data_alerta: dataAlerta.toISOString(),
    status: 'pendente',
    destinatario_tipo: opcoes?.destinatario_tipo || 'membro',
    destinatario_id: opcoes?.destinatario_id || null,
    setor: opcoes?.setor || null,
    nivel_alerta: nivelAlerta,
    base_legal: opcoes?.base_legal || null,
    dias_legais: opcoes?.dias_legais || null,
    dias_uteis: opcoes?.dias_uteis ?? true,
    recorrente: opcoes?.recorrente || false,
    frequencia: opcoes?.frequencia || null,
    criado_por: opcoes?.criado_por || null,
  }

  const response = await fetch(`${env.SUPABASE_URL}/rest/v1/prazos`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })

  if (response.ok) {
    const [prazo] = await response.json() as Array<{ id: string }>
    return prazo?.id || ''
  }

  return ''
}

// ─── Criar Prazos Automáticos para Processo ────────────────────────────────

/**
 * Cria prazos automáticos quando um processo é iniciado.
 * Baseado na modalidade e fase do processo.
 */
export async function criarPrazosProcesso(
  processoId: string,
  orgaoId: string,
  modalidade: string,
  criadoPor: string,
  env: Env,
): Promise<number> {
  let prazos_criados = 0
  const agora = new Date()

  // Prazos da fase preparatória
  const prazosPorModalidade: Record<string, string[]> = {
    pregao: ['pesquisa_precos_validade', 'publicacao_edital_pregao', 'impugnacao_edital', 'recurso_administrativo', 'homologacao', 'assinatura_contrato', 'publicacao_pncp'],
    dispensa: ['pesquisa_precos_validade', 'publicacao_pncp'],
    concorrencia: ['pesquisa_precos_validade', 'publicacao_edital_concorrencia', 'impugnacao_edital', 'recurso_administrativo', 'homologacao', 'assinatura_contrato', 'publicacao_pncp'],
    arp: ['pesquisa_precos_validade', 'publicacao_edital_pregao', 'impugnacao_edital', 'recurso_administrativo', 'homologacao', 'assinatura_contrato', 'publicacao_pncp', 'vigencia_contrato'],
    credenciamento: ['pesquisa_precos_validade', 'publicacao_pncp'],
  }

  const tipos = prazosPorModalidade[modalidade] || prazosPorModalidade['pregao']

  for (const tipo of tipos) {
    const prazoLegal = PRAZOS_LEGAIS[tipo]
    if (!prazoLegal) continue

    const dataLimite = new Date(agora)
    if (prazoLegal.uteis) {
      // Adicionar dias úteis (aproximação: +40% para fins de semana/feriados)
      dataLimite.setDate(dataLimite.getDate() + Math.ceil(prazoLegal.dias * 1.4))
    } else {
      dataLimite.setDate(dataLimite.getDate() + prazoLegal.dias)
    }

    await criarPrazo(orgaoId, tipo, prazoLegal.descricao, dataLimite, env, {
      processo_id: processoId,
      destinatario_tipo: 'membro',
      destinatario_id: criadoPor,
      base_legal: prazoLegal.base_legal,
      dias_legais: prazoLegal.dias,
      dias_uteis: prazoLegal.uteis,
      criado_por: criadoPor,
    })

    prazos_criados++
  }

  return prazos_criados
}

// ─── Verificar Prazos (Cron) ────────────────────────────────────────────────

/**
 * Cron job que verifica todos os prazos e dispara alertas.
 * Executado a cada hora.
 */
export async function verificarPrazos(
  supabaseUrl: string,
  supabaseKey: string,
): Promise<{
  total_verificados: number
  alertas_disparados: number
  vencidos: number
  urgentes: number
}> {
  const headers = {
    'Content-Type': 'application/json',
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`,
  }

  // 1. Buscar prazos ativos (não concluídos, não cancelados)
  const response = await fetch(
    `${supabaseUrl}/rest/v1/prazos?status=in.(pendente,em_andamento,proximo_vencimento)&select=*&order=data_limite.asc&limit=500`,
    { headers },
  )

  if (!response.ok) return { total_verificados: 0, alertas_disparados: 0, vencidos: 0, urgentes: 0 }

  const prazos = await response.json() as Prazo[]
  let alertasDisparados = 0
  let vencidos = 0
  let urgentes = 0

  for (const prazo of prazos) {
    const dataLimite = new Date(prazo.data_limite)
    const novoNivel = calcularNivelAlerta(dataLimite)
    const novoStatus = calcularStatus(dataLimite)

    // Verificar se mudou de nível
    if (novoNivel !== prazo.nivel_alerta || novoStatus !== prazo.status) {
      // Atualizar prazo
      await fetch(`${supabaseUrl}/rest/v1/prazos?id=eq.${prazo.id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          nivel_alerta: novoNivel,
          status: novoStatus,
          updated_at: new Date().toISOString(),
        }),
      })

      // Disparar alerta se nível subiu
      if (nivelMaior(novoNivel, prazo.nivel_alerta)) {
        await dispararAlerta({
          tipo: 'prazo',
          nivel: novoNivel,
          titulo: `Prazo: ${prazo.descricao}`,
          mensagem: gerarMensagemAlerta(prazo, novoNivel, dataLimite),
          destinatario_tipo: prazo.destinatario_tipo,
          destinatario_id: prazo.destinatario_id,
          prazo_id: prazo.id,
        }, prazo.orgao_id, supabaseUrl, supabaseKey)

        alertasDisparados++
      }
    }

    if (novoNivel === 'critico') vencidos++
    if (novoNivel === 'urgente') urgentes++
  }

  return {
    total_verificados: prazos.length,
    alertas_disparados: alertasDisparados,
    vencidos,
    urgentes,
  }
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function calcularNivelAlerta(dataLimite: Date): 'informativo' | 'atencao' | 'urgente' | 'critico' {
  const agora = new Date()
  const msRestante = dataLimite.getTime() - agora.getTime()
  const horasRestantes = msRestante / (1000 * 60 * 60)

  if (horasRestantes <= 0) return 'critico'
  if (horasRestantes <= 24) return 'critico'

  // Calcular percentual restante (baseado em 30 dias como referência)
  const diasRestantes = horasRestantes / 24
  if (diasRestantes <= 3) return 'urgente'
  if (diasRestantes <= 7) return 'atencao'
  return 'informativo'
}

function calcularStatus(dataLimite: Date): string {
  const agora = new Date()
  const msRestante = dataLimite.getTime() - agora.getTime()
  const horasRestantes = msRestante / (1000 * 60 * 60)

  if (horasRestantes <= 0) return 'vencido'
  if (horasRestantes <= 24) return 'vencendo_hoje'
  if (horasRestantes <= 72) return 'proximo_vencimento'
  return 'em_andamento'
}

function nivelMaior(
  novo: 'informativo' | 'atencao' | 'urgente' | 'critico',
  atual: string,
): boolean {
  const ordem = { informativo: 0, atencao: 1, urgente: 2, critico: 3 }
  return (ordem[novo] || 0) > (ordem[atual as keyof typeof ordem] || 0)
}

function gerarMensagemAlerta(
  prazo: Prazo,
  nivel: string,
  dataLimite: Date,
): string {
  const diasRestantes = Math.ceil((dataLimite.getTime() - Date.now()) / (1000 * 60 * 60 * 24))

  switch (nivel) {
    case 'critico':
      if (diasRestantes <= 0) {
        return `PRAZO VENCIDO: ${prazo.descricao}. Data limite: ${dataLimite.toLocaleDateString('pt-BR')}. ${prazo.base_legal || ''}`
      }
      return `PRAZO VENCE HOJE: ${prazo.descricao}. ${prazo.base_legal || ''}`
    case 'urgente':
      return `PRAZO URGENTE: ${prazo.descricao} vence em ${diasRestantes} dia(s). ${prazo.base_legal || ''}`
    case 'atencao':
      return `Atenção: ${prazo.descricao} vence em ${diasRestantes} dias. ${prazo.base_legal || ''}`
    default:
      return `Informativo: ${prazo.descricao} tem prazo até ${dataLimite.toLocaleDateString('pt-BR')}. ${prazo.base_legal || ''}`
  }
}

async function dispararAlerta(
  alerta: Alerta,
  orgaoId: string,
  supabaseUrl: string,
  supabaseKey: string,
): Promise<void> {
  const headers = {
    'Content-Type': 'application/json',
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`,
    'Prefer': 'return=minimal',
  }

  await fetch(`${supabaseUrl}/rest/v1/alertas`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      orgao_id: orgaoId,
      prazo_id: alerta.prazo_id,
      tipo: alerta.tipo,
      nivel: alerta.nivel,
      titulo: alerta.titulo,
      mensagem: alerta.mensagem,
      destinatario_tipo: alerta.destinatario_tipo,
      destinatario_id: alerta.destinatario_id,
      canal: 'sistema',
    }),
  })
}
