# CLAUDE.md — ATA360 Site Institucional (Webflow)

Site institucional da ATA360 — plataforma GovTech de IA para compras públicas brasileiras sob a Lei 14.133/2021. O site usa o template Neurex no Webflow e está sendo adaptado para PT-BR com conteúdo original.

## Stack

- **Site/CMS:** Webflow (Template Neurex)
- **App:** Vercel (app.ata360.com.br)
- **Backend:** Supabase
- **CDN/DNS:** Cloudflare (ver `dns/GUIA-DNS-CLOUDFLARE.md`)
- **AI:** Claude API (Anthropic)
- **Repositório:** GitHub (ata360brasil)

## Webflow

- **Site ID:** 698fe0c8f6daa74f9f18a777
- **Workspace ID:** 698fb419d70ee93ec9b63491
- **Subdomínio:** ata360-d1a9ce.webflow.io
- **Domínio alvo:** www.ata360.com.br (Webflow) / app.ata360.com.br (Vercel)
- **Locale:** pt-BR
- **Template:** Neurex
- **Fuso horário:** America/Sao_Paulo (⚠ atualmente Asia/Dhaka — CORRIGIR)

## Idioma

TUDO em Português Brasileiro (pt-BR). Zero inglês — inclui botões, placeholders, meta tags, alt texts, mensagens de erro, títulos de página e slugs.

---

## Sobre o ATA360

### Proposta de valor

> "Enquanto outros pesquisam preços, nós protegemos decisões."

### Diferencial competitivo

Rastreamento em tempo real de saldos de Atas de Registro de Preços usando o campo `quantidadeEmpenhada` — nenhum concorrente usa isso. Integração com +160 APIs governamentais (PNCP, Compras.gov, Portal da Transparência, SERPRO, IBGE).

### Público-alvo (ordem de prioridade)

1. Municípios (5.570+ no Brasil)
2. Estados e órgãos federais
3. Fornecedores
4. Consórcios municipais
5. Órgãos de controle (TCU, TCE, CGU)

### Funcionalidades

- Chat IA para busca semântica de licitações e atas
- Rastreamento de saldo de ATA em tempo real
- Geração automática de 8 documentos prioritários (ETP, TR, Mapa de Preços, etc.)
- Análise de preços com IA
- Alertas e monitoramento de licitações
- Dashboard de gestão de compras
- Compliance automático com Lei 14.133/2021

### Modelo de preços

Por faixa populacional do município (ver `paginas/precos.md`):

- Até 10.000 hab → Até 50.000 → Até 100.000 → Até 500.000 → Acima de 500.000
- Plano institucional para estados, federais e consórcios
- ⚠ Valores ainda são placeholder

---

## Estrutura de conteúdo

Todo conteúdo do site está documentado em `site-institucional/` com 41 arquivos organizados:

### Homepage — 16 seções (em ordem no Webflow)

Referência: `homepage/*.md`

| #  | Arquivo          | Seção                                    | Status                       |
|----|------------------|------------------------------------------|------------------------------|
| 01 | hero.md          | H1 + CTA + social proof                 | ✅                           |
| 02 | logos.md         | Barra: PNCP, Serpro, IBGE, TCU, CGU     | ✅                           |
| 03 | metricas.md      | 4 cards: 91%, R$60Bi, 100%, 11x         | ✅                           |
| 04 | depoimento.md    | Quote Hicaro Lima                        | ⚠ Aguarda autorização       |
| 05 | tabs.md          | 3 abas: Fundamentar/Acelerar/Proteger    | ✅                           |
| 06 | grid-cards.md    | 6 funcionalidades                        | ✅                           |
| 07 | cta-dark.md      | CTA intermediário                        | ✅                           |
| 08 | cards-dark.md    | 3 cards anti-ChatGPT                     | ✅                           |
| 09 | comparativo.md   | Jeito comum vs ATA360                    | ✅                           |
| 10 | separador.md     | Frase impacto                            | ✅                           |
| 11 | depoimentos.md   | Testimonials                             | 🔒 ESCONDIDA (sem autorização) |
| 12 | blog.md          | 3 cards destaque                         | ✅                           |
| 13 | cta-final.md     | CTA final com trial 14 dias             | ✅                           |
| 14 | inteligencia.md  | Inteligência de compras                  | ✅                           |
| 15 | soberania.md     | Dados no Brasil / LGPD                   | ✅                           |
| 16 | footer.md        | 3 colunas + redes + copyright            | ✅                           |

