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

      // ─── PCA Inteligente (v8.1) ──────────────────────────────────────────────
      pca_plano: {
        Row: {
          id: string
          orgao_id: string
          exercicio: number
          status: 'rascunho' | 'sugerido' | 'em_revisao' | 'aprovado' | 'publicado'
          origem: 'manual' | 'sugerido_ia' | 'importado'
          dados_historicos_usados: Record<string, unknown> | null
          confianca_sugestao: number | null
          total_itens: number
          valor_total_estimado: number
          aprovado_por: string | null
          aprovado_em: string | null
          publicado_pncp_em: string | null
          observacoes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['pca_plano']['Row'], 'id' | 'created_at' | 'updated_at' | 'total_itens' | 'valor_total_estimado'>
        Update: Partial<Database['public']['Tables']['pca_plano']['Insert']> & {
          status?: 'rascunho' | 'sugerido' | 'em_revisao' | 'aprovado' | 'publicado'
          total_itens?: number
          valor_total_estimado?: number
          aprovado_por?: string
          aprovado_em?: string
          publicado_pncp_em?: string
        }
      }
      pca_itens: {
        Row: {
          id: string
          pca_id: string
          orgao_id: string
          numero_item: number
          descricao: string
          catmat_catser: string | null
          tipo: 'material' | 'servico' | 'obra' | 'ti'
          setor_requisitante: string | null
          valor_unitario_estimado: number | null
          quantidade_estimada: number | null
          valor_total_estimado: number | null
          unidade_medida: string | null
          mes_previsto: number | null
          prioridade: 'baixa' | 'normal' | 'alta' | 'urgente'
          modalidade_sugerida: string | null
          processo_id: string | null
          status: 'pendente' | 'em_andamento' | 'concluido' | 'cancelado'
          sugerido_por: 'manual' | 'ia' | 'historico'
          confianca: number | null
          justificativa: string | null
          recorrente: boolean
          fonte_dados: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['pca_itens']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['pca_itens']['Insert']> & {
          status?: 'pendente' | 'em_andamento' | 'concluido' | 'cancelado'
          processo_id?: string
        }
      }
      pca_historico_compras: {
        Row: {
          id: string
          orgao_id: string
          ano: number
          fonte: 'pncp' | 'compras_gov' | 'manual' | 'ata_registro'
          descricao: string
          catmat_catser: string | null
          valor_unitario: number | null
          quantidade: number | null
          valor_total: number | null
          fornecedor_cnpj: string | null
          modalidade: string | null
          numero_processo: string | null
          recorrente: boolean
          sazonalidade: number[] | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['pca_historico_compras']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['pca_historico_compras']['Insert']>
      }

      // ─── Compliance e Integridade (v8.1) ─────────────────────────────────────
      compliance_programa: {
        Row: {
          id: string
          orgao_id: string
          // 5 pilares CGU (Portaria 226/2025)
          comprometimento_lideranca: boolean
          instancia_responsavel: boolean
          analise_riscos: boolean
          regras_instrumentos: boolean
          monitoramento_continuo: boolean
          // Instrumentos
          codigo_conduta: boolean
          canal_denuncias: boolean
          due_diligence: boolean
          treinamentos: boolean
          // Certificações
          certificacao_pro_etica_cgu: boolean
          certificacao_abes: boolean
          certificacao_tcu_diamante: boolean
          certificacao_tce_mg: boolean
          // Políticas
          politica_anticorrupcao: boolean
          politica_diversidade: boolean
          politica_teletrabalho: boolean
          politica_lgpd: boolean
          politica_esg: boolean
          // ESG
          esg_ambiental_score: number | null
          esg_social_score: number | null
          esg_governanca_score: number | null
          // ODS
          ods_atendidos: number[] | null
          // Scores
          nivel_maturidade: 'inicial' | 'basico' | 'intermediario' | 'avancado' | 'excelencia'
          score_integridade: number | null
          ultima_avaliacao: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['compliance_programa']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['compliance_programa']['Insert']> & {
          score_integridade?: number
          nivel_maturidade?: 'inicial' | 'basico' | 'intermediario' | 'avancado' | 'excelencia'
          ultima_avaliacao?: string
        }
      }
      compliance_riscos: {
        Row: {
          id: string
          orgao_id: string
          programa_id: string | null
          descricao: string
          categoria: 'corrupcao' | 'fraude_licitacao' | 'conflito_interesse' | 'nepotismo' | 'desvio_recursos' | 'assedio' | 'discriminacao' | 'vazamento_dados'
          probabilidade: 'muito_baixa' | 'baixa' | 'media' | 'alta' | 'muito_alta'
          impacto: 'muito_baixo' | 'baixo' | 'medio' | 'alto' | 'muito_alto'
          nivel_risco: 'baixo' | 'medio' | 'alto' | 'critico'
          controles_existentes: string | null
          controles_recomendados: string | null
          responsavel: string | null
          status: 'identificado' | 'mitigando' | 'monitorando' | 'aceito' | 'eliminado'
          prazo_mitigacao: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['compliance_riscos']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['compliance_riscos']['Insert']> & {
          status?: 'identificado' | 'mitigando' | 'monitorando' | 'aceito' | 'eliminado'
          controles_existentes?: string
        }
      }

      // ─── Prazos e Alertas (v8.1) ─────────────────────────────────────────────
      prazos: {
        Row: {
          id: string
          orgao_id: string
          processo_id: string | null
          tipo: string
          descricao: string
          data_inicio: string | null
          data_limite: string
          data_conclusao: string | null
          nivel_alerta: 'informativo' | 'atencao' | 'urgente' | 'critico'
          destinatario_tipo: 'membro' | 'setor' | 'orgao' | 'geral'
          destinatario_id: string | null
          base_legal: string | null
          dias_legais: number | null
          dias_uteis: boolean
          recorrente: boolean
          recorrencia_cron: string | null
          status: 'ativo' | 'concluido' | 'vencido' | 'cancelado'
          criado_por: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['prazos']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['prazos']['Insert']> & {
          status?: 'ativo' | 'concluido' | 'vencido' | 'cancelado'
          data_conclusao?: string
          nivel_alerta?: 'informativo' | 'atencao' | 'urgente' | 'critico'
        }
      }
      alertas: {
        Row: {
          id: string
          orgao_id: string
          prazo_id: string | null
          tipo: string
          nivel: 'info' | 'atencao' | 'urgente' | 'critico'
          titulo: string
          mensagem: string
          destinatario_tipo: 'membro' | 'setor' | 'orgao' | 'geral'
          destinatario_id: string | null
          lido: boolean
          lido_em: string | null
          canal: 'sistema' | 'email' | 'push' | 'sms'
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['alertas']['Row'], 'id' | 'created_at' | 'lido'>
        Update: Partial<Database['public']['Tables']['alertas']['Insert']> & {
          lido?: boolean
          lido_em?: string
        }
      }

      // ─── Assinaturas Eletrônicas (v8.1) ──────────────────────────────────────
      assinaturas: {
        Row: {
          id: string
          orgao_id: string
          processo_id: string | null
          documento_id: string | null
          documento_hash: string
          signatario_id: string
          signatario_nome: string | null
          signatario_cpf: string | null
          signatario_cargo: string | null
          metodo_autenticacao: 'govbr_ouro' | 'govbr_prata' | 'certificado_icp' | 'senha_supabase'
          nivel_assinatura: 'simples' | 'avancada' | 'qualificada'
          ip_signatario: string
          user_agent: string | null
          assinatura_hash: string | null
          certificado_emissor: string | null
          carimbo_serpro: Record<string, unknown> | null
          carimbo_serpro_timestamp: string | null
          clausula_aceita: boolean
          clausula_texto: string | null
          valido: boolean
          validado_em: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['assinaturas']['Row'], 'id' | 'created_at' | 'valido'>
        Update: Partial<Database['public']['Tables']['assinaturas']['Insert']> & {
          valido?: boolean
          validado_em?: string
        }
      }

      // ─── Ouvidoria e Canal de Denúncias (v8.1) ──────────────────────────────
      ouvidoria_manifestacoes: {
        Row: {
          id: string
          orgao_id: string | null
          protocolo: string
          tipo: string
          categoria: string
          assunto: string
          descricao: string
          anonimo: boolean
          denunciante_id: string | null
          denunciante_nome: string | null
          denunciante_email: string | null
          acusado_nome: string | null
          acusado_cargo: string | null
          acusado_orgao: string | null
          status: 'recebida' | 'em_analise' | 'respondida' | 'encerrada' | 'arquivada'
          prioridade: 'baixa' | 'normal' | 'alta' | 'urgente'
          resposta: string | null
          respondido_em: string | null
          responsavel_id: string | null
          prazo_resposta: string
          protecao_identidade: boolean
          ip_origem: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['ouvidoria_manifestacoes']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['ouvidoria_manifestacoes']['Insert']> & {
          status?: 'recebida' | 'em_analise' | 'respondida' | 'encerrada' | 'arquivada'
          resposta?: string
          respondido_em?: string
          responsavel_id?: string
        }
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
