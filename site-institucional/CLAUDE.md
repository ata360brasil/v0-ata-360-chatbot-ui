# ATA360 — Site Institucional (Webflow)

## Arquitetura de deploy

- **www.ata360.com.br** — Site institucional (Webflow, pre-login)
- **app.ata360.com.br** — Plataforma ATA360 (Vercel/Next.js, pos-login)
- Template Webflow: Neurex
- DNS: Cloudflare (ver `dns/GUIA-DNS-CLOUDFLARE.md`)

## Estrutura completa (41 arquivos)

```
site-institucional/
├── README.md
├── CLAUDE.md                              # ← ESTE ARQUIVO
│
├── homepage/                              # 16 secoes da home (ordem no Webflow)
│   ├── 01-hero.md                         # ✅ H1, CTA, social proof
│   ├── 02-logos.md                        # ✅ PNCP, Serpro, IBGE, TCU, CGU
│   ├── 03-metricas.md                     # ✅ 4 cards: 91%, R$60Bi, 100%, 11x
│   ├── 04-depoimento.md                   # ⚠ Quote Hicaro Lima (aguarda autorizacao)
│   ├── 05-tabs.md                         # ✅ 3 abas: Fundamentar/Acelerar/Proteger
│   ├── 06-grid-cards.md                   # ✅ 6 funcionalidades
│   ├── 07-cta-dark.md                     # ✅ CTA intermediario
│   ├── 08-cards-dark.md                   # ✅ 3 cards anti-ChatGPT
│   ├── 09-comparativo.md                  # ✅ 2 colunas: jeito comum vs ATA360
│   ├── 10-separador.md                    # ✅ Frase impacto
│   ├── 11-depoimentos.md                  # 🔒 ESCONDIDA (sem autorizacao)
│   ├── 12-blog.md                         # ✅ 3 cards destaque
│   ├── 13-cta-final.md                    # ✅ CTA final com trial 14 dias
│   ├── 14-inteligencia.md                 # ✅ Inteligencia de compras
│   ├── 15-soberania.md                    # ✅ Dados no Brasil / LGPD
│   └── 16-footer.md                       # ✅ 3 colunas + redes + copyright
│
├── paginas/                               # 12 paginas internas
│   ├── precos.md                          # ⚠ Calculadora CNPJ (valores placeholder)
│   ├── quem-somos.md                      # ✅ Institucional
│   ├── solucoes.md                        # ✅ 6 solucoes
│   ├── contato.md                         # ⚠ Formulario (WhatsApp a definir)
│   ├── ouvidoria.md                       # ✅ Canal de denuncia (Lei 13.608)
│   ├── carreiras.md                       # ✅ 6 vagas, acentos OK
│   ├── humano-ia.md                       # ⚠ Revela arquitetura (17+ APIs, 110+ endpoints)
│   ├── parceiros.md                       # ✅ Programa de parceiros
│   ├── acessibilidade.md                  # ✅ WCAG + eMAG
│   ├── solicitar-acesso.md                # ✅ Formulario de cadastro
│   ├── solicitar-demonstracao.md          # ✅ Formulario demo
│   └── suporte.md                         # ⚠ Link /compliance quebrado
│
├── seo/
│   ├── meta-descriptions.md               # ✅ Meta tags para todas as paginas
│   └── schema-org.json                    # ⚠ audience type errado (precisa corrigir)
│
├── emails/
│   └── sequencia-onboarding.md            # ✅ 6 emails em 15 dias
│
├── dns/
│   └── GUIA-DNS-CLOUDFLARE.md             # ✅ www→Webflow, app→Vercel
│
└── webflow-cms/                           # CSVs prontos para importar no CMS
    ├── README-IMPORTACAO.md               # ✅ Guia de importacao
    ├── GUIA-WEBFLOW-PASSO-A-PASSO.md      # ✅ Passo a passo completo
    ├── blog-tags.csv                      # ✅ 33 tags (acentos OK)
    ├── blog-posts.csv                     # 🔄 20 posts (acentos em correcao)
    ├── carreiras-tags.csv                 # ✅ 11 tags (acentos OK)
    ├── carreiras.csv                      # ✅ 6 vagas (acentos OK)
    ├── glossario.csv                      # ✅ 14 termos (acentos OK)
    └── jurisprudencia-tce.csv             # ✅ 15 decisoes de 12 TCEs (acentos OK)
```

## Legenda de status

- ✅ Pronto para publicar
- 🔄 Em processamento
- ⚠ Precisa de correcao/decisao
- 🔒 Bloqueado (aguarda autorizacao)

## Problemas conhecidos

### Criticos
1. **Paginas faltando**: `/privacidade`, `/termos`, `/lgpd` — linkadas no footer mas sem conteudo
2. **humano-ia.md**: Revela arquitetura interna (17+ APIs, 110+ endpoints) — viola regras de protecao

### Correcoes pendentes
3. **precos.md**: Valores sao placeholder — precisam de definicao final
4. **contato.md**: Numero WhatsApp a definir
5. **suporte.md**: Link `/compliance` quebrado
6. **schema-org.json**: `audience.audienceType` incorreto
7. **04-depoimento.md**: Aguarda autorizacao formal de Hicaro Lima
8. **11-depoimentos.md**: Secao escondida ate obter autorizacoes
9. **blog-posts.csv**: Acentos em correcao

### Acentos
- Arquivos com acentos corretos: `carreiras.md`, todos os CSVs do `webflow-cms/`
- Demais ~25 arquivos: acentos removidos (sem cedilha, til, agudo, circunflexo)

## Regras de protecao estrategica

| Revelar no site         | NAO revelar no site                      |
|-------------------------|------------------------------------------|
| O PROBLEMA que resolve  | A ARQUITETURA de como resolve            |
| O RESULTADO que entrega | As FONTES DE DADOS especificas           |
| A LEI que fundamenta    | Os NOMES dos agentes                     |
| Que funciona            | COMO funciona por dentro                 |
| Que e exclusivo         | POR QUE e exclusivo                      |

**Regra absoluta**: Nenhum conteudo do site deve mencionar nomes de agentes, endpoints, quantidade de APIs, ou fluxo interno de processamento.

## Regras de trabalho

1. **Nunca publicar secoes marcadas como 🔒** sem autorizacao explicita
2. **Manter numeracao das secoes** da homepage (01 a 16) — reflete ordem no Webflow
3. **CSVs do CMS**: encoding UTF-8, separador virgula, aspas duplas para campos com virgula
4. **Copy**: Validada com frameworks Joanna Wiebe, Harry Dry, Eddie Shleyner, Stefan Georgi, Peep Laja
5. **Acentos nos CSVs**: Usar caracteres Unicode corretos (ã, é, ç, etc.)
6. **Ao editar paginas**: Verificar se `meta-descriptions.md` precisa de atualizacao correspondente
7. **Ao criar paginas novas**: Adicionar entrada em `meta-descriptions.md` e `schema-org.json`
