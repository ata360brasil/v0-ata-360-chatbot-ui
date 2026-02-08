# ATA360 - AUDITOR AGENT
## Análise de Conformidade Multi-Órgão
### TCU + TCEs (Sudeste/DF) + CGU + AGU + CGM
### Versão 2.0 (Revisada) | Janeiro 2026

---

# ⚠️ REGRA CRÍTICA DE CONFIABILIDADE

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│   O AUDITOR É SOMENTE LEITURA. NUNCA MODIFICA DOCUMENTOS.                   │
│                                                                              │
│   ✅ Analisa documentos PRONTOS                                             │
│   ✅ Emite parecer (CONFORME / NÃO CONFORME)                                │
│   ✅ Lista achados e recomendações                                          │
│   ✅ Sugere correções (para decisão humana)                                 │
│                                                                              │
│   ❌ NUNCA modifica conteúdo                                                │
│   ❌ NUNCA preenche campos vazios                                           │
│   ❌ NUNCA aprova automaticamente                                           │
│   ❌ NUNCA assina documentos                                                │
│                                                                              │
│   DECISÃO FINAL: Sempre do servidor público                                 │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

# 1. VISÃO GERAL

## 1.1 O que é o AUDITOR AGENT

O **AUDITOR AGENT** é um agente de **VERIFICAÇÃO** que analisa documentos de contratação pública e emite pareceres de conformidade. Ele atua como um "revisor automático" que identifica problemas, mas **NUNCA corrige ou modifica** os documentos.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     AUDITOR AGENT - FLUXO DE OPERAÇÃO                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  DOCUMENTO PRONTO (gerado pelo DESIGN_LAW_AGENT)                            │
│         │                                                                    │
│         ▼                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                      AUDITOR AGENT                                   │    │
│  │                     (SOMENTE LEITURA)                                │    │
│  │                                                                       │    │
│  │  PODE:                          NÃO PODE:                            │    │
│  │  ✅ Ler documento               ❌ Editar documento                  │    │
│  │  ✅ Verificar campos            ❌ Preencher campos                  │    │
│  │  ✅ Comparar com checklist      ❌ Marcar checklist                  │    │
│  │  ✅ Identificar problemas       ❌ Corrigir problemas                │    │
│  │  ✅ Emitir parecer              ❌ Aprovar automaticamente           │    │
│  │  ✅ Sugerir correções           ❌ Aplicar correções                 │    │
│  │  ✅ Citar jurisprudência        ❌ Inventar jurisprudência           │    │
│  │                                                                       │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│         │                                                                    │
│         ▼                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    RELATÓRIO DE ANÁLISE                              │    │
│  │                                                                       │    │
│  │  • Parecer: CONFORME / NÃO CONFORME / CONFORME COM RESSALVAS        │    │
│  │  • Achados por órgão de controle (TCU, TCE, CGU, CGM)               │    │
│  │  • Recomendações de correção                                         │    │
│  │  • Score de conformidade                                             │    │
│  │                                                                       │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│         │                                                                    │
│         ▼                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    DECISÃO HUMANA                                    │    │
│  │                                                                       │    │
│  │  SERVIDOR PÚBLICO analisa o relatório e DECIDE:                     │    │
│  │                                                                       │    │
│  │  [✅ PROSSEGUIR]  [✏️ CORRIGIR E REENVIAR]  [🗑️ DESCARTAR]          │    │
│  │                                                                       │    │
│  │  ⚠️ O AUDITOR não toma esta decisão automaticamente                 │    │
│  │                                                                       │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 1.2 Princípio Fundamental

> **"Auditor informa, Humano decide."**

O AUDITOR AGENT existe para **ajudar** o servidor público a identificar problemas de conformidade, não para substituir seu julgamento.

---

# 2. ÓRGÃOS DE CONTROLE COBERTOS

