# Guia Passo a Passo — Aplicar Conteúdo no Webflow CMS

## Visão Geral

O Webflow atualmente tem conteúdo placeholder em inglês que precisa ser substituído por conteúdo real em português do Brasil. Este guia cobre TUDO que precisa ser feito diretamente no Webflow.

---

## PARTE 1 — Limpar Conteúdo em Inglês

### 1.1 Excluir Blog Posts em Inglês
1. Acessar **Webflow Dashboard** → seu projeto → **CMS**
2. Clicar na coleção **"Blog Posts"**
3. Selecionar TODOS os 29 posts em inglês (checkbox ao lado de cada um)
4. Clicar em **"Delete"** → confirmar exclusão
5. Esvaziar a lixeira: **CMS Settings** → **Trash** → **Empty Trash**

### 1.2 Excluir Blog Tags em Inglês
1. Na coleção **"Blog Tags"**
2. Excluir: "Customer", "product", "Business", "NEWS", "CORPORATE"
3. Esvaziar lixeira

### 1.3 Excluir Careers em Inglês
1. Na coleção **"Careers"**
2. Excluir todas as 6 vagas em inglês
3. Esvaziar lixeira

### 1.4 Excluir Career Tags em Inglês
1. Na coleção **"Career Tags"**
2. Excluir: "MARKETING", "Sales"
3. Esvaziar lixeira

---

## PARTE 2 — Criar Blog Tags (Primeiro!)

> **IMPORTANTE:** Criar tags ANTES dos posts, pois os posts referenciam tags.

No CMS → **Blog Tags** → **+ New Item** para cada tag:

| Nome | Slug |
|------|------|
| Legislação | legislacao |
| Licitação | licitacao |
| Gestão Pública | gestao-publica |
| Tecnologia | tecnologia |
| Compliance | compliance |
| IA em Compras Públicas | ia-compras-publicas |
| Jurisprudência | jurisprudencia |
| Guias Práticos | tutoriais |
| TCU | tcu |
| TCE | tce |
| CGU | cgu |
| PNCP | pncp |
| Pesquisa de Preços | pesquisa-de-precos |
| Governança | governanca |
| Fiscalização | fiscalizacao |
| Transparência | transparencia |
| Lei 14.133 | lei-14133 |
| Planejamento | planejamento |
| ETP | etp |
| DFD | dfd |
| LGPD | lgpd |
| Inteligência Artificial | inteligencia-artificial |
| Ações do Governo | acoes-do-governo |
| Fornecedores | fornecedores |
| ME/EPP | me-epp |
| Emendas Parlamentares | emendas-parlamentares |
| Reforma Tributária | reforma-tributaria |
| Credenciamento | credenciamento |
| SICAF | sicaf |
| Transferegov | transferegov |
| Convênios | convenios |
| Multas e Sanções | multas-e-sancoes |
| Servidor Público | servidor-publico |

---

## PARTE 3 — Criar Blog Posts (20 Notícias)

No CMS → **Blog Posts** → **+ New Item** para cada post.

### Post 1 — DESTAQUE
- **Título:** TCU regulamenta uso de inteligência artificial em contratações públicas
- **Slug:** tcu-regulamenta-uso-ia-contratacoes-publicas-2026
- **Resumo:** O Tribunal de Contas da União publicou orientações sobre o uso de IA em processos de contratação, exigindo rastreabilidade, transparência e revisão humana obrigatória. Entenda o impacto para seu órgão.
- **Categoria:** Jurisprudência
- **Tags:** TCU, Inteligência Artificial, Governança, Fiscalização
- **Data:** 18/02/2026
- **Tempo de leitura:** 4 min
- **Destaque:** Sim
- **Fonte:** TCU — https://portal.tcu.gov.br/

### Post 2 — DESTAQUE
- **Título:** PNCP supera 2 milhões de contratações publicadas e se consolida como base nacional
- **Slug:** pncp-supera-2-milhoes-contratacoes-publicadas
- **Resumo:** O Portal Nacional de Contratações Públicas atingiu a marca de 2 milhões de publicações. Entenda o que isso significa para a pesquisa de preços e transparência no seu município.
- **Categoria:** Gestão Pública
- **Tags:** PNCP, Pesquisa de Preços, Transparência, Lei 14.133
- **Data:** 17/02/2026
- **Tempo de leitura:** 4 min
- **Destaque:** Sim
- **Fonte:** Gov.br / PNCP — https://www.gov.br/pncp

