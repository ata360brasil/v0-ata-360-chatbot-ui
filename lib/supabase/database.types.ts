/**
 * Database Types — gerado com `supabase gen types typescript`.
 *
 * Placeholder até projeto Supabase estar configurado.
 * Rodar: npx supabase gen types typescript --project-id <id> > lib/supabase/database.types.ts
 *
 * @see supabase.com/docs/guides/api/rest/generating-types
 */

export interface Database {
  public: {
    Tables: {
      orgaos: {
        Row: {
          id: string
          nome: string
          cnpj: string
          uf: string
          municipio: string
          esfera: 'federal' | 'estadual' | 'municipal'
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['orgaos']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['orgaos']['Insert']>
      }
      usuarios: {
        Row: {
          id: string
          orgao_id: string
          cpf: string
          nome: string
          email: string
          role: 'superadm' | 'suporte' | 'localadm' | 'servidor' | 'demo'
          avatar_url: string | null
          govbr_level: 'ouro' | 'prata' | 'bronze' | null
          created_at: string
          last_login: string | null
        }
        Insert: Omit<Database['public']['Tables']['usuarios']['Row'], 'id' | 'created_at' | 'last_login'>
        Update: Partial<Database['public']['Tables']['usuarios']['Insert']>
      }
      processos: {
        Row: {
          id: string
          orgao_id: string
          numero: string
          objeto: string
          status: string
          fase: string
          valor_estimado: number
          criado_por: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['processos']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['processos']['Insert']>
      }
      documentos: {
        Row: {
          id: string
          processo_id: string
          orgao_id: string
          tipo: string
          versao: number
          status: string
          conteudo: Record<string, unknown>
          hash_sha256: string | null
          selo_aprovado: boolean
          criado_por: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['documentos']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['documentos']['Insert']>
      }
      audit_trail: {
        Row: {
          id: string
          orgao_id: string
          processo_id: string | null
          acao: string
          agente: string
          estado_anterior: string | null
          estado_novo: string | null
          hash: string
          detalhes: Record<string, unknown> | null
          criado_por: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['audit_trail']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['audit_trail']['Insert']>
      }
      feedback_termos: {
        Row: {
          id: string
          orgao_id: string
          usuario_id: string
          processo_id: string | null
          termo_original: string
          termo_normalizado_sistema: string
          catmat_sugerido_sistema: string | null
          termo_corrigido_usuario: string | null
          catmat_corrigido_usuario: string | null
          tipo_feedback: 'correcao_termo' | 'correcao_catmat' | 'aprovacao' | 'rejeicao'
          setor: string | null
          regiao_uf: string | null
          status: 'pendente' | 'validado' | 'propagado' | 'rejeitado'
          validado_por: string | null
          propagado_em: string | null
          confianca_original: number | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['feedback_termos']['Row'], 'id' | 'created_at' | 'status' | 'validado_por' | 'propagado_em'>
        Update: Partial<Database['public']['Tables']['feedback_termos']['Insert']> & {
          status?: 'pendente' | 'validado' | 'propagado' | 'rejeitado'
          validado_por?: string
          propagado_em?: string
        }
      }
      perfil_usuario: {
        Row: {
          id: string
          usuario_id: string
          orgao_id: string
          segmento_principal: string | null
          segmentos_secundarios: string[] | null
          termos_frequentes: Array<{ termo: string; contagem: number }>
          catmat_frequentes: Array<{ codigo: string; descricao: string; contagem: number }>
          preferencias_terminologia: Record<string, string>
          regiao_uf: string | null
          porte_orgao: string | null
          taxa_aprovacao_acma: number | null
          taxa_edicao_media: number | null
          temas_recorrentes: string[] | null
          documentos_mais_gerados: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['perfil_usuario']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['perfil_usuario']['Insert']>
      }
      avaliacao_fornecedor: {
        Row: {
          id: string
          orgao_id: string
          usuario_id: string
          processo_id: string | null
          contrato_numero: string
          fornecedor_cnpj: string
          fornecedor_nome: string
          objeto_contrato: string | null
          nota_fornecedor: number
          nota_entrega: number
          nota_qualidade: number
          nota_relacionamento: number
          nota_media: number
          observacao: string | null
          recomendaria: boolean | null
          periodo_avaliado: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['avaliacao_fornecedor']['Row'], 'id' | 'created_at' | 'nota_media'>
        Update: Partial<Database['public']['Tables']['avaliacao_fornecedor']['Insert']>
      }
      avaliacao_plataforma: {
        Row: {
          id: string
          orgao_id: string
          usuario_id: string
          nps_score: number
          nota_geral: number
          nota_facilidade: number | null
          nota_velocidade: number | null
          nota_precisao: number | null
          nota_documentos: number | null
          comentario: string | null
          sugestao: string | null
          duracao_sessao_minutos: number | null
          documentos_gerados: number | null
          pesquisas_realizadas: number | null
          areas_melhoria: string[] | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['avaliacao_plataforma']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['avaliacao_plataforma']['Insert']>
      }
      avaliacao_resposta: {
        Row: {
          id: string
          orgao_id: string
          usuario_id: string
          processo_id: string | null
          mensagem_id: string | null
          agente: string
          tipo_resposta: string | null
          nota: number
          tipo_feedback: 'util' | 'parcial' | 'incorreto' | 'incompleto' | 'excelente'
          comentario: string | null
          correcao_sugerida: string | null
          modelo_usado: string | null
          tokens_input: number | null
          tokens_output: number | null
          latencia_ms: number | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['avaliacao_resposta']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['avaliacao_resposta']['Insert']>
      }
      avaliacao_artefato: {
        Row: {
          id: string
          orgao_id: string
          usuario_id: string
          processo_id: string | null
          documento_id: string | null
          tipo_documento: string
          versao: number
          nota_geral: number
          nota_precisao_juridica: number | null
          nota_clareza: number | null
          nota_completude: number | null
          nota_formatacao: number | null
          decisao: 'aprovado_sem_edicao' | 'aprovado_com_edicao' | 'rejeitado' | 'refeito'
          percentual_edicao: number | null
          comentario: string | null
          secoes_editadas: string[] | null
          iteracao: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['avaliacao_artefato']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['avaliacao_artefato']['Insert']>
      }
    }
    Views: {
      v_feedback_propagavel: {
        Row: {
          termo_original: string
          termo_corrigido_usuario: string
          catmat_corrigido_usuario: string | null
          setor: string | null
          total_usuarios: number
          total_feedbacks: number
          confianca_media_original: number | null
          ultimo_feedback: string
        }
      }
      v_nps_score: {
        Row: {
          mes: string
          promotores: number
          neutros: number
          detratores: number
          total: number
          nps: number
        }
      }
      v_ranking_fornecedores: {
        Row: {
          fornecedor_cnpj: string
          fornecedor_nome: string
          total_avaliacoes: number
          nota_media: number
          media_fornecedor: number
          media_entrega: number
          media_qualidade: number
          media_relacionamento: number
          recomendacoes: number
        }
      }
      v_qualidade_agentes: {
        Row: {
          agente: string
          tipo_resposta: string
          semana: string
          total: number
          nota_media: number
          positivas: number
          negativas: number
          taxa_aprovacao: number
        }
      }
      v_qualidade_artefatos: {
        Row: {
          tipo_documento: string
          mes: string
          total: number
          nota_media: number
          aprovados_direto: number
          aprovados_editados: number
          rejeitados: number
          edicao_media: number
        }
      }
    }
    Functions: Record<string, never>
    Enums: {
      user_role: 'superadm' | 'suporte' | 'localadm' | 'servidor' | 'demo'
      esfera: 'federal' | 'estadual' | 'municipal'
      govbr_level: 'ouro' | 'prata' | 'bronze'
    }
  }
}
