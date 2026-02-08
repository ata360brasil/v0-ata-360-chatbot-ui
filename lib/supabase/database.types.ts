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
        Update: never
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      user_role: 'superadm' | 'suporte' | 'localadm' | 'servidor' | 'demo'
      esfera: 'federal' | 'estadual' | 'municipal'
      govbr_level: 'ouro' | 'prata' | 'bronze'
    }
  }
}
