# ATA360 — Site Institucional (Pre-Login)

Copy e conteudo prontos para aplicar no Webflow.

## Arquitetura
- **www.ata360.com.br** — Site institucional (Webflow, pre-login)
- **app.ata360.com.br** — Plataforma ATA360 (Vercel/Next.js, pos-login)

## Estrutura

```
site-institucional/
  homepage/           # 16 secoes da homepage (copy exata)
    01-hero.md
    02-logos.md
    03-metricas.md
    04-depoimento.md
    05-tabs.md
    06-grid-cards.md
    07-cta-dark.md
    08-cards-dark.md
    09-comparativo.md
    10-separador.md
    11-depoimentos.md  (escondida — aguardando autorizacao)
    12-blog.md          (ATIVA — 21 posts prontos)
    13-cta-final.md
    14-inteligencia.md
    15-soberania.md
    16-footer.md
  paginas/            # Paginas internas
    solicitar-acesso.md
    precos.md
    quem-somos.md
    solucoes.md
    contato.md
    ouvidoria.md
  seo/                # SEO e dados estruturados
    schema-org.json
    meta-descriptions.md
  webflow-cms/        # CSVs prontos para importacao no Webflow CMS
    blog-tags.csv       # 33 tags tematicas
    blog-posts.csv      # 21 noticias curadas (TCU, PNCP, MGI, CGU, ENAP)
    carreiras-tags.csv  # 6 tags de vagas
    carreiras.csv       # 4 vagas (Vespasiano/MG)
    glossario.csv       # 14 termos da Lei 14.133
    jurisprudencia-tce.csv # 15 decisoes de 12 TCEs
    README-IMPORTACAO.md
    GUIA-WEBFLOW-PASSO-A-PASSO.md
  emails/             # Sequencia de onboarding
    sequencia-onboarding.md
```

## Regras de protecao estrategica

| Revelar no site        | NAO revelar                              |
|------------------------|------------------------------------------|
| O PROBLEMA que resolve | A ARQUITETURA de como resolve            |
| O RESULTADO que entrega| As FONTES DE DADOS especificas           |
| A LEI que fundamenta   | Os NOMES dos agentes                     |
| Que funciona           | COMO funciona por dentro                 |
| Que e exclusivo        | POR QUE e exclusivo                      |

## Validacao
Copy validada com frameworks: Joanna Wiebe (Copyhackers), Harry Dry (Marketing Examples), Eddie Shleyner (VeryGoodCopy), Stefan Georgi (RMBC), Peep Laja (Wynter/CXL).

## Deploy
Template: Neurex (Webflow)
Prazo: 24h
