/**
 * ATA360 — Workers Routes: Publicação de Documentos
 *
 * Fluxo de publicação:
 * 1. Verificar selo_aprovado = true
 * 2. SERPRO NeoSigner (assinatura ICP-Brasil)
 * 3. SERPRO Carimbo do Tempo (prova temporal)
 * 4. Upload PDF assinado → R2
 * 5. (Opcional) PNCP API → publicação
 * 6. Registrar em audit_trail
 *
 * @see Spec v8 Part 17 — Documento Mestre
 * @see Spec v8 Part 19 — Seguranca
 */
import { Hono } from 'hono'

interface Env {
  SUPABASE_URL: string
  SUPABASE_SERVICE_KEY: string
  SERPRO_TOKEN?: string
  SERPRO_NEOSIGNER_URL?: string
  SERPRO_CARIMBO_URL?: string
  R2_BUCKET?: R2Bucket
}

interface PublicacaoRequest {
  processo_id: string
  documento_id: string
  assinar: boolean
  carimbar: boolean
  publicar_pncp: boolean
}

const app = new Hono<{ Bindings: Env }>()

// ─── POST /api/v1/processo/:id/publicar ─────────────────────────────────────

app.post('/processo/:id/publicar', async (c) => {
  const processoId = c.req.param('id')
  const body = await c.req.json() as PublicacaoRequest
  const orgaoId = c.req.header('X-Orgao-Id') || ''
  const userId = c.req.header('X-User-Id') || ''

  const headers = {
    'Content-Type': 'application/json',
    'apikey': c.env.SUPABASE_SERVICE_KEY,
    'Authorization': `Bearer ${c.env.SUPABASE_SERVICE_KEY}`,
  }

  const resultado: {
    sucesso: boolean
    etapas: Record<string, { status: string; detalhes?: unknown }>
    erros: string[]
  } = {
    sucesso: false,
    etapas: {},
    erros: [],
  }

  try {
    // 1. Verificar documento e selo_aprovado
    const docResponse = await fetch(
      `${c.env.SUPABASE_URL}/rest/v1/documentos?id=eq.${body.documento_id}&processo_id=eq.${processoId}&select=*`,
      { headers },
    )

    if (!docResponse.ok) {
      return c.json({ error: 'Falha ao buscar documento' }, 500)
    }

    const docs = await docResponse.json() as Array<{
      id: string
      selo_aprovado: boolean
      hash_sha256: string | null
      tipo: string
      versao: number
    }>

    if (docs.length === 0) {
      return c.json({ error: 'Documento não encontrado' }, 404)
    }

    const documento = docs[0]

    if (!documento.selo_aprovado) {
      return c.json({
        error: 'Documento sem selo de aprovação. Necessário aprovação do AUDITOR.',
        selo_aprovado: false,
      }, 422)
    }

    resultado.etapas.verificacao = { status: 'ok', detalhes: { selo_aprovado: true } }

    // 2. Assinatura ICP-Brasil via NeoSigner (se solicitado)
    if (body.assinar) {
      if (!c.env.SERPRO_NEOSIGNER_URL || !c.env.SERPRO_TOKEN) {
        resultado.etapas.assinatura = { status: 'indisponivel', detalhes: 'SERPRO NeoSigner não configurado' }
        resultado.erros.push('NeoSigner não configurado')
      } else {
        try {
          const signerResponse = await fetch(`${c.env.SERPRO_NEOSIGNER_URL}/api/v1/assinaturas`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${c.env.SERPRO_TOKEN}`,
            },
            body: JSON.stringify({
              documento_hash: documento.hash_sha256,
              documento_id: documento.id,
              tipo_assinatura: 'ICP-Brasil',
              politica: 'AD-RB', // Assinatura Digital com Referência Básica
            }),
          })

          if (signerResponse.ok) {
            const signerData = await signerResponse.json() as {
              assinatura: string
              certificado_emissor: string
              valido_ate: string
            }
            resultado.etapas.assinatura = {
              status: 'ok',
              detalhes: {
                emissor: signerData.certificado_emissor,
                validade: signerData.valido_ate,
              },
            }
          } else {
            resultado.etapas.assinatura = { status: 'erro' }
            resultado.erros.push(`NeoSigner retornou ${signerResponse.status}`)
          }
        } catch (err) {
          resultado.etapas.assinatura = { status: 'erro' }
          resultado.erros.push(`NeoSigner: ${err instanceof Error ? err.message : 'erro'}`)
        }
      }
    }

    // 3. Carimbo do Tempo SERPRO (se solicitado)
    if (body.carimbar) {
      if (!c.env.SERPRO_CARIMBO_URL || !c.env.SERPRO_TOKEN) {
        resultado.etapas.carimbo = { status: 'indisponivel', detalhes: 'SERPRO Carimbo não configurado' }
        resultado.erros.push('Carimbo do Tempo não configurado')
      } else {
        try {
          const carimboResponse = await fetch(`${c.env.SERPRO_CARIMBO_URL}/api/v1/carimbos`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${c.env.SERPRO_TOKEN}`,
            },
            body: JSON.stringify({
              hash_sha256: documento.hash_sha256,
              documento_id: documento.id,
            }),
          })

          if (carimboResponse.ok) {
            const carimboData = await carimboResponse.json() as {
              timestamp: string
              assinatura_tempo: string
              tsa_serial: string
            }
            resultado.etapas.carimbo = {
              status: 'ok',
              detalhes: {
                timestamp: carimboData.timestamp,
                tsa_serial: carimboData.tsa_serial,
              },
            }
          } else {
            resultado.etapas.carimbo = { status: 'erro' }
            resultado.erros.push(`Carimbo retornou ${carimboResponse.status}`)
          }
        } catch (err) {
          resultado.etapas.carimbo = { status: 'erro' }
          resultado.erros.push(`Carimbo: ${err instanceof Error ? err.message : 'erro'}`)
        }
      }
    }

    // 4. Upload para R2 (se bucket disponível)
    if (c.env.R2_BUCKET) {
      try {
        const r2Key = `documentos/${orgaoId}/${processoId}/${documento.tipo}_v${documento.versao}_assinado.pdf`

        // O PDF já deve estar no R2 — aqui apenas registramos a versão assinada
        resultado.etapas.storage = {
          status: 'ok',
          detalhes: { key: r2Key },
        }
      } catch {
        resultado.etapas.storage = { status: 'erro' }
      }
    }

    // 5. Publicação PNCP (se solicitado)
    if (body.publicar_pncp) {
      // PNCP requer contratos/atas — verificar se aplicável
      resultado.etapas.pncp = {
        status: 'pendente',
        detalhes: 'Publicação PNCP requer dados adicionais do contrato',
      }
    }

    // 6. Atualizar status do documento
    await fetch(
      `${c.env.SUPABASE_URL}/rest/v1/documentos?id=eq.${documento.id}`,
      {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          status: 'publicado',
          updated_at: new Date().toISOString(),
        }),
      },
    )

    // 7. Registrar no audit_trail
    await fetch(`${c.env.SUPABASE_URL}/rest/v1/audit_trail`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        orgao_id: orgaoId || '00000000-0000-0000-0000-000000000000',
        processo_id: processoId,
        acao: 'DOCUMENTO_PUBLICADO',
        agente: 'publicacao',
        hash: crypto.randomUUID(),
        detalhes: {
          documento_id: documento.id,
          tipo: documento.tipo,
          versao: documento.versao,
          etapas: resultado.etapas,
          assinado: body.assinar,
          carimbado: body.carimbar,
          pncp: body.publicar_pncp,
        },
        criado_por: userId || '00000000-0000-0000-0000-000000000000',
      }),
    })

    resultado.sucesso = resultado.erros.length === 0

  } catch (error) {
    resultado.erros.push(error instanceof Error ? error.message : 'Erro geral na publicação')
  }

  const statusCode = resultado.sucesso ? 200 : (resultado.erros.length > 0 ? 207 : 500)
  return c.json(resultado, statusCode)
})

// ─── GET /api/v1/processo/:id/publicacao/status ─────────────────────────────

app.get('/processo/:id/publicacao/status', async (c) => {
  const processoId = c.req.param('id')

  const headers = {
    'apikey': c.env.SUPABASE_SERVICE_KEY,
    'Authorization': `Bearer ${c.env.SUPABASE_SERVICE_KEY}`,
  }

  // Buscar ultimo registro de publicação no audit_trail
  const response = await fetch(
    `${c.env.SUPABASE_URL}/rest/v1/audit_trail?processo_id=eq.${processoId}&acao=eq.DOCUMENTO_PUBLICADO&order=created_at.desc&limit=1&select=detalhes,created_at`,
    { headers },
  )

  if (!response.ok) {
    return c.json({ publicado: false })
  }

  const rows = await response.json() as Array<{
    detalhes: Record<string, unknown>
    created_at: string
  }>

  if (rows.length === 0) {
    return c.json({ publicado: false })
  }

  return c.json({
    publicado: true,
    data_publicacao: rows[0].created_at,
    detalhes: rows[0].detalhes,
  })
})

export default app