## 2.1 Hierarquia

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    HIERARQUIA DE CONTROLE                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  FEDERAL                                                                     │
│  ────────                                                                    │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐                                     │
│  │   TCU   │  │   CGU   │  │   AGU   │                                     │
│  │Controle │  │Controle │  │Consultoria│                                    │
│  │ Externo │  │ Interno │  │ Jurídica │                                     │
│  └─────────┘  └─────────┘  └─────────┘                                     │
│                                                                              │
│  ESTADUAL (Sudeste + DF)                                                    │
│  ────────────────────────                                                    │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐          │
│  │ TCE-MG  │  │ TCE-SP  │  │ TCE-RJ  │  │ TCE-ES  │  │ TC-DF   │          │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘  └─────────┘          │
│                                                                              │
│  MUNICIPAL                                                                   │
│  ─────────                                                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  CGM - Controladoria-Geral do Município (Controle Interno)         │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 2.2 Detecção Automática de Jurisdição

```python
async def detectar_jurisdicao(orgao_cnpj: str) -> list[str]:
    """
    Detecta automaticamente quais órgãos de controle têm jurisdição.
    Retorna lista de códigos (ex: ["TCE-MG", "CGM"])
    """
    
    orgao = await buscar_orgao(orgao_cnpj)
    jurisdicoes = []
    
    # 1. TCE do estado (sempre)
    if orgao.uf == "DF":
        jurisdicoes.append("TC-DF")
    else:
        jurisdicoes.append(f"TCE-{orgao.uf}")
    
    # 2. TCU + CGU (se recursos federais)
    if orgao.esfera == "FEDERAL":
        jurisdicoes.extend(["TCU", "CGU", "AGU"])
    elif await recebe_recurso_federal(orgao_cnpj):
        jurisdicoes.extend(["TCU", "CGU"])
    
    # 3. CGM (municípios)
    if orgao.esfera == "MUNICIPAL":
        jurisdicoes.append("CGM")
    
    return jurisdicoes
```

---

# 3. BASES DE CONHECIMENTO

## 3.1 Regra de Ouro

> **Fundamentação legal vem de LOOKUP TABLES, não de geração LLM.**

O AUDITOR usa tabelas fixas de verificação, auditadas por advogados especializados. Ele **NUNCA inventa** artigos, acórdãos ou jurisprudência.

## 3.2 Estrutura das Lookup Tables

```python
# Tabela FIXA de verificações por documento
# Auditada por advogado especializado em licitações

CHECKLIST_POR_DOCUMENTO = {
    "DFD": {
        "TCU": [
            {
                "codigo": "TCU-DFD-01",
                "verificacao": "Descrição da necessidade presente e fundamentada",
                "fundamento": "Art. 18, I, Lei 14.133/2021",
                "campo": "secao_3.necessidade",
                "obrigatorio": True
            },
            {
                "codigo": "TCU-DFD-02",
                "verificacao": "Estimativa de quantidades com metodologia",
                "fundamento": "Art. 18, II, Lei 14.133/2021",
                "campo": "secao_4.quantidades",
                "obrigatorio": True
            },
            # ... demais verificações
        ],
        "TCE-MG": [
            {
                "codigo": "MG-DFD-01",
                "verificacao": "Formato compatível com SICOM",
                "fundamento": "IN TCE-MG 13/2008",
                "campo": "estrutura",
                "obrigatorio": True
            },
            # ... verificações específicas MG
        ],
        "CGM": [
            {
                "codigo": "CGM-DFD-01",
                "verificacao": "Dotação orçamentária válida",
                "fundamento": "Art. 72, VI, Lei 14.133/2021",
                "campo": "secao_5.dotacao",
                "obrigatorio": True
            },
            # ... verificações CGM
        ]
    },
    
    "ETP": {
        # ... 13 seções verificadas
    },
    
    "TR": {
        # ... 10 seções verificadas
    }
}

# Tabela FIXA de jurisprudência relevante
# Atualizada periodicamente por equipe jurídica

JURISPRUDENCIA = {
    "fracionamento": {
        "acordao": "TCU Acórdão 2.622/2015-P",
        "ementa": "Caracteriza fracionamento a contratação de mesmo objeto...",
        "aplicacao": "Verificar soma de contratações similares em 12 meses"
    },
    "pesquisa_precos": {
        "acordao": "TCE-SP TC-005432/026/21",
        "ementa": "Mínimo 3 fornecedores + consulta PNCP obrigatória...",
        "aplicacao": "Verificar fontes de pesquisa de preços"
    },
    # ... demais jurisprudências catalogadas
}
```

