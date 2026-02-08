# ATA360 - DESIGN LAW AGENT
## Motor de Geração de Documentos Jurídicos
### 100% Determinístico - Zero LLM
### Versão 3.0 (Revisada) | Janeiro 2026

---

# ⚠️ REGRA CRÍTICA DE CONFIABILIDADE

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│   O DESIGN_LAW_AGENT NÃO USA LLM. É 100% DETERMINÍSTICO.                    │
│                                                                              │
│   ✅ Mesmo input = Mesmo output, SEMPRE                                     │
│   ✅ Templates HTML/CSS estáticos                                           │
│   ✅ Fundamentação legal de lookup tables (auditadas por advogado)          │
│   ✅ Cálculos em código Python                                              │
│   ✅ Dados vêm do usuário ou APIs oficiais                                  │
│                                                                              │
│   ❌ ZERO geração de texto por IA                                           │
│   ❌ ZERO preenchimento automático de campos                                │
│   ❌ ZERO decisões criativas                                                │
│                                                                              │
│   PRINCÍPIO: Documento é espelho de dados validados                         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

# 1. VISÃO GERAL

## 1.1 Pipeline Determinístico

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                 DESIGN_LAW_AGENT - PIPELINE 100% DETERMINÍSTICO              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ENTRADA                           PROCESSAMENTO              SAÍDA          │
│  ───────                           ─────────────              ─────          │
│                                                                              │
│  ┌──────────────┐                                                           │
│  │ Input usuário│──┐                                                        │
│  └──────────────┘  │                                                        │
│  ┌──────────────┐  │     ┌─────────────────────────┐     ┌────────────┐    │
│  │ APIs oficiais│──┼────▶│  1. Config YAML         │────▶│            │    │
│  └──────────────┘  │     │  2. Lookup tables       │     │    PDF     │    │
│  ┌──────────────┐  │     │  3. Jinja2 render       │     │            │    │
│  │ Contexto proc│──┤     │  4. WeasyPrint          │     │ Hash+QR    │    │
│  └──────────────┘  │     │  5. Hash SHA-256        │     │ Versão     │    │
│  ┌──────────────┐  │     └─────────────────────────┘     └────────────┘    │
│  │ ACMA aprovado│──┘                                                        │
│  └──────────────┘        ⚡ ZERO LLM em todo pipeline                       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 1.2 Componentes

| Componente | Função | LLM? |
|------------|--------|------|
| **Config YAML** | Define seções, campos, checklist | ❌ Não |
| **Lookup Tables** | Fundamentação legal | ❌ Não |
| **Templates HTML** | Estrutura visual | ❌ Não |
| **Design System CSS** | Estilo visual | ❌ Não |
| **Jinja2** | Renderização | ❌ Não |
| **WeasyPrint** | HTML → PDF | ❌ Não |
| **Python** | Cálculos, validação | ❌ Não |

---

# 2. CATÁLOGO DE DOCUMENTOS (14 TEMPLATES)

| Código | Documento | Seções | Trilha |
|--------|-----------|--------|--------|
| `DFD` | Documento de Formalização da Demanda | 5 | 20% |
| `ETP` | Estudo Técnico Preliminar | 13 | 30% |
| `PP` | Pesquisa de Preços | 7 | 40% |
| `TR` | Termo de Referência | 10 | 50% |
| `MR` | Mapa de Riscos | 5 | 60% |
| `JCD` | Justificativa Contratação Direta | 8 | - |
| `ARP` | Termo de Adesão à ARP | 6 | - |
| `OFG` | Ofício ao Gerenciador | 4 | - |
| `AUG` | Autorização do Gerenciador | 4 | - |
| `OFF` | Ofício ao Fornecedor | 4 | - |
| `ACF` | Aceite do Fornecedor | 5 | - |
| `COM` | Comunicado ao Contratante | 4 | - |
| `REC` | Recusa do Fornecedor | 5 | - |
| `PCA` | Plano de Contratações Anual | 6 | 10% |

---

# 3. LOOKUP TABLES (FUNDAMENTAÇÃO LEGAL)

## 3.1 Princípio

> **Fundamentação vem de TABELA FIXA, nunca de LLM.**

