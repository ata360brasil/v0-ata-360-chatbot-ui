# Webflow CMS — Conteúdo em Português para Importação

Estes arquivos CSV estão prontos para importação no Webflow CMS.
Substituem todo o conteúdo placeholder em inglês.

## Arquivos

| Arquivo | Coleção Webflow | Descrição | Itens |
|---------|----------------|-----------|-------|
| `carreiras-tags.csv` | Career Tags | Tags de categorias de vagas | 6 |
| `carreiras.csv` | Careers | 4 vagas reais (Vespasiano/MG) | 4 |
| `blog-tags.csv` | Blog Tags | Tags temáticas para notícias | 33 |
| `blog-posts.csv` | Blog Posts | Notícias curadas de compras públicas | 20 |
| `glossario.csv` | Glossário (*criar coleção*) | Termos de contratações públicas | 14 |
| `jurisprudencia-tce.csv` | Jurisprudência TCE (*criar coleção*) | Decisões dos TCEs estaduais | 15 |

## Coleções que precisam ser criadas no Webflow

### Glossário (nova coleção CMS)
Campos obrigatórios:
- **Name** (texto) — nome do termo
- **Slug** (slug) — URL amigável
- **Abreviação** (texto) — sigla (ETP, TR, DFD, etc.)
- **Definição** (rich text) — texto da definição
- **Base Legal** (texto) — artigo e lei
- **Categoria** (texto) — ex: Documentos, Modalidades
- **Termos Relacionados** (texto) — slugs separados por ;
- **SEO Título** (texto) — título para buscadores
- **SEO Descrição** (texto) — meta description

### Jurisprudência TCE (nova coleção CMS)
Campos obrigatórios:
- **Name** (texto) — título da decisão
- **Slug** (slug)
- **Tribunal** (texto) — ex: TCE-SP, TCE-MG
- **Tipo** (texto) — Acórdão, Súmula, Resolução
- **Número** (texto) — ex: 2847/2024
- **Ano** (número)
- **Relator** (texto)
- **Tema** (texto) — ex: Pregão Eletrônico
- **Ementa** (rich text)
- **Fundamentação** (texto) — artigos separados por ;
- **Dispositivos Legais** (texto) — separados por ;
- **Aplicação Prática** (rich text)
- **Tags** (texto) — separadas por ;
- **Data Publicação** (data)
- **SEO Título** (texto)
- **SEO Descrição** (texto)

## Como importar no Webflow

1. Ir em **CMS** no painel do Webflow
2. Selecionar a coleção (ex: "Careers")
3. Clicar em **Import** (ícone de upload)
4. **DELETAR todos os itens existentes** (conteúdo placeholder em inglês)
5. Fazer upload do CSV correspondente
6. Mapear os campos na tela de importação
7. Confirmar importação
8. Repetir para cada coleção

## Ordem recomendada de importação

1. `carreiras-tags.csv` (primeiro, pois carreiras referenciam tags)
2. `carreiras.csv`
3. `blog-tags.csv` (primeiro, pois blog posts referenciam tags)
4. `blog-posts.csv`
5. `glossario.csv` (criar coleção antes)
6. `jurisprudencia-tce.csv` (criar coleção antes)

## Observações

- Todos os textos estão em português (pt-BR) com acentos
- As vagas são reais e referem-se a Vespasiano/MG
- Os blog posts são notícias curadas de fontes oficiais (TCU, PNCP, MGI, etc.)
- O glossário contém 14 termos da Lei 14.133/2021
- A jurisprudência contém 15 decisões de 12 TCEs diferentes
- O email de candidaturas é suporte@ata360.com.br
