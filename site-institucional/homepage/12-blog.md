# SECAO 12: BLOG

## Status: ATIVA (21 posts prontos no CMS — importar blog-posts.csv)

**Titulo:** Noticias e atualizacoes
**Subtitulo:** Conteudo curado sobre contratacoes publicas, direto das fontes oficiais.
**Botao:** Veja mais noticias → /blog

---

## Cards em destaque (3 posts com flag Destaque=Sim)

### Card 1
**Titulo:** TCU regulamenta uso de inteligencia artificial em contratacoes publicas
**Resumo:** O TCU publicou orientacoes sobre IA em processos de contratacao: rastreabilidade, transparencia e revisao humana obrigatoria.
**Tag:** Jurisprudencia
**Tempo:** 4 min
**Data:** 18/02/2026
**Slug:** /blog/tcu-regulamenta-uso-ia-contratacoes-publicas-2026

### Card 2
**Titulo:** Herois solitarios: o servidor publico que faz compras, contratos e licitacoes sozinho
**Resumo:** Em milhares de municipios brasileiros, um unico servidor carrega toda a responsabilidade pelas contratacoes. Esse cenario precisa mudar.
**Tag:** Gestao Publica
**Tempo:** 5 min
**Data:** 12/02/2026
**Slug:** /blog/herois-solitarios-servidor-que-faz-tudo-sozinho

### Card 3
**Titulo:** R$ 8 bilhoes perdidos: como emendas parlamentares sao devolvidas por falta de planejamento
**Resumo:** Todos os anos, municipios devolvem bilhoes em emendas por nao conseguirem executar as contratacoes a tempo.
**Tag:** Gestao Publica
**Tempo:** 5 min
**Data:** 11/02/2026
**Slug:** /blog/bilhoes-perdidos-emendas-parlamentares-falta-planejamento

---

## Posts adicionais com Destaque=Sim (para rotacao ou grid secundario)

- Acordaos, sumulas e jurisprudencia — guia completo (08 min, 04/02/2026)
- PNCP supera 2 milhoes de contratacoes publicadas (04 min, 17/02/2026)

---

## Notas de implementacao
- Exibir 3 cards dos posts mais recentes com Destaque=Sim
- Cada card: titulo, resumo (max 2 linhas), tag, tempo de leitura, data
- Imagem: usar placeholder tematico por categoria (balanca, documento, mapa) ate ter imagens proprias
- Link do card: /blog/[slug]
- Botao "Veja mais noticias" leva para /blog (listagem completa)
- Ordenar por data de publicacao (mais recente primeiro)
- CMS Webflow: importar blog-posts.csv e blog-tags.csv (ver README-IMPORTACAO.md)
- Total disponivel: 21 posts, 33 tags, fontes oficiais (TCU, PNCP, MGI, CGU, ENAP)