```python
# Auditada por advogado especializado em licitações
# Versionada no Git, revisão obrigatória a cada alteração legal

FUNDAMENTACAO_LEGAL = {
    "DFD": {
        "secao_1": "Art. 7º, I a III, Decreto 10.947/2022",
        "secao_2": "Art. 6º, XXIII, Lei 14.133/2021",
        "secao_3": "Art. 18, I, Lei 14.133/2021",
        "secao_4": "Art. 18, II e III, Lei 14.133/2021",
        "secao_5": "Art. 18, VII, Lei 14.133/2021",
        "checklist": {
            "unidade": "Art. 7º, I, Dec. 10.947/2022",
            "objeto": "Art. 6º, XXIII, Lei 14.133/2021",
            "justificativa": "Art. 18, I, Lei 14.133/2021",
            "quantitativos": "Art. 18, II, Lei 14.133/2021",
            "valor": "Art. 18, III, Lei 14.133/2021",
            "pca": "Art. 18, VII, Lei 14.133/2021",
            "dotacao": "Art. 72, VI, Lei 14.133/2021",
        }
    },
    "ETP": {
        "secao_1": "Art. 18, §1º, I, Lei 14.133/2021",
        "secao_2": "Art. 18, §1º, II, Lei 14.133/2021",
        # ... 13 seções mapeadas
    },
    "TR": {
        "secao_1": "Art. 6º, XXIII, a, Lei 14.133/2021",
        # ... 10 seções mapeadas
    },
    # ... demais documentos
}

def get_fundamentacao(doc: str, secao: str) -> str:
    """Busca fundamentação. NUNCA inventa."""
    try:
        return FUNDAMENTACAO_LEGAL[doc][secao]
    except KeyError:
        raise FundamentacaoNaoEncontrada(f"{doc}.{secao} não catalogada")
```

---

# 4. FLUXO DE GERAÇÃO

```python
async def gerar_documento(tipo: str, dados: dict, contexto: dict) -> bytes:
    """
    Gera documento PDF - 100% DETERMINÍSTICO
    
    Mesmo input = Mesmo output, SEMPRE.
    Zero LLM em qualquer etapa.
    """
    
    # 1. Carregar config (YAML estático)
    config = carregar_config(tipo)
    
    # 2. Mesclar dados (herança + novos)
    dados_completos = {**contexto.get('compartilhado', {}), **dados}
    
    # 3. Validar campos obrigatórios (regras fixas)
    validar_campos(dados_completos, config)
    
    # 4. Calcular totais (Python, não LLM)
    dados_completos['valor_total'] = sum(
        i['quantidade'] * i['valor_unitario'] 
        for i in dados_completos.get('itens', [])
    )
    
    # 5. Buscar fundamentação (lookup table, não LLM)
    fundamentacao = {
        secao['numero']: get_fundamentacao(tipo, f"secao_{secao['numero']}")
        for secao in config['secoes']
    }
    
    # 6. Gerar checklist (validação por regras, não LLM)
    checklist = [
        {
            'texto': item['texto'],
            'fundamento': get_fundamentacao(tipo, item['fundamento_key']),
            'status': 'ok' if all(dados_completos.get(c) for c in item['campos']) else 'pendente'
        }
        for item in config['checklist']
    ]
    
    # 7. Renderizar HTML (Jinja2, não LLM)
    html = jinja_env.get_template('base.html').render(
        config=config,
        dados=dados_completos,
        fundamentacao=fundamentacao,
        checklist=checklist,
        declaracoes=DECLARACOES_PADRAO,
        trilha=calcular_trilha(tipo)
    )
    
    # 8. Converter para PDF (WeasyPrint, não LLM)
    pdf = HTML(string=html).write_pdf()
    
    # 9. Calcular hash (integridade)
    hash_pdf = hashlib.sha256(pdf).hexdigest()
    
    return pdf, hash_pdf
```

---

# 5. INTEGRAÇÃO COM ACMA

## 5.1 Justificativa: Duas Origens Possíveis