### Post 3
- **Título:** MGI publica guia atualizado para planejamento de contratações em 2026
- **Slug:** mgi-publica-guia-planejamento-contratacoes-2026
- **Resumo:** O Ministério da Gestão e da Inovação atualizou o guia de planejamento de contratações com novas orientações sobre ETP, DFD e gestão de riscos. Veja o que mudou.
- **Categoria:** Legislação
- **Tags:** Planejamento, ETP, DFD, Lei 14.133
- **Data:** 16/02/2026
- **Tempo de leitura:** 5 min
- **Fonte:** MGI / Gov.br — https://www.gov.br/gestao/

### Post 4
- **Título:** CGU lança painel de transparência para contratações emergenciais
- **Slug:** cgu-painel-transparencia-contratacoes-emergenciais
- **Categoria:** Compliance
- **Tags:** CGU, Transparência, Fiscalização, Pesquisa de Preços
- **Data:** 15/02/2026
- **Fonte:** CGU — https://www.gov.br/cgu/

### Post 5
- **Título:** Governo federal amplia prazo para municípios aderirem ao PNCP
- **Slug:** governo-amplia-prazo-municipios-pncp
- **Categoria:** Legislação
- **Tags:** PNCP, Lei 14.133, Gestão Pública, Transparência
- **Data:** 14/02/2026
- **Fonte:** Gov.br / PNCP — https://www.gov.br/pncp

### Post 6
- **Título:** ENAP abre inscrições para curso gratuito sobre Lei 14.133/2021
- **Slug:** enap-curso-gratuito-lei-14133-2026
- **Categoria:** Gestão Pública
- **Tags:** Lei 14.133, ENAP, ETP, DFD
- **Data:** 13/02/2026
- **Fonte:** ENAP — https://www.enap.gov.br/

### Post 7 — DESTAQUE
- **Título:** Heróis solitários: o servidor público que faz compras, contratos e licitações sozinho
- **Slug:** herois-solitarios-servidor-que-faz-tudo-sozinho
- **Categoria:** Gestão Pública
- **Tags:** Servidor Público, Gestão Pública, ME/EPP
- **Data:** 12/02/2026
- **Destaque:** Sim
- **Fonte:** ATA360

### Post 8 — DESTAQUE
- **Título:** R$ 8 bilhões perdidos: como emendas parlamentares são devolvidas por falta de planejamento em compras públicas
- **Slug:** bilhoes-perdidos-emendas-parlamentares-falta-planejamento
- **Categoria:** Gestão Pública
- **Tags:** Emendas Parlamentares, Planejamento, Transferegov
- **Data:** 11/02/2026
- **Destaque:** Sim
- **Fonte:** Portal da Transparência — https://portaldatransparencia.gov.br/transferencias

### Post 9
- **Título:** ATA360: como a IA especializada reduz em 80% o tempo de pesquisa de preços em compras públicas
- **Slug:** ata360-ia-especializada-eficiencia-compras-publicas
- **Categoria:** IA em Compras Públicas
- **Tags:** IA em Compras Públicas, Pesquisa de Preços
- **Data:** 10/02/2026
- **Fonte:** ATA360

### Post 10
- **Título:** Multas de até R$ 60 mil: erros grosseiros em licitações que custam caro ao servidor público
- **Slug:** multas-agentes-publicos-erros-licitacoes-tcu-tce
- **Categoria:** Jurisprudência
- **Tags:** Multas e Sanções, TCU, TCE, Servidor Público
- **Data:** 09/02/2026
- **Fonte:** TCU — Jurisprudência — https://portal.tcu.gov.br/jurisprudencia/

### Post 11
- **Título:** ChatGPT na licitação? Os riscos de usar IA genérica em compras públicas — e por que alucinações custam caro
- **Slug:** riscos-ia-generica-chatgpt-licitacoes-alucinacao
- **Categoria:** IA em Compras Públicas
- **Tags:** IA em Compras Públicas, LGPD, Governança
- **Data:** 08/02/2026
- **Fonte:** TCU — https://portal.tcu.gov.br/

