/**
 * ATA360 — Cron: Propagação de Feedback para D1
 *
 * Executado a cada 6 horas via Cloudflare Cron Triggers.
 *
 * Lógica:
 * 1. Busca correções com 3+ usuários diferentes no Supabase
 * 2. Insere novos sinônimos no D1 (termos_normalizados)
 * 3. Invalida cache KV para termos afetados
 * 4. Marca feedbacks como 'propagado' no Supabase
 * 5. Registra no audit_trail
 *
 * @see Spec v8 Part 16 — Normalização Linguística
 */

interface CronEnv {
  D1_NORMALIZACAO: D1Database
  KV_CACHE: KVNamespace
  SUPABASE_URL: string
  SUPABASE_SERVICE_KEY: string
}

interface PropagavelRow {
  termo_original: string
  termo_corrigido_usuario: string
  catmat_corrigido_usuario: string | null
  setor: string | null
  total_usuarios: number
  total_feedbacks: number
  confianca_media_original: number | null
  ultimo_feedback: string
}

export interface PropagationResult {
  termos_propagados: number
  cache_invalidados: number
  erros: string[]
}

/**
 * Handler principal do cron de propagação.
 * Chamado pelo Cloudflare Cron Triggers a cada 6h.
 */
export async function propagateFeedback(env: CronEnv): Promise<PropagationResult> {
  const result: PropagationResult = {
    termos_propagados: 0,
    cache_invalidados: 0,
    erros: [],
  }

  try {
    // 1. Buscar feedbacks propagáveis (3+ usuários com mesma correção)
    const propagaveisResponse = await fetch(
      `${env.SUPABASE_URL}/rest/v1/v_feedback_propagavel?select=*`,
      {
        headers: {
          'apikey': env.SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
        },
      },
    )

    if (!propagaveisResponse.ok) {
      result.erros.push(`Falha ao buscar feedbacks propagáveis: ${propagaveisResponse.status}`)
      return result
    }

    const propagaveis = await propagaveisResponse.json() as PropagavelRow[]

    if (propagaveis.length === 0) {
      return result // Nada para propagar
    }

    // 2. Para cada correção propagável, inserir no D1
    for (const item of propagaveis) {
      try {
        // Verificar se já existe no D1
        const existing = await env.D1_NORMALIZACAO
          .prepare(
            `SELECT id FROM termos_normalizados
             WHERE termo_usuario = ? AND setor = ?
             LIMIT 1`
          )
          .bind(item.termo_original, item.setor || 'GERAL')
          .first<{ id: number }>()

        if (existing) {
          // Atualizar termo existente
          await env.D1_NORMALIZACAO
            .prepare(
              `UPDATE termos_normalizados
               SET termo_normalizado = ?,
                   catmat_preferencial = ?,
                   confianca = ?,
                   origem = 'feedback',
                   updated_at = datetime('now')
               WHERE id = ?`
            )
            .bind(
              item.termo_corrigido_usuario,
              item.catmat_corrigido_usuario || null,
              Math.min(0.95, 0.7 + (item.total_usuarios * 0.05)), // Confiança baseada em consenso
              existing.id,
            )
            .run()
        } else {
          // Inserir novo sinônimo
          await env.D1_NORMALIZACAO
            .prepare(
              `INSERT INTO termos_normalizados
               (termo_usuario, termo_normalizado, catmat_preferencial, setor, confianca, fonte, origem)
               VALUES (?, ?, ?, ?, ?, 'feedback_propagado', 'feedback')`
            )
            .bind(
              item.termo_original,
              item.termo_corrigido_usuario,
              item.catmat_corrigido_usuario || null,
              item.setor || 'GERAL',
              Math.min(0.95, 0.7 + (item.total_usuarios * 0.05)),
            )
            .run()
        }

        result.termos_propagados++

        // 3. Invalidar cache KV para este termo
        // Não sabemos exatamente qual hash tem no cache, mas podemos deletar
        // padrões conhecidos. Em produção, usaria KV list + prefix.
        try {
          // Invalidação por padrão: texto exato + variações comuns
          const cachePatterns = [
            item.termo_original,
            item.termo_original.toLowerCase(),
          ]
          for (const pattern of cachePatterns) {
            const data = new TextEncoder().encode(`${pattern}||`)
            const hashBuffer = await crypto.subtle.digest('SHA-256', data)
            const hashArray = Array.from(new Uint8Array(hashBuffer))
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
            await env.KV_CACHE.delete(`norm:${hashHex}`)
            result.cache_invalidados++
          }
        } catch {
          // Cache invalidation não é crítica
        }

        // 4. Marcar feedbacks como propagados no Supabase
        await fetch(
          `${env.SUPABASE_URL}/rest/v1/feedback_termos?termo_original=eq.${encodeURIComponent(item.termo_original)}&termo_corrigido_usuario=eq.${encodeURIComponent(item.termo_corrigido_usuario)}&status=eq.pendente`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'apikey': env.SUPABASE_SERVICE_KEY,
              'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
            },
            body: JSON.stringify({
              status: 'propagado',
              propagado_em: new Date().toISOString(),
            }),
          },
        )
      } catch (error) {
        const msg = error instanceof Error ? error.message : 'Erro desconhecido'
        result.erros.push(`Erro propagando "${item.termo_original}": ${msg}`)
      }
    }

    // 5. Registrar no audit_trail
    try {
      await fetch(`${env.SUPABASE_URL}/rest/v1/audit_trail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': env.SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
        },
        body: JSON.stringify({
          orgao_id: '00000000-0000-0000-0000-000000000000', // Sistema
          acao: 'FEEDBACK_PROPAGADO',
          agente: 'cron_propagacao',
          hash: crypto.randomUUID(),
          detalhes: {
            termos_propagados: result.termos_propagados,
            cache_invalidados: result.cache_invalidados,
            erros: result.erros,
          },
          criado_por: '00000000-0000-0000-0000-000000000000', // Sistema
        }),
      })
    } catch {
      // Audit trail failure não é crítica
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Erro geral'
    result.erros.push(`Erro geral na propagação: ${msg}`)
  }

  return result
}
