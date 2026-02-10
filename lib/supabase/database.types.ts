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
      acma_sugestoes: {
        Row: {
          id: string
          orgao_id: string
          processo_id: string
          documento_tipo: string
          secao: string
          texto_sugerido: string
          prompt_hash: string
          modelo_usado: string
          tier: string
          decisao: 'APROVAR' | 'EDITAR' | 'NOVA_SUGESTAO' | 'DESCARTAR'
          texto_final: string | null
          edit_distance: number | null
          edit_ratio: number | null
          diferencas: Record<string, unknown> | null
          rating: number | null
          setor: string | null
          iteracao: number
          tokens_input: number | null
          tokens_output: number | null
          latency_ms: number | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['acma_sugestoes']['Row'], 'id' | 'created_at' | 'iteracao'>
        Update: Partial<Database['public']['Tables']['acma_sugestoes']['Insert']> & {
          rating?: number
          decisao?: 'APROVAR' | 'EDITAR' | 'NOVA_SUGESTAO' | 'DESCARTAR'
          texto_final?: string
          edit_distance?: number
          edit_ratio?: number
          diferencas?: Record<string, unknown>
        }
      }
      acma_prompt_versoes: {
        Row: {
          id: string
          documento_tipo: string
          secao: string
          versao: number
          prompt_template: string
          prompt_hash: string
          taxa_aprovacao: number | null
          edit_distance_media: number | null
          total_usos: number
          ativo: number
          criado_por: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['acma_prompt_versoes']['Row'], 'id' | 'created_at' | 'total_usos'>
        Update: Partial<Database['public']['Tables']['acma_prompt_versoes']['Insert']> & {
          total_usos?: number
          taxa_aprovacao?: number
          ativo?: number
        }
      }
      acma_padroes_edicao: {
        Row: {
          id: string
          documento_tipo: string
          secao: string
          padrao_original: string
          padrao_corrigido: string
          frequencia: number
          confianca: number
          setores: string[] | null
          ativo: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['acma_padroes_edicao']['Row'], 'id' | 'created_at' | 'ativo'>
        Update: Partial<Database['public']['Tables']['acma_padroes_edicao']['Insert']> & {
          ativo?: boolean
          frequencia?: number
          confianca?: number
        }
      }
      auditor_resultados: {
        Row: {
          id: string
          orgao_id: string
          processo_id: string
          documento_tipo: string
          veredicto: 'CONFORME' | 'RESSALVAS' | 'NAO_CONFORME'
          score: number
          checklist: Record<string, unknown>
          selo_aprovado: boolean
          decisao_usuario: string | null
          setor: string | null
          iteracao: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['auditor_resultados']['Row'], 'id' | 'created_at' | 'iteracao'>
        Update: Partial<Database['public']['Tables']['auditor_resultados']['Insert']> & {
          decisao_usuario?: string
        }
      }
      auditor_thresholds: {
        Row: {
          id: string
          check_id: string
          documento_tipo: string
          setor: string | null
          severidade: string
          peso: number
          total_avaliacoes: number
          taxa_override: number
          auto_calibrado: boolean
          calibrado_em: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['auditor_thresholds']['Row'], 'id' | 'created_at' | 'updated_at' | 'auto_calibrado' | 'total_avaliacoes' | 'taxa_override'>
        Update: Partial<Database['public']['Tables']['auditor_thresholds']['Insert']> & {
          severidade?: string
          peso?: number
          total_avaliacoes?: number
          taxa_override?: number
          auto_calibrado?: boolean
          calibrado_em?: string
        }
      }
      processo_mensagens: {
        Row: {
          id: string
          processo_id: string
          orgao_id: string
          role: 'user' | 'assistant' | 'system' | 'insight' | 'acma' | 'auditor' | 'design_law' | 'orquestrador'
          content: string
          artefato: Record<string, unknown> | null
          insight_cards: Array<Record<string, unknown>> | null
          agente: string | null
          estado_no_momento: string
          metadata: Record<string, unknown>
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['processo_mensagens']['Row'], 'id' | 'created_at' | 'metadata'>
        Update: Partial<Database['public']['Tables']['processo_mensagens']['Insert']>
      }
      biblioteca_legal_global: {
        Row: {
          id: string
          tipo: string
          numero: string
          nome: string
          ementa: string | null
          orgao_emissor: string
          esfera: 'federal' | 'estadual' | 'municipal'
          uf: string | null
          data_publicacao: string | null
          data_vigencia: string | null
          revogada: boolean
          revogada_por: string | null
          url_oficial: string | null
          texto_integral: string | null
          categorias: string[]
          setores_aplicaveis: string[]
          aplicavel_lei_14133: boolean
          metadata: Record<string, unknown>
          atualizado_por: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['biblioteca_legal_global']['Row'], 'id' | 'created_at' | 'updated_at' | 'revogada' | 'atualizado_por'>
        Update: Partial<Database['public']['Tables']['biblioteca_legal_global']['Insert']> & {
          revogada?: boolean
          atualizado_por?: string
        }
      }
      biblioteca_legal_orgao: {
        Row: {
          id: string
          orgao_id: string
          tipo: string
          numero: string
          nome: string
          ementa: string | null
          orgao_emissor: string
          data_publicacao: string | null
          data_vigencia: string | null
          revogada: boolean
          url_oficial: string | null
          texto_integral: string | null
          categorias: string[]
          setores_aplicaveis: string[]
          complementa_federal: string | null
          metadata: Record<string, unknown>
          criado_por: string | null
          atualizado_por: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['biblioteca_legal_orgao']['Row'], 'id' | 'created_at' | 'updated_at' | 'revogada' | 'atualizado_por'>
        Update: Partial<Database['public']['Tables']['biblioteca_legal_orgao']['Insert']> & {
          revogada?: boolean
          atualizado_por?: string
        }
      }
      parametros_globais: {
        Row: {
          id: string
          chave: string
          valor: unknown
          tipo: 'sistema' | 'agente' | 'legal' | 'financeiro'
          descricao: string | null
          editavel_por: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['parametros_globais']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['parametros_globais']['Insert']>
      }
      parametros_orgao: {
        Row: {
          id: string
          orgao_id: string
          chave: string
          valor: unknown
          categoria: 'geral' | 'identidade_visual' | 'autoridades' | 'endereco' | 'contato' | 'documentacao' | 'financeiro'
          descricao: string | null
          criado_por: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['parametros_orgao']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['parametros_orgao']['Insert']>
      }
      parametros_membro: {
        Row: {
          id: string
          usuario_id: string
          orgao_id: string
          chave: string
          valor: unknown
          categoria: 'geral' | 'identidade' | 'cargo' | 'assinatura' | 'preferencias' | 'pca_vivo' | 'memoria'
          descricao: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['parametros_membro']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['parametros_membro']['Insert']>
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
      v_acma_performance: {
        Row: {
          documento_tipo: string
          secao: string
          semana: string
          total_sugestoes: number
          aprovadas: number
          editadas: number
          descartadas: number
          taxa_aprovacao: number
          edit_ratio_medio: number
          rating_medio: number | null
        }
      }
      v_auditor_conformidade: {
        Row: {
          documento_tipo: string
          setor: string | null
          mes: string
          total_auditorias: number
          conformes: number
          ressalvas: number
          nao_conformes: number
          taxa_conformidade: number
          score_medio: number
          selos_aprovados: number
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