### Páginas internas

Referência: `paginas/*.md`

| Página              | Arquivo                    | Status                                              |
|---------------------|----------------------------|------------------------------------------------------|
| Preços              | precos.md                  | ⚠ Valores placeholder                               |
| Quem somos          | quem-somos.md              | ✅                                                   |
| Soluções            | solucoes.md                | ✅ 6 soluções                                        |
| Contato             | contato.md                 | ⚠ WhatsApp a definir                                |
| Ouvidoria           | ouvidoria.md               | ✅ Lei 13.608                                        |
| Carreiras           | carreiras.md               | ✅ 6 vagas                                           |
| Humano + IA         | humano-ia.md               | ⚠ Revela arquitetura (17+ APIs, 110+ endpoints)     |
| Parceiros           | parceiros.md               | ✅                                                   |
| Acessibilidade      | acessibilidade.md          | ✅ WCAG + eMAG                                       |
| Solicitar acesso    | solicitar-acesso.md        | ✅                                                   |
| Solicitar demo      | solicitar-demonstracao.md  | ✅                                                   |
| Suporte             | suporte.md                 | ⚠ Link /compliance quebrado                         |

### SEO

Referência: `seo/`

- `meta-descriptions.md` — Meta tags para todas as páginas
- `schema-org.json` — Dados estruturados (⚠ audience type errado — corrigir)

### Emails de onboarding

Referência: `emails/sequencia-onboarding.md` — 6 emails em 15 dias

### CMS (dados para importar no Webflow)

Referência: `webflow-cms/`

| Arquivo                | Conteúdo                  | Status                |
|------------------------|---------------------------|-----------------------|
| blog-tags.csv          | 33 tags                   | ✅ Acentos OK         |
| blog-posts.csv         | 20 posts                  | ✅ Acentos OK          |
| carreiras-tags.csv     | 11 tags                   | ✅                    |
| carreiras.csv          | 6 vagas                   | ✅                    |
| glossario.csv          | 14 termos                 | ✅                    |
| jurisprudencia-tce.csv | 15 decisões de 12 TCEs    | ✅                    |

Guias de importação: `README-IMPORTACAO.md` e `GUIA-WEBFLOW-PASSO-A-PASSO.md`

---

## Menu principal (Navbar)

```
[LOGO ATA360]  Quem somos  Soluções  Calcule o preço  Notícias  Login  [Solicite o acesso]
```

### Links e destinos

| Menu              | Slug               | Fonte do conteúdo              |
|-------------------|--------------------|---------------------------------|
| Quem somos        | /quem-somos        | paginas/quem-somos.md           |
| Soluções          | /solucoes          | paginas/solucoes.md             |
| Calcule o preço   | /precos            | paginas/precos.md               |
| Notícias          | /blog              | CMS blog-posts                  |
| Login             | /login             | → Redirecionar para app.ata360.com.br |
| Solicite o acesso | /solicitar-acesso  | paginas/solicitar-acesso.md     |

---

## Problemas críticos (resolver primeiro)

### P0 — Urgentes

1. **SEO catastrófico** — Todas as páginas mostram "Neurex - Webflow HTML Website Template". Trocar por conteúdo de `seo/meta-descriptions.md`
2. **Fuso horário errado** — Asia/Dhaka → America/Sao_Paulo
3. **Links mortos** — "Soluções" no menu não tem página de destino
4. **Login decorativo** — Redirecionar para app real em app.ata360.com.br
5. **CTA principal sem destino** — "Solicite o acesso" precisa apontar para formulário