---

# 4. SYSTEM PROMPT

```python
AUDITOR_SYSTEM_PROMPT = """
VOCÊ É AUDITOR_AGENT - Analisador de conformidade para contratações públicas.

# ⚠️ REGRA CRÍTICA - LEIA PRIMEIRO

Você é SOMENTE LEITURA. Você NUNCA modifica documentos.
Sua função é ANALISAR e REPORTAR, não corrigir.
A decisão final é SEMPRE do servidor público.

# 🎯 SUA FUNÇÃO

Analisar documentos de contratação e emitir parecer contendo:
✅ Status de conformidade por órgão (TCU, TCE, CGU, CGM)
✅ Lista de achados (problemas identificados)
✅ Recomendações de correção (para decisão humana)
✅ Score de conformidade

# ⛔ O QUE VOCÊ NÃO PODE FAZER

❌ Modificar o documento analisado
❌ Preencher campos vazios
❌ Corrigir erros automaticamente
❌ Aprovar documento automaticamente
❌ Assinar ou validar documento
❌ Inventar artigos de lei
❌ Inventar acórdãos ou jurisprudência
❌ Tomar decisão pelo servidor

# 📋 BASES DE VERIFICAÇÃO

Use APENAS as verificações fornecidas nas lookup tables.
NÃO invente verificações adicionais.

{checklist_documento}

# 📋 JURISPRUDÊNCIA DISPONÍVEL

Use APENAS a jurisprudência catalogada.
NÃO invente acórdãos ou decisões.

{jurisprudencia_relevante}

# 📋 DOCUMENTO PARA ANÁLISE

{documento_conteudo}

# 📋 FORMATO DE SAÍDA

## PARECER GERAL
[CONFORME | NÃO CONFORME | CONFORME COM RESSALVAS]

## ANÁLISE POR ÓRGÃO

### TCU (Lei 14.133/2021)
| Código | Verificação | Status | Observação |
|--------|-------------|--------|------------|
| TCU-XX-01 | [descrição] | ✅/❌/⚠️ | [detalhe] |

### TCE-{UF}
| Código | Verificação | Status | Observação |
|--------|-------------|--------|------------|
| XX-XX-01 | [descrição] | ✅/❌/⚠️ | [detalhe] |

### CGM
| Código | Verificação | Status | Observação |
|--------|-------------|--------|------------|
| CGM-XX-01 | [descrição] | ✅/❌/⚠️ | [detalhe] |

## ACHADOS

### Achado 1: [Título]
- **Severidade:** ALTA / MÉDIA / BAIXA / INFORMATIVO
- **Descrição:** [O que foi encontrado]
- **Fundamento:** [Artigo/Norma violada - da lookup table]
- **Recomendação:** [Sugestão de correção - para decisão humana]

## SCORE DE CONFORMIDADE
- TCU: XX/XX (XX%)
- TCE: XX/XX (XX%)
- CGM: XX/XX (XX%)
- **GERAL:** XX%

## CONCLUSÃO
[Parecer final com recomendação - decisão é do servidor]

---
⚠️ RELATÓRIO DE ANÁLISE AUTOMÁTICA
Este parecer foi gerado por sistema automatizado.
A decisão sobre prosseguir, corrigir ou descartar é do servidor público.
O AUDITOR_AGENT não modifica documentos nem toma decisões.
---
"""
```

---

# 5. FLUXO DE ANÁLISE

## 5.1 Endpoint de Análise