### Post 12
- **Título:** Reforma tributária e compras públicas: como o IBS e a CBS vão afetar licitações e contratos
- **Slug:** reforma-tributaria-afeta-compras-publicas-ibs-cbs
- **Categoria:** Legislação
- **Tags:** Reforma Tributária, Legislação, Licitação
- **Data:** 07/02/2026
- **Fonte:** Min. Fazenda / Gov.br — https://www.gov.br/fazenda/pt-br/assuntos/reforma-tributaria

### Post 13
- **Título:** Credenciamento na Lei 14.133/2021: a modalidade que poucos usam e pode transformar contratações de serviços
- **Slug:** credenciamento-lei-14133-nova-modalidade-guia
- **Categoria:** Licitação
- **Tags:** Credenciamento, Lei 14.133, Licitação
- **Data:** 06/02/2026
- **Fonte:** Planalto — https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/l14133.htm

### Post 14
- **Título:** SICAF e Transferegov: novidades de 2026 para quem trabalha com compras públicas e convênios
- **Slug:** sicaf-transferegov-novidades-2026-governo-digital
- **Categoria:** Tecnologia
- **Tags:** SICAF, Transferegov, PNCP, Tecnologia
- **Data:** 05/02/2026
- **Fonte:** Gov.br / Compras — https://www.gov.br/compras/

### Post 15 — DESTAQUE
- **Título:** Acórdãos, súmulas e jurisprudência: o que são e por que todo servidor de compras precisa conhecer
- **Slug:** acordaos-sumulas-jurisprudencia-o-que-sao-compras-publicas
- **Categoria:** Jurisprudência
- **Tags:** Jurisprudência, TCU, Lei 14.133
- **Data:** 04/02/2026
- **Destaque:** Sim
- **Fonte:** TCU — Jurisprudência — https://portal.tcu.gov.br/jurisprudencia/

### Post 16
- **Título:** Ranking: os 15 erros em licitações que mais geram multas do TCU, TCE-MG e outros TCEs do Brasil
- **Slug:** ranking-erros-licitacoes-tcu-tce-mg-brasil
- **Categoria:** Compliance
- **Tags:** Multas e Sanções, TCU, TCE, Compliance
- **Data:** 03/02/2026
- **Fonte:** TCU / TCE-MG / TCE-SP — https://portal.tcu.gov.br/jurisprudencia/

### Post 17
- **Título:** Guia completo: benefícios para micro e pequenas empresas (ME/EPP) em licitações em 2026
- **Slug:** beneficios-fornecedores-me-epp-licitacoes-2026
- **Categoria:** Licitação
- **Tags:** ME/EPP, Fornecedores, Licitação
- **Data:** 02/02/2026
- **Fonte:** Sebrae — https://www.sebrae.com.br/sites/PortalSebrae/artigos/como-participar-de-licitacoes

### Post 18
- **Título:** Convênios e transferências voluntárias em 2026: como captar e executar recursos federais sem devolver
- **Slug:** convenios-transferencias-voluntarias-2026-guia
- **Categoria:** Gestão Pública
- **Tags:** Convênios, Transferegov, Emendas Parlamentares
- **Data:** 01/02/2026
- **Fonte:** Gov.br / Transferegov — https://www.gov.br/transferegov/

### Post 19
- **Título:** 7 tendências para compras públicas em 2026: IA, dados abertos, sustentabilidade e o fim do papel
- **Slug:** tendencias-compras-publicas-2026-ia-sustentabilidade-dados
- **Categoria:** Tecnologia
- **Tags:** Tecnologia, IA em Compras Públicas, Transparência
- **Data:** 31/01/2026
- **Fonte:** ATA360

### Post 20
- **Título:** Lei 14.133/2021 comentada: os 20 artigos que todo servidor de compras precisa dominar na prática
- **Slug:** lei-14133-comentada-artigos-mais-importantes-pratica
- **Categoria:** Legislação
- **Tags:** Lei 14.133, Guias Práticos, Servidor Público
- **Data:** 30/01/2026
- **Fonte:** Planalto — https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/l14133.htm

> **DICA:** Para o conteúdo completo de cada post (corpo do artigo), copie do arquivo `lib/blog.ts` no repositório — cada post tem o campo `content` com o texto completo em Markdown/HTML.

---

## PARTE 4 — Criar Career Tags

No CMS → **Career Tags** → **+ New Item**:

| Nome | Slug |
|------|------|
| Tecnologia | tecnologia |
| Design | design |
| Comercial | comercial |
| Marketing | marketing |
| GovTech | govtech |
| Desenvolvimento | desenvolvimento |

---

