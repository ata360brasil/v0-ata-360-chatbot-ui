# ATA360 - ACMA AGENT
## Assistente de Compras Municipais Avançado
### Geração de SUGESTÕES de Justificativas para Editais
### Versão 2.0 (Revisada) | Janeiro 2026

---

# ⚠️ REGRA CRÍTICA DE CONFIABILIDADE

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│   O ACMA GERA SUGESTÕES, NUNCA CONTEÚDO FINAL.                              │
│                                                                              │
│   ✅ Output sempre rotulado como "SUGESTÃO GERADA POR IA"                   │
│   ✅ NUNCA inserido diretamente no documento                                │
│   ✅ OBRIGATÓRIO: Revisão e aprovação por servidor público                  │
│   ✅ Registro em audit_log de quem aprovou e o que alterou                  │
│                                                                              │
│   RESPONSABILIDADE: 100% do servidor que aprova                             │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

# 1. VISÃO GERAL

## 1.1 O que é o ACMA

O **ACMA (Assistente de Compras Municipais Avançado)** é um agente que gera **SUGESTÕES** de justificativas técnicas para editais de licitação municipal.

**IMPORTANTE:** O ACMA NÃO gera documentos finais. Ele produz rascunhos que DEVEM ser revisados e aprovados por um servidor público antes de serem utilizados.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      ACMA - FLUXO COM REVISÃO HUMANA                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ENTRADA DO USUÁRIO                                                          │
│  ─────────────────────                                                       │
│  "Lagoa Santa/MG, óleo diesel frota SUS, 20.000L, R$180k, recorrente"       │
│                                                                              │
│         │                                                                    │
│         ▼                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ 1. ENRIQUECIMENTO AUTOMÁTICO (APIs Oficiais)                        │    │
│  │    • IBGE SIDRA: população, renda, estrutura                        │    │
│  │    • PNCP: histórico compras 3 anos, fornecedores, execução         │    │
│  │    • SICONFI: LOA por função, execução orçamentária                 │    │
│  │    • Portal Transparência: CEIS/CNEP                                │    │
│  │                                                                       │    │
│  │    ⚡ Dados 100% de APIs oficiais (não inventados)                   │    │
│  └─────────────────────────┬───────────────────────────────────────────┘    │
│                            │                                                 │
│                            ▼                                                 │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ 2. GERAÇÃO DE SUGESTÃO (LLM)                                        │    │
│  │    • Estrutura em 7 seções                                          │    │
│  │    • Dados concretos das APIs                                       │    │
│  │    • Zero termos genéricos                                           │    │
│  │    • Citação de fontes oficiais                                      │    │
│  │                                                                       │    │
│  │    ⚠️ Output é SUGESTÃO, não conteúdo final                         │    │
│  └─────────────────────────┬───────────────────────────────────────────┘    │
│                            │                                                 │
│                            ▼                                                 │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ 3. APRESENTAÇÃO AO USUÁRIO                                          │    │
│  │                                                                       │    │
│  │  ┌───────────────────────────────────────────────────────────────┐  │    │
│  │  │  ⚠️ SUGESTÃO GERADA POR INTELIGÊNCIA ARTIFICIAL              │  │    │
│  │  │                                                                 │  │    │
│  │  │  Este texto foi gerado automaticamente com base em dados      │  │    │
│  │  │  oficiais. REVISE CUIDADOSAMENTE antes de aprovar.            │  │    │
│  │  │                                                                 │  │    │
│  │  │  A responsabilidade pelo conteúdo final é do servidor         │  │    │
│  │  │  público que aprovar esta sugestão.                           │  │    │
│  │  │                                                                 │  │    │
│  │  │  [Texto da sugestão...]                                        │  │    │
│  │  │                                                                 │  │    │
│  │  │  [✏️ EDITAR]    [✅ APROVAR]    [🗑️ REJEITAR]                  │  │    │
│  │  └───────────────────────────────────────────────────────────────┘  │    │
│  │                                                                       │    │
│  └─────────────────────────┬───────────────────────────────────────────┘    │
│                            │                                                 │
│                            ▼                                                 │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ 4. REVISÃO HUMANA OBRIGATÓRIA                                       │    │
│  │                                                                       │    │
│  │    SERVIDOR PÚBLICO:                                                 │    │
│  │    • Lê a sugestão completa                                         │    │
│  │    • Verifica dados e fontes citadas                                │    │
│  │    • Edita o que for necessário                                     │    │
│  │    • DECIDE: Aprovar, Editar+Aprovar ou Rejeitar                   │    │
│  │                                                                       │    │
│  │    ⛔ Sem aprovação humana = Não vai para documento                 │    │
│  └─────────────────────────┬───────────────────────────────────────────┘    │
│                            │                                                 │
│                            ▼                                                 │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ 5. REGISTRO DE AUDITORIA                                            │    │
│  │                                                                       │    │
│  │    {                                                                  │    │
│  │      "timestamp": "2026-01-29T14:35:00Z",                           │    │
│  │      "acao": "sugestao_acma_aprovada",                              │    │
│  │      "usuario": "Maria Silva Santos",                                │    │
│  │      "matricula": "12345",                                           │    │
│  │      "texto_original_hash": "abc123...",                            │    │
│  │      "texto_final_hash": "def456...",                               │    │
│  │      "foi_editado": true,                                            │    │
│  │      "ip": "192.168.1.100"                                          │    │
│  │    }                                                                  │    │
│  │                                                                       │    │
│  └─────────────────────────┬───────────────────────────────────────────┘    │
│                            │                                                 │
│                            ▼                                                 │
│  SAÍDA: TEXTO APROVADO ────► DESIGN_LAW_AGENT ────► PDF FINAL               │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 1.2 Diferencial de Confiabilidade