```python
async def obter_justificativa(processo_id: str, dados: dict) -> str:
    """
    Justificativa pode vir de:
    1. Input direto do usuário (digitada)
    2. Sugestão ACMA APROVADA pelo usuário
    
    NUNCA usa texto de IA sem aprovação humana.
    """
    
    if dados.get('usar_sugestao_acma'):
        # Buscar sugestão APROVADA (não rascunho)
        sugestao = await buscar_sugestao_aprovada(processo_id)
        
        if not sugestao:
            raise SugestaoNaoAprovadaError(
                "Gere uma sugestão ACMA e aprove antes de continuar."
            )
        
        # Retorna texto que servidor APROVOU
        return sugestao.texto_final
    
    else:
        # Texto digitado diretamente pelo usuário
        if not dados.get('justificativa'):
            raise CampoObrigatorioError("Justificativa não preenchida")
        
        return dados['justificativa']
```

## 5.2 Fluxo Visual

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     ORIGEM DA JUSTIFICATIVA                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  OPÇÃO A: Digitação direta                                                  │
│  ─────────────────────────                                                  │
│  Usuário ──▶ [Formulário] ──▶ DESIGN_LAW ──▶ PDF                           │
│              (digita texto)                                                  │
│                                                                              │
│  OPÇÃO B: Sugestão ACMA                                                     │
│  ──────────────────────────                                                 │
│  Usuário ──▶ [ACMA gera] ──▶ [⚠️ REVISÃO] ──▶ [✅ APROVA] ──▶ DESIGN_LAW   │
│              (sugestão)      (obrigatória)     (humano)        ──▶ PDF     │
│                                                                              │
│  ⛔ Caminho que NÃO existe:                                                 │
│  ─────────────────────────                                                  │
│  ACMA ──▶ DESIGN_LAW ──▶ PDF  (SEM APROVAÇÃO HUMANA = BLOQUEADO)           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

# 6. DECLARAÇÕES PADRÃO

```python
# Texto FIXO, não gerado por IA
DECLARACOES_PADRAO = {
    "titulo": "Declarações e Termo de Aceite",
    "preambulo": "O(s) signatário(s), na qualidade de agente(s) público(s), DECLARA(M) que:",
    "itens": [
        {
            "numero": "I",
            "texto": "As informações prestadas são verdadeiras e refletem a real necessidade da Administração",
            "fundamento": "Dec. 10.947/2022, Art. 7º"
        },
        {
            "numero": "II",
            "texto": "Este documento foi elaborado em observância aos princípios da legalidade, impessoalidade, moralidade e eficiência",
            "fundamento": "CF/88, Art. 37 c/c Lei 14.133/2021, Art. 5º"
        },
        {
            "numero": "III",
            "texto": "Não possuo conflito de interesses nem vínculo com potenciais fornecedores que possa comprometer a imparcialidade do processo",
            "fundamento": "Lei 14.133/2021, Art. 9º"
        },
        {
            "numero": "IV",
            "texto": "Tenho ciência dos deveres funcionais e das responsabilidades inerentes à minha atuação em processos de contratação pública",
            "fundamento": None
        },
        {
            "numero": "V",
            "texto": "Este documento foi elaborado com auxílio de ferramenta tecnológica, cabendo ao signatário a validação do conteúdo",
            "fundamento": "Lei 14.133/2021, Art. 11, IV"
        },
        {
            "numero": "VI",
            "texto": "Aceito as condições declaradas e autorizo o prosseguimento do processo, ciente de que os dados poderão ser compartilhados com órgãos de controle para fins de fiscalização",
            "fundamento": None
        }
    ],
    "base_legal": "CF/88, Art. 37 | Lei 14.133/2021 | Dec. 10.947/2022 | Lei 12.813/2013"
}
```

---

# 7. CUSTOS E PERFORMANCE

## 7.1 Custos

```
DESIGN_LAW_AGENT - Custo por Documento

LLM: R$ 0,00 (não usa)

WeasyPrint: Gratuito (open source)
Jinja2: Gratuito (open source)
Python: Gratuito

Storage (R2): ~R$ 0,01 por PDF

TOTAL POR DOCUMENTO: ~R$ 0,01
```

## 7.2 Performance

```
Tempo de geração:

1. Carregar config: ~10ms
2. Mesclar dados: ~5ms
3. Validar campos: ~10ms
4. Calcular totais: ~5ms
5. Buscar fundamentação: ~5ms
6. Gerar checklist: ~10ms
7. Renderizar HTML: ~50ms
8. WeasyPrint → PDF: ~800ms
9. Hash SHA-256: ~10ms
────────────────────────────
TOTAL: ~900ms (<1 segundo)
```

