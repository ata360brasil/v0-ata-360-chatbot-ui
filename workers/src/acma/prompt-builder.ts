/**
 * ATA360 — ACMA Prompt Builder
 *
 * Monta prompt dinâmico para ACMA com:
 * 1. Template ativo da versão atual
 * 2. Top-N padrões de edição recorrentes injetados
 * 3. Contexto do perfil do usuário (server-side, Part 19)
 *
 * Part 19: prompt_template NUNCA aparece no frontend/PDFs.
 *
 * @see Spec v8 Part 08 — ACMA Agent
 * @see Spec v8 Part 19 — Segurança
 */

interface PromptVersion {
  id: string
  versao: number
  prompt_template: string
  prompt_hash: string
  taxa_aprovacao: number | null
}

interface EditPattern {
  padrao_original: string
  padrao_corrigido: string
  frequencia: number
  setores: string[] | null
}

interface UserContext {
  segmento_principal?: string
  regiao_uf?: string
  orgao_nome?: string
  termos_frequentes?: Array<{ termo: string; contagem: number }>
  preferencias_terminologia?: Record<string, string>
}

export interface BuiltPrompt {
  prompt: string
  prompt_hash: string
  versao: number
  padroes_injetados: number
}

/**
 * Carrega prompt ativo + padrões + contexto e monta prompt final.
 *
 * @param documentoTipo - Tipo do documento (ETP, TR, etc.)
 * @param secao - Seção do documento (contexto, fundamentacao, etc.)
 * @param env - Supabase env para consultas
 * @param userContext - Contexto do usuário (Part 19: server-side only)
 */