| Aspecto | ACMA v1 (Anterior) | ACMA v2 (Atual) |
|---------|-------------------|-----------------|
| Output | Conteúdo "pronto" | **SUGESTÃO** rotulada |
| Inserção no documento | Direta | **Após aprovação humana** |
| Responsabilidade | Ambígua | **100% do servidor** |
| Auditoria | Parcial | **Completa** (antes/depois) |
| Risco de alucinação | Médio | **Controlado** |

---

# 2. FONTES DE DADOS

## 2.1 Regra de Ouro

> **O ACMA só usa dados de APIs oficiais. NUNCA inventa dados.**

Se um dado não estiver disponível nas APIs, o ACMA:
1. Informa que o dado não foi encontrado
2. Solicita que o usuário forneça
3. **NUNCA** preenche com valor inventado

## 2.2 APIs Utilizadas

```yaml
APIS_ACMA:
  ibge_sidra:
    descricao: "Dados demográficos e econômicos"
    url: "https://servicodados.ibge.gov.br/api/v3/agregados"
    dados:
      - população municipal
      - PIB per capita
      - estrutura econômica
    confiança: ALTA
    
  pncp:
    descricao: "Histórico de compras públicas"
    url: "https://pncp.gov.br/api/consulta/v1"
    dados:
      - contratações anteriores (3 anos)
      - preços praticados
      - fornecedores e execução
      - itens catalogados (CATMAT/CATSER)
    confiança: ALTA
    
  siconfi:
    descricao: "Dados orçamentários"
    url: "https://apidatalake.tesouro.gov.br/ords/siconfi"
    dados:
      - LOA por função
      - execução orçamentária
      - despesas realizadas
    confiança: ALTA
    
  portal_transparencia:
    descricao: "Cadastros de impedimentos"
    url: "https://api.portaldatransparencia.gov.br"
    dados:
      - CEIS (empresas impedidas)
      - CNEP (penalidades)
    confiança: ALTA
```

## 2.3 Tratamento de Dados Ausentes

```python
async def buscar_dado_api(api: str, parametros: dict) -> DadoResult:
    """Busca dado em API oficial com tratamento de ausência"""
    
    try:
        resultado = await apis[api].consultar(parametros)
        
        if resultado.encontrado:
            return DadoResult(
                valor=resultado.valor,
                fonte=f"{api.upper()} - {resultado.endpoint}",
                data_consulta=datetime.now().isoformat(),
                confiavel=True
            )
        else:
            # Dado não encontrado - NÃO INVENTAR
            return DadoResult(
                valor=None,
                fonte=None,
                erro="Dado não encontrado na API",
                solicitar_usuario=True  # Pedir ao usuário
            )
            
    except APIError as e:
        # Erro na API - NÃO INVENTAR
        return DadoResult(
            valor=None,
            fonte=None,
            erro=f"Erro ao consultar {api}: {e}",
            solicitar_usuario=True
        )
```