### P1 — Conteúdo

1. **Página About** (/about) em inglês → substituir por `paginas/quem-somos.md`
2. **Página Pricing** genérica → substituir por `paginas/precos.md`
3. **Blog vazio** → importar `blog-posts.csv` (acentos OK ✅ — pronto para importar)
4. **Redes sociais** no footer são placeholders → inserir URLs reais
5. **Rodapé** com links para páginas inexistentes (Compliance, Política de Privacidade)

### P2 — Melhorias

1. Importar CSVs no CMS (blog, carreiras, glossário, jurisprudência)
2. Configurar schema.org (corrigir audience type em `seo/schema-org.json`)
3. Conectar domínio ata360.com.br (ver `dns/GUIA-DNS-CLOUDFLARE.md`)
4. Seção 11 depoimentos — ativar quando tiver autorização
5. Página `humano-ia.md` — avaliar se expõe demais a arquitetura

---

## Tom de voz

- **Profissional e confiável** — público é setor público
- **Direto e claro** — sem jargão tech/startup
- **Autoritativo** — domínio da Lei 14.133/2021
- **Acessível** — pregoeiro de cidade pequena precisa entender
- **Nunca usar:** anglicismos, buzzwords, promessas vagas, tom de vendedor
- **Frase-âncora:** "Enquanto outros pesquisam preços, nós protegemos decisões."
- **Frase de defesa:** "Quem ataca o ATA360 está defendendo o quê, exatamente?"

---

## Regras para Claude Code

### Webflow (via MCP)

1. SEMPRE ler estado atual antes de alterar (`get_all_elements`, `get_selected_element`)
2. Nunca deletar componentes — editar o existente
3. Verificar responsividade (breakpoints: main, medium, small, tiny)
4. Todo texto em PT-BR, sem exceção
5. Reusar estilos existentes do Neurex — não criar novos sem necessidade
6. Manter estrutura de componentes do template
7. Toda página nova DEVE ter SEO configurado (title + description) usando `seo/meta-descriptions.md`
8. Ao editar conteúdo, SEMPRE consultar o arquivo `.md` correspondente em `site-institucional/`
9. Seção 11 (depoimentos) DEVE permanecer escondida até autorização explícita
10. Seção 04 (depoimento Hicaro Lima) — aguarda autorização de uso

### Código (GitHub/Vercel)

1. Comentários em português
2. Commits em português: `feat:` / `fix:` / `docs:` / `style:` / `refactor:`
3. Branches: `feature/nome`, `fix/nome`, `docs/nome`
4. Seguir padrões existentes no repositório

### Importação CMS

1. Seguir `webflow-cms/README-IMPORTACAO.md`
2. Verificar encoding UTF-8 e acentos antes de importar
3. `blog-posts.csv` — acentos verificados e corretos ✅ — pronto para importar
4. Ordem: tags primeiro, depois posts/itens que referenciam tags

### Proteção estratégica

| Revelar no site          | NÃO revelar no site                       |
|--------------------------|-------------------------------------------|
| O PROBLEMA que resolve   | A ARQUITETURA de como resolve             |
| O RESULTADO que entrega  | As FONTES DE DADOS específicas            |
| A LEI que fundamenta     | Os NOMES dos agentes                      |
| Que funciona             | COMO funciona por dentro                  |
| Que é exclusivo          | POR QUE é exclusivo                       |

**Regra absoluta**: Nenhum conteúdo do site deve mencionar nomes de agentes, endpoints, quantidade de APIs, ou fluxo interno de processamento.

---

## Prioridade de trabalho

1. **P0:** Corrigir SEO, fuso, links mortos, login, CTA
2. **P1:** Substituir conteúdo das páginas pelos `.md` correspondentes
3. **P1:** Criar páginas faltantes (Soluções, Contato, Ouvidoria, etc.)
4. **P2:** Importar dados CMS
5. **P2:** SEO completo + schema.org
6. **P2:** Conectar domínio e publicar
