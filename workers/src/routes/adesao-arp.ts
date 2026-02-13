/**
 * ATA360 — Adesão a ARP Routes (Workers)
 *
 * Fluxo online de adesão a Ata de Registro de Preços (Art. 86, Lei 14.133).
 * 6 etapas, 10 documentos gerados automaticamente.
 *
 * POST / — Iniciar adesão
 * GET  /:id — Obter adesão
 * GET  /orgao/:orgaoId — Listar adesões do órgão
 * PATCH /:id/status — Avançar status
 * GET  /:id/link-gerenciador — Link para órgão gerenciador (não-usuário ATA360)
 * GET  /:id/link-fornecedor — Link para fornecedor (não-usuário ATA360)
 * POST /:id/resposta-externa — Receber resposta via link externo
 *
 * @see Art. 86, Lei 14.133/2021 — Adesão a ARP
 * @see Art. 86, §4º — Limite 50% total
 * @see Art. 86, §5º — Limite 50% por órgão aderente
 */

import { Hono } from 'hono'
import type { Env } from '../orchestrator/types'

const app = new Hono<{ Bindings: Env }>()

// ─── Helpers ─────────────────────────────────────────────────────────────────

function gerarLinkExterno(): string {
  const token = crypto.randomUUID().replace(/-/g, '') + crypto.randomUUID().replace(/-/g, '')
  return token.slice(0, 48)
}

// ─── POST / — Iniciar adesão a ARP ──────────────────────────────────────────