---

# 3. SYSTEM PROMPT

```python
ACMA_SYSTEM_PROMPT = """
VOCÊ É ACMA - Assistente de Compras Municipais Avançado.

# ⚠️ REGRA CRÍTICA - LEIA PRIMEIRO

Você gera SUGESTÕES de justificativas, NUNCA conteúdo final.
Seu output será REVISADO E APROVADO por um servidor público antes de uso.
A responsabilidade pelo conteúdo final é 100% do servidor que aprovar.

# 🎯 SUA FUNÇÃO

Produzir SUGESTÕES de justificativas técnicas para editais que:
✅ Usam APENAS dados fornecidos no contexto (APIs oficiais)
✅ Citam a fonte de CADA dado numérico
✅ NÃO inventam dados, valores ou estatísticas
✅ Informam quando um dado está ausente
✅ Seguem estrutura de 7 seções obrigatórias

# 📋 DADOS DISPONÍVEIS (CONTEXTO)

Os dados abaixo foram coletados de APIs oficiais.
USE APENAS ESTES DADOS. NÃO INVENTE NENHUM OUTRO.

{context_data}

# 📋 ESTRUTURA DE SAÍDA (7 SEÇÕES)

## 1. CONTEXTO MUNICIPAL
[Usar dados de: IBGE, cadastro do órgão]
Citar: população, PIB/capita, estrutura relevante

## 2. NECESSIDADE ESPECÍFICA
[Usar dados de: PNCP histórico, input do usuário]
Citar: consumo histórico, IDs de contratações anteriores

## 3. PESQUISA MERCADO PNCP
[Usar dados de: PNCP preços]
Citar: média regional, quantidade de municípios consultados, IDs

## 4. QUALIFICAÇÃO TÉCNICA
[Usar dados de: PNCP, normas técnicas]
Citar: histórico de contratos similares, normas aplicáveis

## 5. ECONÔMICO-VANTAJOSO
[Usar dados de: PNCP preços, SICONFI orçamento]
Citar: economia % calculada, comparativo com LOA

## 6. BASE LEGAL E PRECEDENTE
[Usar dados de: lookup table de fundamentação]
Citar: Lei 14.133/2021, CF/88, Acórdãos TCU/TCE

## 7. AUDITORIA PRÉVIA
[Usar dados de: Portal Transparência, PNCP]
Citar: status CEIS/CNEP, % execução de fornecedores

# 🚫 REGRAS DE INTEGRIDADE

NUNCA FAÇA:
❌ Inventar dados numéricos
❌ Inventar IDs de contratações
❌ Inventar nomes de fornecedores
❌ Inventar percentuais
❌ Inventar acórdãos ou jurisprudência
❌ Preencher lacunas com suposições
❌ Usar frases genéricas sem dados

SEMPRE FAÇA:
✅ Citar a fonte de cada dado: "(PNCP ID 2024/567)"
✅ Informar quando dado está ausente: "[DADO NÃO DISPONÍVEL - solicitar ao usuário]"
✅ Usar apenas dados do contexto fornecido
✅ Incluir aviso de que é sugestão para revisão

# 🚫 FRASES PROIBIDAS

❌ "atender população"
❌ "garantir continuidade"  
❌ "melhor custo-benefício"
❌ "necessário para"
❌ "importante ressaltar"
❌ "essencial para"
❌ "visando a melhoria"

# ✅ FRASES OBRIGATÓRIAS

✅ "(PNCP ID XXXX)" após cada referência a contratação
✅ "(IBGE SIDRA TXXXX/2025)" após dados demográficos
✅ "(SICONFI 2026)" após dados orçamentários
✅ "[Fonte: API]" após cada dado numérico

# 📝 AVISO FINAL OBRIGATÓRIO

Ao final de TODA sugestão, incluir:

---
⚠️ SUGESTÃO GERADA POR IA - REVISÃO OBRIGATÓRIA
Este texto foi gerado automaticamente com base em dados de APIs oficiais.
O servidor público deve revisar todos os dados e aprovar antes do uso.
Responsabilidade pelo conteúdo final: servidor que aprovar.
---
"""
```

---

# 4. FLUXO DE APROVAÇÃO

## 4.1 Interface de Revisão

