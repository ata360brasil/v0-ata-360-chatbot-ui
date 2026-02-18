# Webflow CMS — Conteudo em Portugues para Importacao

Estes arquivos CSV estao prontos para importacao no Webflow CMS.
Substituem todo o conteudo placeholder em ingles.

## Arquivos

| Arquivo | Colecao Webflow | Descricao |
|---------|----------------|-----------|
| `carreiras.csv` | Careers | 4 vagas reais (Vespasiano/MG) |
| `carreiras-tags.csv` | Career Tags | Tags de categorias de vagas |
| `blog-posts.csv` | Blog Posts | Noticias curadas de compras publicas |
| `blog-tags.csv` | Blog Tags | Tags tematicas para noticias |

## Como importar no Webflow

1. Ir em **CMS** no painel do Webflow
2. Selecionar a colecao (ex: "Careers")
3. Clicar em **Import** (icone de upload)
4. **DELETAR todos os itens existentes** (conteudo placeholder em ingles)
5. Fazer upload do CSV correspondente
6. Mapear os campos na tela de importacao
7. Confirmar importacao
8. Repetir para cada colecao

## Ordem recomendada de importacao

1. `carreiras-tags.csv` (primeiro, pois carreiras referencia tags)
2. `carreiras.csv`
3. `blog-tags.csv` (primeiro, pois blog posts referencia tags)
4. `blog-posts.csv`

## Observacoes

- Todos os textos estao em portugues (pt-BR)
- As vagas sao reais e referem-se a Vespasiano/MG
- Os blog posts sao noticias curadas de fontes oficiais (TCU, PNCP, MGI, etc.)
- O email de candidaturas e suporte@ata360.com.br