---

# 8. RESUMO: O QUE MUDOU NA v3

| Aspecto | v2 (Anterior) | v3 (Atual) |
|---------|---------------|------------|
| Uso de LLM | Mencionado em alguns pontos | **ZERO - explicitamente proibido** |
| Fundamentação | Poderia ser gerada | **Somente lookup table** |
| Justificativa | Ambíguo | **Usuário OU ACMA aprovado** |
| Determinismo | Implícito | **Garantia explícita** |
| Custo de IA | Variável | **R$ 0,00** |

---

# 9. GARANTIAS

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    GARANTIAS DO DESIGN_LAW v3                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ✅ Zero LLM em qualquer etapa                                              │
│  ✅ Mesmo input = Mesmo output (100% determinístico)                        │
│  ✅ Fundamentação legal auditada por advogado                               │
│  ✅ Cálculos verificáveis em código Python                                  │
│  ✅ Rastreabilidade total (hash + QR + versão)                              │
│  ✅ Justificativa sempre validada por humano                                │
│  ✅ Custo zero de IA                                                        │
│  ✅ Geração em menos de 1 segundo                                           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

---

# 10. ATUALIZAÇÕES v3.1 (Fevereiro 2026)

## 10.1 Migracao Python → TypeScript/Edge

A spec v3 usa **Python como pseudocodigo** para clareza. A implementacao real sera:

| Aspecto | Spec (pseudocodigo) | Implementacao (producao) |
|---------|---------------------|--------------------------|
| Linguagem | Python | **TypeScript** |
| Runtime | WeasyPrint local | **Cloudflare Worker (edge)** |
| PDF engine | WeasyPrint | **Puppeteer/Chromium ou equivalente edge** |
| Template engine | Jinja2 | **Nunjucks (Jinja2-compatible para JS)** |
| Config | YAML (identico) | **YAML (identico)** |
| Lookup tables | Python dict | **D1 SQLite ou KV** |
| Storage | Filesystem | **Cloudflare R2** |

**Principio preservado:** ZERO LLM em qualquer etapa. 100% deterministico.
A migracao e de RUNTIME, nao de LOGICA.

## 10.2 Variavel selo_aprovado

O DESIGN_LAW v3.1 recebe a variavel `selo_aprovado` (boolean) do Orquestrador:

```typescript
// No passo 7 do fluxo ciclico (Finalizacao):
const artefato = await designLaw.gerar({
    yaml_config: config,
    dados: dadosProcesso,
    texto_aprovado: textoAprovadoPeloUsuario,
    selo_aprovado: orquestrador.calcularSelo(parecer, decisaoUsuario)
});

// No template (documento_base_v8.html):
// {% if selo_aprovado %} → renderiza selo holografico
// {% endif %} → ausencia silenciosa se false
```

Ver spec consolidada Part 19.10 (Selo de Qualidade) e Part 20.6 (calculo).

## 10.3 Integracao com Fluxo Ciclico (Part 20)

- DESIGN_LAW e chamado no passo 3 do fluxo ciclico
- Se usuario EDITA campos → DESIGN_LAW REGENERA com novos dados
- Cada regeneracao produz novo hash SHA-256 e nova versao
- Regeneracao FINAL (passo 7) inclui selo + metadados de carimbo SERPRO
- Max 5 regeneracoes por documento (limite do loop)

## 10.4 Template Universal v8

O `documento_base_v8.html` agora renderiza TODOS os 46 tipos de artefato:
- 14 existentes (v7.1) + 6 P0 (YAML pronto) + 11 P1 + 15 P2
- Arquitetura config-driven: novo artefato = nova entrada YAML, zero codigo
- 15 blocos na ordem: Cabecalho → ID → Fundamentacao → Rastreabilidade →
  Contexto → Resumo → Sumario → Secoes → Checklist → Normativos →
  Declaracoes → Assinaturas → Versoes → Trilha → Selo
- Ver spec consolidada Part 17 (Documento Mestre) e Part 18 (Catalogo)

---

*Especificação técnica DESIGN_LAW_AGENT v3.1*
*ATA360 - Sistema de Inteligência em Contratações Públicas*
*Motor de Geração 100% Determinístico - Zero LLM*
*Migracao edge: TypeScript + Cloudflare Workers*
*Fevereiro 2026*