```typescript
interface SugestaoACMA {
    id: string;
    processo_id: string;
    texto_sugestao: string;
    dados_utilizados: DadoUtilizado[];
    timestamp_geracao: string;
    status: 'pendente' | 'aprovada' | 'rejeitada' | 'editada';
}

interface AprovacaoSugestao {
    sugestao_id: string;
    texto_final: string;  // Pode ser diferente do original
    aprovador: {
        nome: string;
        matricula: string;
        cargo: string;
    };
    foi_editado: boolean;
    timestamp_aprovacao: string;
    ip_address: string;
}
```

## 4.2 Endpoint de Aprovação

```typescript
// POST /api/acma/sugestao/{id}/aprovar
router.post('/sugestao/:id/aprovar', async (c) => {
    const { id } = c.req.param();
    const { texto_final, confirmo_revisao } = await c.req.json();
    const usuario = c.get('usuario');  // Do token JWT
    
    // Validar confirmação obrigatória
    if (!confirmo_revisao) {
        return c.json({
            error: "Você deve confirmar que revisou a sugestão"
        }, 400);
    }
    
    // Buscar sugestão original
    const sugestao = await buscarSugestao(id);
    
    // Registrar aprovação com auditoria completa
    const aprovacao = await registrarAprovacao({
        sugestao_id: id,
        texto_original: sugestao.texto_sugestao,
        texto_original_hash: sha256(sugestao.texto_sugestao),
        texto_final: texto_final,
        texto_final_hash: sha256(texto_final),
        foi_editado: texto_final !== sugestao.texto_sugestao,
        aprovador: {
            nome: usuario.nome,
            matricula: usuario.matricula,
            cargo: usuario.cargo
        },
        timestamp: new Date().toISOString(),
        ip: c.req.header('x-forwarded-for')
    });
    
    // Atualizar contexto do processo com texto aprovado
    await atualizarContextoProcesso(sugestao.processo_id, {
        justificativa_aprovada: texto_final,
        aprovacao_id: aprovacao.id
    });
    
    return c.json({
        success: true,
        aprovacao_id: aprovacao.id,
        mensagem: "Sugestão aprovada e registrada para auditoria"
    });
});
```

## 4.3 Registro de Auditoria

```python
# Estrutura do registro de auditoria
AUDIT_LOG_SUGESTAO = {
    "id": "audit-2026-0001",
    "timestamp": "2026-01-29T14:35:00Z",
    "tipo": "aprovacao_sugestao_acma",
    
    "sugestao": {
        "id": "sug-2026-0001",
        "processo_id": "LIC-LAGOASANTA-2026-0001",
        "texto_hash": "abc123...",
        "dados_apis": ["PNCP", "IBGE", "SICONFI"]
    },
    
    "aprovador": {
        "nome": "Maria Silva Santos",
        "matricula": "12345",
        "cargo": "Coordenadora de TI",
        "orgao": "Prefeitura Municipal de Lagoa Santa"
    },
    
    "decisao": {
        "acao": "aprovado_com_edicao",
        "texto_original_hash": "abc123...",
        "texto_final_hash": "def456...",
        "campos_editados": ["secao_2", "secao_5"]
    },
    
    "metadados": {
        "ip": "192.168.1.100",
        "user_agent": "Mozilla/5.0...",
        "sessao_id": "sess-xyz789"
    }
}
```

---

# 5. VALIDAÇÃO DE QUALIDADE

## 5.1 Checklist Automático (Pré-Aprovação)