## PARTE 5 — Criar Vagas de Emprego (4 Vagas Reais)

No CMS → **Careers** → **+ New Item**:

### Vaga 1 — Desenvolvedor(a) Full-Stack
- **Slug:** desenvolvedor-full-stack
- **Descrição curta:** Crie a plataforma que transforma compras públicas no Brasil. Stack: Next.js, TypeScript, Supabase, Tailwind CSS, OpenAI.
- **Modalidade:** CLT ou PJ + Estágio
- **Regime:** Híbrido/Remoto
- **Local:** Vespasiano/MG
- **Tags:** Tecnologia, Desenvolvimento, GovTech
- **Status:** Aberta

### Vaga 2 — UX/UI Designer
- **Slug:** ux-ui-designer
- **Descrição curta:** Projete experiências que simplificam a vida de servidores públicos. Figma, design systems, acessibilidade WCAG.
- **Modalidade:** CLT ou PJ + Estágio
- **Regime:** Híbrido/Remoto
- **Local:** Vespasiano/MG
- **Tags:** Design, GovTech
- **Status:** Aberta

### Vaga 3 — Comercial GovTech (SDR / AE)
- **Slug:** comercial-govtech
- **Descrição curta:** Conecte municípios à solução que moderniza suas compras públicas. Vendas consultivas B2G, ciclo completo.
- **Modalidade:** CLT
- **Regime:** Presencial/Híbrido
- **Local:** Vespasiano/MG
- **Tags:** Comercial, GovTech
- **Status:** Aberta

### Vaga 4 — Marketing Digital
- **Slug:** marketing-digital
- **Descrição curta:** Posicione o ATA360 como referência em GovTech. SEO, conteúdo técnico, campanhas e growth para o setor público.
- **Modalidade:** CLT ou PJ + Estágio
- **Regime:** Remoto
- **Local:** Vespasiano/MG
- **Tags:** Marketing, GovTech
- **Status:** Aberta

---

## PARTE 6 — Configurações Gerais do Webflow

### 6.1 Idioma do Site
1. **Settings** → **General** → **Localization**
2. Idioma padrão: **Português (Brasil)**
3. Hreflang: `pt-BR`

### 6.2 SEO Global
1. **Settings** → **SEO**
2. **Title format:** `%page_title% | ATA360 — Inteligência em Contratações Públicas`
3. **Meta description padrão:** `ATA360 é a plataforma de inteligência artificial para contratações públicas. Pesquisa de preços, ETP, TR e DFD com IA especializada e dados oficiais.`
4. **Open Graph image:** logo ou banner institucional do ATA360
5. **Favicon:** ícone ATA360

### 6.3 Analytics
1. **Settings** → **Custom Code** → **Head**
2. Adicionar Google Analytics 4 (GA4)
3. Adicionar Google Tag Manager (se utilizar)
4. Adicionar Meta Pixel (se utilizar Facebook Ads)

### 6.4 Robots.txt
1. **Settings** → **SEO** → **Robots.txt**
2. Configurar:
```
User-agent: *
Allow: /
Sitemap: https://www.ata360.com.br/sitemap.xml
```

### 6.5 Sitemap
- O Webflow gera automaticamente o sitemap.xml
- Verificar se todas as páginas CMS estão incluídas
- Submeter no Google Search Console

### 6.6 301 Redirects
- Se havia URLs antigas em inglês, criar redirects 301:
  - `/blog/old-english-post` → `/blog` (ou página relevante)
  - Isso preserva qualquer autoridade SEO existente

---

## PARTE 7 — Publicar

1. Revisar todo o conteúdo criado
2. Verificar links e imagens
3. **Publish** → selecionar domínio(s)
4. Testar no celular e desktop
5. Submeter sitemap atualizado no Google Search Console

---

## Checklist Final

- [ ] Todos os 29 posts em inglês excluídos
- [ ] Todas as 5 tags em inglês excluídas
- [ ] Todas as 6 vagas em inglês excluídas
- [ ] 33 novas blog tags criadas em português
- [ ] 20 novos blog posts criados em português
- [ ] 6 career tags criadas em português
- [ ] 4 vagas reais criadas (Vespasiano/MG)
- [ ] SEO global configurado em pt-BR
- [ ] Analytics adicionado
- [ ] Robots.txt configurado
- [ ] Sitemap submetido no Google Search Console
- [ ] Site publicado e testado