```typescript
// POST /api/auditor/analisar
router.post('/analisar', async (c) => {
    const { processo_id, documento_tipo } = await c.req.json();
    
    // 1. Buscar documento (somente leitura)
    const documento = await buscarDocumento(processo_id, documento_tipo);
    
    if (!documento) {
        return c.json({ error: "Documento não encontrado" }, 404);
    }
    
    // 2. Detectar jurisdições aplicáveis
    const jurisdicoes = await detectarJurisdicao(documento.orgao_cnpj);
    
    // 3. Carregar checklists (lookup tables)
    const checklists = carregarChecklists(documento_tipo, jurisdicoes);
    
    // 4. Carregar jurisprudência relevante (lookup table)
    const jurisprudencia = carregarJurisprudencia(documento_tipo);
    
    // 5. Executar análise (LLM em modo somente leitura)
    const parecer = await auditorAgent.analisar({
        documento: documento.conteudo,
        checklists: checklists,
        jurisprudencia: jurisprudencia
    });
    
    // 6. Registrar análise (não modifica documento)
    await registrarAnalise({
        processo_id,
        documento_tipo,
        parecer,
        timestamp: new Date().toISOString()
    });
    
    // 7. Retornar relatório (decisão é do usuário)
    return c.json({
        success: true,
        parecer: parecer,
        aviso: "Este é um relatório de análise. A decisão de prosseguir, corrigir ou descartar é sua."
    });
});
```

## 5.2 Estrutura do Parecer

```typescript
interface ParecerAuditor {
    // Metadados
    id: string;
    processo_id: string;
    documento_tipo: string;
    timestamp: string;
    
    // Parecer geral
    status: 'CONFORME' | 'NAO_CONFORME' | 'CONFORME_COM_RESSALVAS';
    
    // Análise por órgão
    analise_por_orgao: {
        [orgao: string]: {
            status: 'CONFORME' | 'NAO_CONFORME' | 'CONFORME_COM_RESSALVAS';
            verificacoes: Verificacao[];
            score: number;  // 0-100
        }
    };
    
    // Achados
    achados: Achado[];
    
    // Score consolidado
    score_geral: number;  // 0-100
    
    // Aviso obrigatório
    aviso: "Relatório de análise automática. Decisão é do servidor público.";
}

interface Verificacao {
    codigo: string;        // Ex: "TCU-DFD-01"
    descricao: string;
    fundamento: string;    // Da lookup table, não inventado
    status: 'ok' | 'falha' | 'alerta';
    observacao?: string;
}

interface Achado {
    titulo: string;
    severidade: 'ALTA' | 'MEDIA' | 'BAIXA' | 'INFORMATIVO';
    descricao: string;
    fundamento: string;    // Da lookup table
    recomendacao: string;  // Sugestão para decisão humana
}
```

---

# 6. O QUE O AUDITOR NÃO FAZ

## 6.1 Exemplos Práticos

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    AUDITOR: O QUE NÃO FAZ (EXEMPLOS)                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  SITUAÇÃO 1: Campo vazio                                                    │
│  ───────────────────────                                                    │
│  ❌ ERRADO: Preencher o campo automaticamente                               │
│  ✅ CERTO:  Reportar "Campo X está vazio (obrigatório por Art. Y)"         │
│                                                                              │
│  SITUAÇÃO 2: Valor incorreto                                                │
│  ──────────────────────────                                                 │
│  ❌ ERRADO: Corrigir o valor                                                │
│  ✅ CERTO:  Reportar "Valor X parece inconsistente. Verificar cálculo."    │
│                                                                              │
│  SITUAÇÃO 3: Fundamentação ausente                                          │
│  ─────────────────────────────────                                          │
│  ❌ ERRADO: Inserir a fundamentação correta                                 │
│  ✅ CERTO:  Reportar "Seção Y sem fundamentação. Deve citar Art. Z."       │
│                                                                              │
│  SITUAÇÃO 4: Documento OK                                                   │
│  ────────────────────────                                                   │
│  ❌ ERRADO: Aprovar e assinar automaticamente                               │
│  ✅ CERTO:  Reportar "Parecer CONFORME" e aguardar decisão humana          │
│                                                                              │
│  SITUAÇÃO 5: Documento com problemas graves                                 │
│  ──────────────────────────────────────────                                 │
│  ❌ ERRADO: Bloquear ou deletar o documento                                 │
│  ✅ CERTO:  Reportar "Parecer NÃO CONFORME" com lista de achados           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 6.2 Validação de Comportamento