```python
def validar_sugestao(texto: str, dados_contexto: dict) -> ValidacaoResult:
    """Valida qualidade da sugestão antes de apresentar ao usuário"""
    
    checks = []
    
    # 1. Verificar se não há dados inventados
    dados_citados = extrair_dados_citados(texto)
    dados_disponiveis = set(dados_contexto.keys())
    dados_inventados = dados_citados - dados_disponiveis
    
    checks.append({
        "item": "dados_inventados",
        "passou": len(dados_inventados) == 0,
        "detalhe": f"Dados não encontrados no contexto: {dados_inventados}" if dados_inventados else "OK"
    })
    
    # 2. Verificar citação de fontes
    fontes_citadas = contar_fontes_citadas(texto)
    checks.append({
        "item": "fontes_citadas",
        "passou": fontes_citadas >= 5,
        "detalhe": f"{fontes_citadas} fontes citadas (mínimo: 5)"
    })
    
    # 3. Verificar termos proibidos
    termos_encontrados = verificar_termos_proibidos(texto)
    checks.append({
        "item": "termos_proibidos",
        "passou": len(termos_encontrados) == 0,
        "detalhe": f"Termos proibidos: {termos_encontrados}" if termos_encontrados else "OK"
    })
    
    # 4. Verificar aviso de sugestão
    tem_aviso = "SUGESTÃO GERADA POR IA" in texto
    checks.append({
        "item": "aviso_sugestao",
        "passou": tem_aviso,
        "detalhe": "Aviso de sugestão presente" if tem_aviso else "FALTA aviso obrigatório"
    })
    
    # 5. Verificar 7 seções
    secoes = contar_secoes(texto)
    checks.append({
        "item": "estrutura_7_secoes",
        "passou": secoes == 7,
        "detalhe": f"{secoes}/7 seções encontradas"
    })
    
    passou_todos = all(c["passou"] for c in checks)
    
    return ValidacaoResult(
        valido=passou_todos,
        checks=checks,
        pode_apresentar=passou_todos
    )
```

---

# 6. INTEGRAÇÃO COM DESIGN_LAW_AGENT

## 6.1 Fluxo Completo

```python
async def gerar_documento_com_justificativa(
    processo_id: str,
    tipo_documento: str,
    usar_sugestao_acma: bool = False
) -> bytes:
    """
    Gera documento integrando justificativa aprovada
    """
    
    # 1. Carregar contexto do processo
    ctx = await carregar_contexto(processo_id)
    
    # 2. Obter justificativa
    if usar_sugestao_acma:
        # Verificar se existe sugestão APROVADA
        sugestao = await buscar_sugestao_aprovada(processo_id)
        
        if not sugestao:
            raise SugestaoNaoAprovadaError(
                "Não há sugestão aprovada para este processo. "
                "Gere uma sugestão e aprove antes de gerar o documento."
            )
        
        justificativa = sugestao.texto_final  # Texto aprovado pelo servidor
        
    else:
        # Justificativa manual do usuário
        justificativa = ctx.dados.get("justificativa_manual")
        
        if not justificativa:
            raise CampoObrigatorioError("Justificativa não preenchida")
    
    # 3. Gerar documento (DESIGN_LAW_AGENT - sem LLM)
    dados = {
        **ctx.dados_compartilhados,
        "justificativa": justificativa  # Texto já aprovado
    }
    
    pdf = await design_law_agent.gerar(tipo_documento, dados)
    
    return pdf
```

---

# 7. CUSTOS E PERFORMANCE

## 7.1 Estimativa de Custos

```
ACMA AGENT v2 - Custo por Sugestão

Chamadas de API (gratuitas):
- IBGE SIDRA: R$ 0
- PNCP: R$ 0
- SICONFI: R$ 0
- Portal Transparência: R$ 0

LLM (Claude Sonnet):
- Input: ~3.000 tokens (contexto + prompt)
- Output: ~1.000 tokens
- Custo: ~$0.015

TOTAL POR SUGESTÃO: ~$0.015 (~R$ 0,08)

Nota: Sugestão pode ser rejeitada/editada sem custo adicional.
      Custo só ocorre na geração, não na aprovação.
```

## 7.2 Performance

```
Tempo de geração de sugestão:

1. Consulta APIs (paralelo): 2-3s
2. Geração LLM: 3-5s
3. Validação: ~100ms
4. Apresentação: ~50ms
────────────────────────────
TOTAL GERAÇÃO: 5-8 segundos

Tempo de aprovação: Depende do usuário
Tempo pós-aprovação: 0ms (texto já está pronto)
```

---

# 8. RESUMO: O QUE MUDOU NA v2

| Aspecto | v1 (Anterior) | v2 (Atual) |
|---------|---------------|------------|
| Output | "Justificativa pronta" | **"SUGESTÃO para revisão"** |
| Rótulo | Nenhum | **"⚠️ SUGESTÃO GERADA POR IA"** |
| Inserção no documento | Automática | **Após aprovação humana** |
| Edição pelo usuário | Opcional | **Incentivada** |
| Registro de auditoria | Básico | **Completo (antes/depois)** |
| Responsabilidade | Ambígua | **100% do servidor que aprova** |
| Dados inventados | Possível | **Bloqueado por validação** |

---

---

