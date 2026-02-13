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
      solucoes: `Analise soluções disponíveis no mercado para atender a necessidade.
Art. 18, §1º, II. Comparar pelo menos 3 alternativas com prós e contras.
Considerar: funcionalidade, custo-benefício, sustentabilidade, padrão de mercado.`,
      viabilidade: `Elabore a declaração de viabilidade técnica da contratação.
Art. 18, §1º, XI. Justificar a solução escolhida com base na análise comparativa.
Indicar parcelamento quando aplicável (Art. 40, §3º).`,
    },
    TR: {
      especificacao: `Redija a especificação técnica para o Termo de Referência.
Art. 40, I da Lei 14.133/2021. Descrição clara, precisa, sem marca.
Incluir características técnicas mínimas e aceitáveis.`,
      obrigacoes: `Redija obrigações do contratante e contratado.
Equilibrar direitos e deveres. Art. 92 da Lei 14.133/2021.
Incluir prazos, penalidades, e condições de pagamento.`,
      fundamentacao: `Elabore a fundamentação legal do Termo de Referência.
Citar artigos da Lei 14.133/2021 aplicáveis. Incluir normativos setoriais.
Referenciar ETP quando existir. Justificar critérios de aceitação.`,
      fiscalizacao: `Defina o modelo de gestão e fiscalização contratual.
Art. 117 da Lei 14.133/2021. Gestor e fiscal designados.
Critérios de medição, atestação, recebimento provisório e definitivo.`,
    },
    DFD: {
      justificativa: `Redija a justificativa da demanda para o DFD.
Art. 12, VII da Lei 14.133/2021. Vincular à necessidade do setor requisitante.
Demonstrar alinhamento com o PCA. Quantificar a necessidade (volume, frequência).`,
      quantitativo: `Elabore o detalhamento quantitativo da demanda.
Especificar itens, quantidades, unidades de medida.
Justificar as quantidades com base em consumo histórico ou projeção fundamentada.`,
      requisitante: `Identifique o setor requisitante e responsável pela demanda.
Nome completo, cargo, matrícula do demandante.
Autorização da autoridade competente conforme Dec. 10.947/2022.`,
    },
    PP: {
      metodologia: `Descreva a metodologia de pesquisa de preços conforme IN SEGES 65/2021.
Art. 5º: ordem de prioridade das fontes (PNCP, Compras.gov, BEC, cotações).
Mínimo 3 fontes. Justificar se não atingir o mínimo.`,
      analise: `Analise os preços coletados e calcule o valor estimado.
Apresentar: média, mediana, desvio padrão, coeficiente de variação.
Identificar e tratar outliers (IQR/Tukey). Justificar a métrica escolhida.
Se CV > 25%, justificar a dispersão de preços.`,
      conclusao: `Conclua a pesquisa de preços com o valor de referência.
Declarar o valor estimado e a métrica utilizada (mediana recomendada pela IN 65).
Mencionar sazonalidade, se aplicável. Indicar validade da pesquisa.`,
    },
    JCD: {
      fundamentacao_legal: `Fundamente legalmente a contratação direta.
Art. 72-75 da Lei 14.133/2021. Enquadrar com precisão:
- Dispensa (Art. 75, incisos I a XVI)
- Inexigibilidade (Art. 74, incisos I a V)
Citar jurisprudência TCU quando reforçar o enquadramento.`,
      enquadramento_modalidade: `Demonstre o enquadramento na modalidade de contratação direta.
Valores limites conforme Dec. 12.807/2025. Vedações do Art. 75, §1º.
Se inexigibilidade: comprovar inviabilidade de competição.
LINDB Arts. 20-22: considerar consequências práticas da decisão.`,
      justificativa: `Redija a justificativa da contratação direta.
Demonstrar que a contratação atende ao interesse público.
Incluir: razão da escolha do fornecedor, justificativa de preço.
Art. 72, parágrafo único: ratificação pela autoridade superior.`,
    },
    MR: {
      identificacao: `Identifique os riscos da contratação.
Art. 18, §1º, X da Lei 14.133/2021. Categorias:
- Riscos operacionais, financeiros, legais, reputacionais
- Riscos de mercado (fornecimento, qualidade, prazo)
Usar matriz de probabilidade × impacto.`,
      analise_risco: `Analise e classifique cada risco identificado.
Atribuir probabilidade (1-5) e impacto (1-5). Calcular criticidade.
Classificar: baixo (1-6), médio (7-14), alto (15-20), crítico (21-25).
Priorizar riscos críticos e altos para tratamento.`,
      tratamento: `Proponha ações de tratamento para os riscos identificados.
Estratégias: mitigar, transferir, aceitar, evitar.
Definir responsável e prazo para cada ação.
Incluir contingências para riscos críticos.`,
    },
    ARP: {
      justificativa: `Justifique a utilização do Sistema de Registro de Preços.
Art. 82 e 83 da Lei 14.133/2021. Demonstrar que o objeto atende critérios:
- Entregas parceladas, múltiplos órgãos, demanda incerta
- Natureza padronizada do objeto.`,
      especificacao: `Especifique os itens para registro de preços.
Descrição detalhada de cada item/lote. CATMAT/CATSER quando aplicável.
Quantidades máximas e mínimas. Prazo de vigência da ARP (até 2 anos, Art. 84).`,
    },
  }

  return templates[documentoTipo]?.[secao]
    ?? `Gere conteúdo para a seção "${secao}" do documento "${documentoTipo}".
Siga a Lei 14.133/2021 e normas aplicáveis. Use linguagem técnica e precisa.`
}