```python
def validar_parecer_auditor(parecer: dict, documento_original: dict) -> bool:
    """
    Valida que o AUDITOR não modificou nada.
    Executado após cada análise como verificação de segurança.
    """
    
    # 1. Documento original não pode ter sido alterado
    documento_atual = buscar_documento(parecer["processo_id"], parecer["documento_tipo"])
    
    if documento_atual.hash != documento_original.hash:
        raise AuditorViolationError(
            "ERRO CRÍTICO: Documento foi modificado durante análise. "
            "O AUDITOR_AGENT não pode modificar documentos."
        )
    
    # 2. Parecer não pode conter ações de modificação
    acoes_proibidas = ["modificar", "alterar", "corrigir", "inserir", "deletar"]
    
    for acao in parecer.get("acoes_executadas", []):
        if any(p in acao.lower() for p in acoes_proibidas):
            raise AuditorViolationError(
                f"ERRO CRÍTICO: AUDITOR executou ação proibida: {acao}"
            )
    
    # 3. Todos os fundamentos devem vir das lookup tables
    for achado in parecer.get("achados", []):
        if achado["fundamento"] not in FUNDAMENTOS_VALIDOS:
            raise AuditorViolationError(
                f"ERRO: Fundamento não catalogado: {achado['fundamento']}. "
                "AUDITOR não pode inventar fundamentação."
            )
    
    return True
```

---

# 7. INTEGRAÇÃO COM FLUXO

## 7.1 Quando o AUDITOR é Chamado

```python
# O AUDITOR é chamado DEPOIS que o documento está pronto
# Ele NUNCA participa da geração

async def fluxo_documento_com_auditoria(processo_id: str, tipo: str, dados: dict):
    """Fluxo completo: geração + auditoria (opcional)"""
    
    # ETAPA 1: Gerar documento (DESIGN_LAW_AGENT - sem LLM)
    pdf = await design_law_agent.gerar(tipo, dados)
    
    # ETAPA 2: Salvar documento
    doc = await salvar_documento(processo_id, tipo, pdf)
    
    # ETAPA 3: Auditoria automática (opcional, configurável)
    if config.auditoria_automatica:
        parecer = await auditor_agent.analisar(doc)
        
        # Apenas INFORMA o usuário, não bloqueia
        await notificar_usuario(
            titulo=f"Análise de conformidade: {parecer.status}",
            mensagem="Revise o parecer antes de prosseguir.",
            parecer=parecer
        )
    
    # ETAPA 4: Decisão é SEMPRE do usuário
    return {
        "documento": doc,
        "parecer": parecer if config.auditoria_automatica else None,
        "proxima_acao": "Revise o documento e o parecer. Decisão é sua."
    }
```

---

# 8. CUSTOS E PERFORMANCE

## 8.1 Estimativa de Custos

```
AUDITOR AGENT v2 - Custo por Análise

Input (documento + checklists + jurisprudência):
- Documento: ~5.000 tokens
- Checklists: ~3.000 tokens
- Jurisprudência: ~2.000 tokens
- Prompt: ~2.000 tokens
─────────────────────────────
Total input: ~12.000 tokens

Output (parecer): ~2.000 tokens

Custo por análise:
┌─────────────┬────────────┬────────────┐
│ Modelo      │ Input      │ Total      │
├─────────────┼────────────┼────────────┤
│ Sonnet 3.5  │ ~$0.04     │ ~$0.06     │
│ Opus 4      │ ~$0.18     │ ~$0.25     │
└─────────────┴────────────┴────────────┘

Recomendação: Sonnet 3.5 para análises rotineiras
              Opus 4 para contratos > R$ 1M
```

## 8.2 Performance

```
Tempo de análise:

1. Carregar documento: ~100ms
2. Carregar checklists: ~50ms
3. Análise LLM: 5-10s
4. Validação (não modificou): ~50ms
5. Registro: ~100ms
─────────────────────────────
TOTAL: 6-11 segundos
```

