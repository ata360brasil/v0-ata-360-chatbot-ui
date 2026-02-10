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
    }
    Functions: Record<string, never>
    Enums: {
      user_role: 'superadm' | 'suporte' | 'localadm' | 'servidor' | 'demo'
      esfera: 'federal' | 'estadual' | 'municipal'
      govbr_level: 'ouro' | 'prata' | 'bronze'
    }
  }
}