# 9. ATUALIZAÇÕES v3 (Fevereiro 2026)

## 9.1 Evolucao v2 → v3

| Aspecto | v2 (Janeiro 2026) | v3 (Fevereiro 2026) |
|---------|-------------------|---------------------|
| Estrutura | 7 secoes | **8 camadas de blindagem** |
| Input | APIs isoladas | **Insight Engine como fonte de contexto** |
| LINDB | Nao mencionada | **Arts. 20, 21, 22, 28, 30 integrados** |
| Valores | Referencia generica | **Dec. 12.807/2025 (valores 2026)** |
| Loop | Geracao unica | **Reiteracao via Orquestrador (Part 20)** |
| Jurisprudencia | Basica | **560+ refs Manual TCU 5a Ed.** |

## 9.2 8 Camadas de Blindagem da Justificativa

```
1. DADO CONCRETO (LINDB Art. 20)
   Fonte: IBGE/PNCP/SICONFI com ID rastreavel
   → Insight Engine fornece contexto enriquecido

2. NECESSIDADE ESPECIFICA (Lei 14.133 Art. 18, I)
   Dados do orgao + historico de consumo

3. PESQUISA DE MERCADO (IN 65/2021)
   3+ fontes PNCP + Compras.gov (NAO Painel de Precos — descontinuado)

4. VANTAJOSIDADE DEMONSTRADA (Lei 14.133 Art. 86, §4o)
   Calculo matematico: economia em R$ e %

5. ALTERNATIVAS ANALISADAS (LINDB Art. 20, paragrafo unico)
   Minimo 3 alternativas com pros/contras

6. JURISPRUDENCIA FAVORAVEL (lookup table auditada)
   TCU/TCE com numero de acordao — 560+ referencias

7. BLINDAGEM LINDB (Lei 13.655/2018)
   Arts. 20, 21, 22, 28, 30 aplicados conforme caso
   Art. 22: contexto local (IDH, orcamento, quadro funcional)

8. CONFORMIDADE (checklist automatico)
   Todos os itens verificados por regras fixas do YAML
```

## 9.3 Integracao com Insight Engine

O ACMA v3 recebe contexto PRE-ENRIQUECIDO pelo Insight Engine:

```
Insight Engine fornece:
  - precos_pncp[] (contratacoes similares com IDs)
  - arps_vigentes[] (para sugerir carona)
  - recursos_federais[] (FNDE, FNS, emendas)
  - dados_ibge (populacao, IDH, PIB)
  - orcamento_siconfi (dotacao, execucao)
  - impedimentos_ceis[] (fornecedores impedidos)
  - historico_12m (para deteccao fracionamento)
  - jurisprudencia_relevante[] (do Manual TCU 5a Ed.)

ACMA usa APENAS estes dados no contexto — nao inventa nenhum dado adicional.
```

## 9.4 Integracao com Fluxo Ciclico (Part 20)

- ACMA e chamado no passo 2 do fluxo ciclico
- Se usuario rejeita sugestao → pode pedir NOVA sugestao (max 3 por secao)
- Se usuario aprova → texto vai para DESIGN_LAW (passo 3)
- Se AUDITOR encontra problema na justificativa → usuario pode pedir nova sugestao ACMA
- Cada sugestao gera registro completo no audit_log (texto antes/depois)

## 9.5 Valores Atualizados (Dec. 12.807/2025)

```yaml
LIMITES_2026:
  dispensa_obras: R$ 130.984,22       # Art. 75, I
  dispensa_bens_servicos: R$ 65.492,11 # Art. 75, II
  contrata_brasil_mei: R$ 96.228,41    # Art. 95 (IN 52/2025)
```

O ACMA usa estes valores na camada 4 (vantajosidade) para comparar
com o valor estimado e sugerir modalidade adequada.

## 9.6 Fontes Descontinuadas

- **Painel de Precos:** DESCONTINUADO. Usar PNCP + Compras.gov (IN 65/2021)
- ACMA NUNCA referencia Painel de Precos em sugestoes

---

*Especificação técnica ACMA AGENT v3.0*
*ATA360 - Sistema de Inteligência em Contratações Públicas*
*Assistente de Compras Municipais Avançado*
*SUGESTÕES com Revisão Humana Obrigatória*
*8 Camadas de Blindagem + Insight Engine + LINDB*
*Fevereiro 2026*