---

# 9. RESUMO: O QUE MUDOU NA v2

| Aspecto | v1 (Anterior) | v2 (Atual) |
|---------|---------------|------------|
| Papel | Ambíguo | **SOMENTE LEITURA** explícito |
| Modifica documentos | Possível | **BLOQUEADO** |
| Preenche campos | Possível | **BLOQUEADO** |
| Aprova automaticamente | Possível | **BLOQUEADO** |
| Fundamentação | Gerada por LLM | **Lookup table fixa** |
| Jurisprudência | Gerada por LLM | **Catálogo auditado** |
| Output | Parecer final | **Parecer para decisão humana** |
| Validação | Nenhuma | **Verifica se não modificou** |

---

---

# 10. ATUALIZAÇÕES v3 (Fevereiro 2026)

## 10.1 Abordagem Hibrida: LLM vs. Deterministico

O AUDITOR v3 usa abordagem HIBRIDA (documentada em spec consolidada Part 20.13):

| Etapa | Metodo | Motivo |
|-------|--------|--------|
| Carregar checklists | Deterministico (lookup table) | Regras fixas auditadas |
| Verificar campo preenchido | Deterministico (null check) | Nao precisa IA |
| Verificar coerencia de texto | **LLM** (interpretacao) | Linguagem natural |
| Verificar valor vs limites | Deterministico (comparacao) | Regra fixa |
| Comparar com jurisprudencia | Deterministico (lookup match) | Catalogada |
| Gerar texto achado/recomendacao | **LLM** (redacao) | Contextualizar |
| Calcular score | Deterministico (formula fixa) | Peso × criterio |
| Emitir parecer final | Deterministico (threshold) | CONFORME se >= X |

**Principio:** LLM para INTERPRETAR. Lookup table para FUNDAMENTAR. Formula fixa para DECIDIR.

## 10.2 Integracao com Fluxo Ciclico (Part 20)

O AUDITOR e chamado no passo 4 do fluxo ciclico:
- DESIGN_LAW gera artefato → AUDITOR analisa → OUTPUT ao usuario
- Se usuario EDITA → DESIGN_LAW regenera → AUDITOR REAVALIA automaticamente
- Max 5 reauditorias por documento
- Cada reauditoria gera novo parecer (nao sobrescreve anterior)

## 10.3 Resultado Tripartido Expandido

```
CONFORME                   → selo_aprovado = true
CONFORME_COM_RESSALVAS     → selo depende de correcao/criticidade
NAO_CONFORME               → selo_aprovado = false (se usuario insistir)
```

O resultado alimenta o calculo de `selo_aprovado` pelo Orquestrador (Part 20.6).
O AUDITOR NUNCA decide o selo — apenas emite o parecer. A decisao e do Orquestrador + usuario.

## 10.4 Base Juridica Expandida

- Jurisprudencia: 560+ referencias (Manual TCU 5a Ed., Ago/2025)
- LINDB: Arts. 20, 22, 28 aplicados na analise de contexto
- Decreto 12.807/2025: valores 2026 nos limites de dispensa/fracionamento
- Simulacao trilhas Alice (CGU): pre-validacao
- Verificacao LINDB Art. 22: contexto do ente (IDH, orcamento, estrutura)

## 10.5 Custos Atualizados

| Modelo | Uso | Custo/analise |
|--------|-----|---------------|
| Haiku (80%) | Analises rotineiras, docs simples | ~R$ 0,05 |
| Sonnet (15%) | Docs complexos, ETP, TR | ~R$ 0,30 |
| Opus (5%) | Contratos > R$ 1M, auditorias criticas | ~R$ 1,25 |

---

*Especificação técnica AUDITOR AGENT v3.0*
*ATA360 - Sistema de Inteligência em Contratações Públicas*
*Análise de Conformidade Multi-Órgão*
*SOMENTE LEITURA - Decisão é do Servidor Público*
*Abordagem Hibrida: LLM para interpretar, Lookup para fundamentar*
*Fevereiro 2026*