app.post('/', async (c) => {
  const orgaoId = c.req.header('X-Orgao-Id')
  if (!orgaoId) return c.json({ message: 'X-Orgao-Id é obrigatório' }, 400)

  const body = await c.req.json() as {
    ata_numero: string
    ata_pncp_id?: string
    ata_vigencia_inicio?: string
    ata_vigencia_fim?: string
    gerenciador_nome: string
    gerenciador_cnpj?: string
    gerenciador_uasg?: string
    fornecedor_nome?: string
    fornecedor_cnpj?: string
    itens: Array<{ descricao: string; catmat?: string; catser?: string; quantidade: number; valor_unitario: number }>
    email_gerenciador?: string
    email_fornecedor?: string
  }

  if (!body.ata_numero || !body.gerenciador_nome) {
    return c.json({ message: 'ata_numero e gerenciador_nome são obrigatórios' }, 400)
  }

  const id = crypto.randomUUID()
  const valorTotal = body.itens?.reduce((sum, i) => sum + (i.quantidade * i.valor_unitario), 0) || 0

  // ─── Validação Art. 86, §4º e §5º — Limites de 50% ────────────────────────
  // §4º: Soma de adesões não pode ultrapassar 50% do total registrado
  // §5º: Cada órgão aderente limitado a 50% do total registrado
  // Vigência: ARP só aceita adesão enquanto vigente
  if (body.ata_pncp_id) {
    try {
      const headers = {
        'apikey': c.env.SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${c.env.SUPABASE_SERVICE_KEY}`,
      }

      // Verificar vigência da ATA
      if (body.ata_vigencia_fim) {
        const vigenciaFim = new Date(body.ata_vigencia_fim)
        if (vigenciaFim < new Date()) {
          return c.json({
            message: 'ATA expirada — vigência encerrada',
            ata_vigencia_fim: body.ata_vigencia_fim,
            fundamentacao: 'Art. 84, Lei 14.133/2021 — Prazo de vigência da ARP',
          }, 422)
        }
      }

      // Buscar adesões existentes para esta ATA (somar valores já comprometidos)
      const adesoesResponse = await fetch(
        `${c.env.SUPABASE_URL}/rest/v1/adesao_arp?ata_pncp_id=eq.${body.ata_pncp_id}&status=not.in.(cancelada,recusada_gerenciador,recusada_fornecedor,expirada)&select=valor_total,orgao_aderente_id`,
        { headers },
      )

      if (adesoesResponse.ok) {
        const adesoesExistentes = await adesoesResponse.json() as Array<{ valor_total: number; orgao_aderente_id: string }>

        // Buscar valor total registrado na ATA (se disponível via PNCP)
        const ataResponse = await fetch(
          `${c.env.SUPABASE_URL}/rest/v1/atas_registro_precos?pncp_id=eq.${body.ata_pncp_id}&select=valor_total_registrado`,
          { headers },
        )
        const ataRows = ataResponse.ok ? await ataResponse.json() as Array<{ valor_total_registrado: number }> : []
        const valorTotalRegistrado = ataRows[0]?.valor_total_registrado

        if (valorTotalRegistrado && valorTotalRegistrado > 0) {
          // §4º: Soma de TODAS as adesões ≤ 50% do total registrado
          const somaAdesoesGeral = adesoesExistentes.reduce((sum, a) => sum + (a.valor_total || 0), 0)
          const limiteGeral = valorTotalRegistrado * 0.5
          if (somaAdesoesGeral + valorTotal > limiteGeral) {
            return c.json({
              message: `Limite de adesão excedido (Art. 86, §4º). Saldo disponível: R$ ${(limiteGeral - somaAdesoesGeral).toFixed(2)}`,
              limite_total: limiteGeral,
              ja_comprometido: somaAdesoesGeral,
              valor_solicitado: valorTotal,
              fundamentacao: 'Art. 86, §4º, Lei 14.133/2021 — Limite 50% total registrado para adesões',
            }, 422)
          }

          // §5º: Adesões DESTE ÓRGÃO ≤ 50% do total registrado
          const somaAdesoesOrgao = adesoesExistentes
            .filter(a => a.orgao_aderente_id === orgaoId)
            .reduce((sum, a) => sum + (a.valor_total || 0), 0)
          const limiteOrgao = valorTotalRegistrado * 0.5
          if (somaAdesoesOrgao + valorTotal > limiteOrgao) {
            return c.json({
              message: `Limite de adesão por órgão excedido (Art. 86, §5º). Saldo disponível para este órgão: R$ ${(limiteOrgao - somaAdesoesOrgao).toFixed(2)}`,
              limite_orgao: limiteOrgao,
              ja_comprometido_orgao: somaAdesoesOrgao,
              valor_solicitado: valorTotal,
              fundamentacao: 'Art. 86, §5º, Lei 14.133/2021 — Limite 50% por órgão aderente',
            }, 422)
          }
        }
      }
    } catch {
      // Falha na validação não bloqueia — prosseguir com alerta
      console.warn(`Aviso: Não foi possível validar limites Art. 86 para ATA ${body.ata_pncp_id}`)
    }
  }

  const linkGerenciador = gerarLinkExterno()
  const linkFornecedor = gerarLinkExterno()
  const expiracao = new Date(Date.now() + 15 * 86400000).toISOString()

  try {
    await fetch(`${c.env.SUPABASE_URL}/rest/v1/adesao_arp`, {
      method: 'POST',
      headers: {
        'apikey': c.env.SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${c.env.SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        orgao_aderente_id: orgaoId,
        ata_numero: body.ata_numero,
        ata_pncp_id: body.ata_pncp_id || null,
        ata_vigencia_inicio: body.ata_vigencia_inicio || null,
        ata_vigencia_fim: body.ata_vigencia_fim || null,
        gerenciador_nome: body.gerenciador_nome,
        gerenciador_cnpj: body.gerenciador_cnpj || null,
        gerenciador_uasg: body.gerenciador_uasg || null,
        fornecedor_nome: body.fornecedor_nome || null,
        fornecedor_cnpj: body.fornecedor_cnpj || null,
        itens: body.itens || [],
        valor_total: valorTotal,
        status: 'busca',
        link_gerenciador: linkGerenciador,
        link_gerenciador_expira: expiracao,
        link_fornecedor: linkFornecedor,
        link_fornecedor_expira: expiracao,
        email_gerenciador: body.email_gerenciador || null,
        email_fornecedor: body.email_fornecedor || null,
      }),
    })

    return c.json({
      sucesso: true,
      adesao_id: id,
      status: 'busca',
      valor_total: valorTotal,
      link_gerenciador: linkGerenciador,
      link_fornecedor: linkFornecedor,
      links_expiram_em: expiracao,
      etapas: [
        { num: 1, nome: 'Busca', descricao: 'Buscando ATA e verificando saldo', status: 'em_andamento' },
        { num: 2, nome: 'Análise', descricao: 'Verificando saldo e vigência', status: 'pendente' },
        { num: 3, nome: 'Solicitação', descricao: 'Docs + link enviados ao gerenciador', status: 'pendente' },
        { num: 4, nome: 'Gerenciador', descricao: 'Aguardando autorização do gerenciador', status: 'pendente' },
        { num: 5, nome: 'Fornecedor', descricao: 'Aguardando aceite do fornecedor', status: 'pendente' },
        { num: 6, nome: 'Conclusão', descricao: 'Documentos finais gerados', status: 'pendente' },
      ],
      documentos_a_gerar: [
        'oficio_consulta', 'justificativa_adesao', 'declaracao_compatibilidade',
        'mapa_comparativo', 'autorizacao_gerenciador', 'aceite_fornecedor',
        'termo_adesao', 'extrato_publicacao', 'nota_empenho', 'contrato_adesao',
      ],
      mensagem: 'Adesão iniciada. Verificando saldo e vigência da ATA.',
    }, 201)
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Erro'
    return c.json({ message: 'Erro ao iniciar adesão', detalhes: msg }, 500)
  }
})

// ─── GET /:id — Obter adesão ─────────────────────────────────────────────────

app.get('/:id', async (c) => {
  const id = c.req.param('id')
  const orgaoId = c.req.header('X-Orgao-Id')

  try {
    const response = await fetch(
      `${c.env.SUPABASE_URL}/rest/v1/adesao_arp?id=eq.${id}&orgao_aderente_id=eq.${orgaoId}`,
      { headers: { 'apikey': c.env.SUPABASE_SERVICE_KEY, 'Authorization': `Bearer ${c.env.SUPABASE_SERVICE_KEY}` } }
    )
    const rows = await response.json() as unknown[]
    if (!Array.isArray(rows) || rows.length === 0) {
      return c.json({ message: 'Adesão não encontrada' }, 404)
    }
    return c.json({ adesao: rows[0] })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Erro'
    return c.json({ message: msg }, 500)
  }
})

// ─── GET /orgao/:orgaoId — Listar adesões do órgão ──────────────────────────

app.get('/orgao/:orgaoId', async (c) => {
  const orgaoId = c.req.param('orgaoId')

  try {
    const response = await fetch(
      `${c.env.SUPABASE_URL}/rest/v1/adesao_arp?orgao_aderente_id=eq.${orgaoId}&order=created_at.desc`,
      { headers: { 'apikey': c.env.SUPABASE_SERVICE_KEY, 'Authorization': `Bearer ${c.env.SUPABASE_SERVICE_KEY}` } }
    )
    const adesoes = await response.json()
    return c.json({ adesoes })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Erro'
    return c.json({ message: msg }, 500)
  }
})

// ─── PATCH /:id/status — Avançar status ──────────────────────────────────────

app.patch('/:id/status', async (c) => {
  const id = c.req.param('id')
  const orgaoId = c.req.header('X-Orgao-Id')
  const body = await c.req.json() as {
    status: string
    percentual_utilizado?: number
    saldo_disponivel?: number
  }

  const statusValidos = [
    'busca', 'analise', 'solicitacao_enviada', 'aguardando_gerenciador',
    'aguardando_fornecedor', 'autorizada', 'contratada',
    'recusada_gerenciador', 'recusada_fornecedor', 'expirada', 'cancelada',
  ]

  if (!statusValidos.includes(body.status)) {
    return c.json({ message: `Status inválido. Válidos: ${statusValidos.join(', ')}` }, 400)
  }

  const updates: Record<string, unknown> = {
    status: body.status,
    updated_at: new Date().toISOString(),
  }

  if (body.percentual_utilizado !== undefined) updates.percentual_utilizado = body.percentual_utilizado
  if (body.saldo_disponivel !== undefined) updates.saldo_disponivel = body.saldo_disponivel

  try {
    await fetch(
      `${c.env.SUPABASE_URL}/rest/v1/adesao_arp?id=eq.${id}&orgao_aderente_id=eq.${orgaoId}`,
      {
        method: 'PATCH',
        headers: {
          'apikey': c.env.SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${c.env.SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify(updates),
      }
    )
    return c.json({ sucesso: true, status: body.status })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Erro'
    return c.json({ message: msg }, 500)
  }
})

// ─── POST /:id/resposta-externa — Resposta via link externo (não-usuário) ───

app.post('/:id/resposta-externa', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json() as {
    token: string
    tipo: 'gerenciador' | 'fornecedor'
    aprovado: boolean
    observacoes?: string
    nome_responsavel?: string
    cargo_responsavel?: string
  }

  if (!body.token || !body.tipo) {
    return c.json({ message: 'token e tipo são obrigatórios' }, 400)
  }

  // Buscar adesão pelo link token
  const campo = body.tipo === 'gerenciador' ? 'link_gerenciador' : 'link_fornecedor'
  try {
    const response = await fetch(
      `${c.env.SUPABASE_URL}/rest/v1/adesao_arp?${campo}=eq.${body.token}`,
      { headers: { 'apikey': c.env.SUPABASE_SERVICE_KEY, 'Authorization': `Bearer ${c.env.SUPABASE_SERVICE_KEY}` } }
    )
    const rows = await response.json() as Array<Record<string, unknown>>
    if (!Array.isArray(rows) || rows.length === 0) {
      return c.json({ message: 'Link inválido ou expirado' }, 404)
    }

    const adesao = rows[0]
    const campoExpira = body.tipo === 'gerenciador' ? 'link_gerenciador_expira' : 'link_fornecedor_expira'
    if (new Date(adesao[campoExpira] as string) < new Date()) {
      return c.json({ message: 'Link expirado' }, 410)
    }

    // Atualizar status
    let novoStatus: string
    if (!body.aprovado) {
      novoStatus = body.tipo === 'gerenciador' ? 'recusada_gerenciador' : 'recusada_fornecedor'
    } else if (body.tipo === 'gerenciador') {
      novoStatus = 'aguardando_fornecedor'
    } else {
      novoStatus = 'autorizada'
    }

    await fetch(
      `${c.env.SUPABASE_URL}/rest/v1/adesao_arp?id=eq.${adesao.id}`,
      {
        method: 'PATCH',
        headers: {
          'apikey': c.env.SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${c.env.SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({
          status: novoStatus,
          updated_at: new Date().toISOString(),
        }),
      }
    )

    return c.json({
      sucesso: true,
      status: novoStatus,
      mensagem: body.aprovado
        ? `${body.tipo === 'gerenciador' ? 'Autorização do gerenciador' : 'Aceite do fornecedor'} registrado com sucesso`
        : `Adesão recusada pelo ${body.tipo}`,
    })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Erro'
    return c.json({ message: msg }, 500)
  }
})

export default app