export async function buildPrompt(
  documentoTipo: string,
  secao: string,
  supabaseUrl: string,
  supabaseKey: string,
  userContext?: UserContext,
): Promise<BuiltPrompt> {
  const headers = {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`,
  }

  // 1. Carregar versão ativa do prompt
  const versionResponse = await fetch(
    `${supabaseUrl}/rest/v1/acma_prompt_versoes?documento_tipo=eq.${documentoTipo}&secao=eq.${secao}&ativo=eq.true&select=*&limit=1`,
    { headers },
  )

  let promptTemplate = getDefaultTemplate(documentoTipo, secao)
  let promptHash = ''
  let versao = 0

  if (versionResponse.ok) {
    const versions = await versionResponse.json() as PromptVersion[]
    if (versions.length > 0) {
      promptTemplate = versions[0].prompt_template
      promptHash = versions[0].prompt_hash
      versao = versions[0].versao
    }
  }

  // 2. Carregar padrões de edição recorrentes
  const patternsResponse = await fetch(
    `${supabaseUrl}/rest/v1/acma_padroes_edicao?documento_tipo=eq.${documentoTipo}&secao=eq.${secao}&ativo=eq.true&order=frequencia.desc&limit=5`,
    { headers },
  )

  let patterns: EditPattern[] = []
  if (patternsResponse.ok) {
    patterns = await patternsResponse.json() as EditPattern[]
  }

  // 3. Montar prompt com padrões injetados
  let prompt = promptTemplate

  // Injetar padrões aprendidos
  if (patterns.length > 0) {
    const patternsBlock = patterns.map((p, i) =>
      `${i + 1}. Não usar: "${p.padrao_original}" → Preferir: "${p.padrao_corrigido}" (${p.frequencia}x corrigido)`,
    ).join('\n')

    prompt += `\n\n[PADRÕES APRENDIDOS — ${documentoTipo}/${secao}]\n${patternsBlock}\n`
  }

  // Injetar contexto do usuário (Part 19: server-side only)
  if (userContext) {
    const contextLines: string[] = [
      '\n[CONTEXTO DO USUÁRIO — não incluir no documento]',
    ]

    if (userContext.orgao_nome) {
      contextLines.push(`Órgão: ${userContext.orgao_nome}`)
    }
    if (userContext.segmento_principal) {
      contextLines.push(`Segmento: ${userContext.segmento_principal}`)
    }
    if (userContext.regiao_uf) {
      contextLines.push(`Região: ${userContext.regiao_uf}`)
    }
    if (userContext.termos_frequentes && userContext.termos_frequentes.length > 0) {
      const termos = userContext.termos_frequentes.slice(0, 5).map(t => t.termo).join(', ')
      contextLines.push(`Itens frequentes: ${termos}`)
    }
    if (userContext.preferencias_terminologia) {
      const prefs = Object.entries(userContext.preferencias_terminologia)
        .slice(0, 3)
        .map(([k, v]) => `${k}→${v}`)
        .join(', ')
      if (prefs) contextLines.push(`Terminologia preferida: ${prefs}`)
    }
    if (userContext.segmento_principal) {
      contextLines.push(`→ Quando ambíguo, preferir interpretação ${userContext.segmento_principal}`)
    }

    prompt += contextLines.join('\n') + '\n'
  }

  // Gerar hash se não veio do DB
  if (!promptHash) {
    const data = new TextEncoder().encode(prompt)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    promptHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }

  return {
    prompt,
    prompt_hash: promptHash,
    versao,
    padroes_injetados: patterns.length,
  }
}

// ─── Default Templates ─────────────────────────────────────────────────────
// Usados quando não há versão no banco. Part 19: nunca expostos ao frontend.

function getDefaultTemplate(documentoTipo: string, secao: string): string {
  const templates: Record<string, Record<string, string>> = {
    ETP: {
      contexto: `Gere o contexto municipal para um Estudo Técnico Preliminar (ETP).
Use dados oficiais (IBGE, SICONFI, FNS/FNDE quando aplicável).
Cite Art. 18 da Lei 14.133/2021. Seja específico com dados quantitativos.
Evite genéricos como "destaca-se que" ou "é importante ressaltar".`,
      justificativa: `Redija a justificativa técnica do ETP.
Fundamentar necessidade com dados concretos e referências legais.
Art. 18, I da Lei 14.133/2021. Incluir análise de risco se aplicável.`,
      pesquisa_precos: `Elabore a pesquisa de preços conforme IN SEGES 65/2021.
Priorizar: PNCP > Compras.gov > cotações. Mínimo 3 fontes.
Calcular média, mediana, e identificar outliers.`,
    },
    TR: {
      especificacao: `Redija a especificação técnica para o Termo de Referência.
Art. 40, I da Lei 14.133/2021. Descrição clara, precisa, sem marca.
Incluir características técnicas mínimas e aceitáveis.`,
      obrigacoes: `Redija obrigações do contratante e contratado.
Equilibrar direitos e deveres. Art. 92 da Lei 14.133/2021.
Incluir prazos, penalidades, e condições de pagamento.`,
    },
    EDITAL: {
      preambulo: `Redija o preâmbulo do edital conforme Art. 25 da Lei 14.133/2021.
Incluir: número do edital, modalidade, critério de julgamento, regime de execução,
fundamentação legal completa, data/hora da sessão. Linguagem oficial conforme
Manual de Redação da Presidência.`,
      habilitacao: `Redija os requisitos de habilitação conforme Arts. 62-70 da Lei 14.133/2021.
Habilitação jurídica (Art. 66), qualificação técnica (Art. 67), qualificação econômico-financeira
(Art. 69), regularidade fiscal e trabalhista (Art. 68). Requisitos proporcionais ao objeto
(Súmula TCU 263). NUNCA exigir além do necessário.`,
      julgamento: `Redija os critérios de julgamento conforme Art. 33 da Lei 14.133/2021.
Definir critérios de aceitabilidade de preços unitários e global (Súmula TCU 259).
Incluir regras de desempate (Art. 60), margem de preferência quando aplicável (Art. 26).`,
    },
    DESPACHO: {
      decisorio: `Redija despacho decisório fundamentado.
Estrutura: (1) Referência ao processo, (2) Fundamento legal, (3) Análise sucinta,
(4) Decisão: AUTORIZO/HOMOLOGO/ADJUDICO. Art. 72 da Lei 14.133/2021 para
contratação direta. Linguagem direta: "AUTORIZO a contratação..." sem rodeios.`,
      ordinatorio: `Redija despacho ordinatório para movimentação processual.
Estrutura: "Ref. Processo nº [X]. [Fundamentação breve]. ENCAMINHE-SE ao [setor]
para [providência]." Opções: ENCAMINHE-SE, JUNTE-SE, PUBLIQUE-SE, ARQUIVE-SE.`,
      interlocutorio: `Redija despacho interlocutório solicitando esclarecimentos.
Estrutura: "Ref. Processo nº [X]. Verificou-se [questão]. SOLICITO esclarecimentos
sobre [ponto específico], no prazo de [X] dias úteis." Ser específico na solicitação.`,
    },
    PORTARIA: {
      nomeacao_comissao: `Redija portaria de nomeação de Comissão de Contratação.
Art. 8º da Lei 14.133/2021. Considerandos: necessidade + fundamentação legal.
RESOLVE: nomear membros (presidente + mínimo 2 membros), definir competências,
prazo de vigência. Incluir: Art. 7º (segregação de funções).`,
      designacao_pregoeiro: `Redija portaria de designação de Pregoeiro.
Art. 8º, §5º da Lei 14.133/2021. Considerar: capacitação mínima exigida,
equipe de apoio, competências delegadas. Incluir: vedações (Art. 9º).`,
      designacao_fiscal: `Redija portaria de designação de Fiscal de Contrato.
Art. 117 da Lei 14.133/2021. Incluir: fiscal técnico + fiscal administrativo
quando aplicável. Definir atribuições conforme contrato. Indicar substituto.`,
    },
    PARECER_JURIDICO: {
      analise: `Redija parecer jurídico conforme Art. 53 da Lei 14.133/2021.
Estrutura: (1) RELATÓRIO — resumo do processo, (2) FUNDAMENTAÇÃO — análise legal
artigo por artigo, (3) CONCLUSÃO — parecer favorável/desfavorável/com ressalvas.
Citar cada dispositivo legal analisado. Seguir modelos AGU (minutas-padrão).
NUNCA emitir parecer genérico sem análise específica do caso.`,
    },
    NOTA_TECNICA: {
      analise: `Redija nota técnica para subsidiar decisão administrativa.
Estrutura: (1) CONTEXTUALIZAÇÃO — problema/demanda, (2) ANÁLISE TÉCNICA —
com dados oficiais (IBGE, PNCP, BCB, SINAPI/DATASUS conforme setor),
(3) CONCLUSÃO — recomendação fundamentada. Incluir fontes de dados com data.
NUNCA usar dados inventados — indicar "[consultar fonte oficial]" se indisponível.`,
    },
    JUSTIFICATIVA_INEXIGIBILIDADE: {
      analise: `Redija justificativa de inexigibilidade conforme Art. 74 da Lei 14.133/2021.
DEMONSTRAR inviabilidade de competição. Para Art. 74, I: comprovar exclusividade
(atestado de fabricante, ACERJ ou Sindicato — vedada preferência por marca).
Para Art. 74, III: demonstrar notória especialização + natureza singular do serviço
(Súmula TCU 252: três requisitos simultâneos). Incluir razão da escolha do fornecedor
e justificativa do preço. Ratificação obrigatória pela autoridade máxima (Art. 72, VIII).`,
    },
    JUSTIFICATIVA_DISPENSA: {
      analise: `Redija justificativa de dispensa conforme Art. 75 da Lei 14.133/2021.
Identificar hipótese legal específica (inciso do Art. 75). Valores 2026 (Dec. 12.807/2025):
Art. 75, I (obras): até R$ 130.984,20 | Art. 75, II (outros): até R$ 65.492,11.
VEDADO fracionamento para enquadramento (Art. 75, §2º). Incluir: justificativa da
escolha do fornecedor + razão do preço (Art. 72, III e IV). Publicação no PNCP obrigatória.`,
    },
  }

  return templates[documentoTipo]?.[secao]
    ?? `Gere conteúdo para a seção "${secao}" do documento "${documentoTipo}".
Siga a Lei 14.133/2021 e normas aplicáveis. Use linguagem técnica e precisa.
NUNCA invente artigos ou dados. Inclua fundamentação legal em cada parágrafo.
Evite expressões vazias como "destaca-se que" ou "é importante ressaltar".`
}
