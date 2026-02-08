/**
 * Structured Data (Schema.org JSON-LD)
 *
 * Dados estruturados para SEO e AI-citability.
 * - Google Rich Results
 * - Bing / ChatGPT (WebPilot, Browse)
 * - Perplexity, Google AI Overviews
 *
 * Referências:
 * - schema.org/SoftwareApplication
 * - schema.org/FAQPage
 * - schema.org/BreadcrumbList
 * - Google Structured Data Guidelines
 */

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://app.ata360.com.br'

// ─── Organization + SoftwareApplication (root layout) ────────────────────────

export function OrganizationJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${BASE_URL}/#organization`,
        name: 'ATA360',
        url: 'https://ata360.com.br',
        logo: `${BASE_URL}/icon.png`,
        description: 'Plataforma GovTech brasileira especializada em contratações públicas com inteligência artificial.',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Lagoa Santa',
          addressRegion: 'MG',
          addressCountry: 'BR',
        },
        sameAs: [
          'https://ata360.com.br',
        ],
      },
      {
        '@type': 'WebApplication',
        '@id': `${BASE_URL}/#application`,
        name: 'ATA360',
        url: BASE_URL,
        applicationCategory: 'GovernmentApplication',
        operatingSystem: 'Web',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        description: 'Plataforma inteligente para gestão de contratações públicas brasileiras com IA especialista na Lei 14.133/2021. Gere documentos licitatórios, acompanhe atas de registro de preços e garanta compliance.',
        inLanguage: 'pt-BR',
        author: { '@id': `${BASE_URL}/#organization` },
        provider: { '@id': `${BASE_URL}/#organization` },
        offers: {
          '@type': 'Offer',
          category: 'SaaS',
          priceCurrency: 'BRL',
          availability: 'https://schema.org/InStock',
        },
        featureList: [
          'IA especialista na Lei 14.133/2021 (Nova Lei de Licitações)',
          'Geração automática de Termos de Referência e ETPs',
          'Rastreamento de atas de registro de preços',
          'Integração com PNCP (Portal Nacional de Contratações Públicas)',
          'Auditoria e compliance em contratações públicas',
          'Pesquisa de preços para contratações diretas',
          'DFD (Documento de Formalização de Demanda)',
          'Gestão documental para municípios',
        ],
        screenshot: `${BASE_URL}/og-image.png`,
      },
      {
        '@type': 'WebSite',
        '@id': `${BASE_URL}/#website`,
        url: BASE_URL,
        name: 'ATA360',
        description: 'Plataforma de contratações públicas com IA',
        publisher: { '@id': `${BASE_URL}/#organization` },
        inLanguage: 'pt-BR',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${BASE_URL}/?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

// ─── FAQ Schema (AI-citability: LLMs cite FAQ answers) ───────────────────────

const FAQ_ITEMS = [
  {
    question: 'O que é a Lei 14.133/2021?',
    answer: 'A Lei 14.133/2021 é a Nova Lei de Licitações e Contratos Administrativos do Brasil. Ela substitui a Lei 8.666/1993 e estabelece normas gerais de licitação e contratação para as administrações públicas diretas, autárquicas e fundacionais da União, dos Estados, do Distrito Federal e dos Municípios.',
  },
  {
    question: 'O que é uma ata de registro de preços?',
    answer: 'A ata de registro de preços é um documento vinculativo, obrigacional, com característica de compromisso para futura contratação, em que se registram preços, fornecedores, órgãos participantes e condições praticadas, conforme disposições do edital e propostas apresentadas (Art. 6, XLV da Lei 14.133/2021).',
  },
  {
    question: 'Como a ATA360 ajuda na gestão de contratações públicas?',
    answer: 'A ATA360 utiliza inteligência artificial especializada na Lei 14.133/2021 para: gerar automaticamente Termos de Referência, ETPs e DFDs; rastrear e gerenciar atas de registro de preços; realizar pesquisas de preços conforme IN 65/2021; integrar com o PNCP; e garantir compliance em todas as etapas do processo de contratação.',
  },
  {
    question: 'O que é o PNCP?',
    answer: 'O PNCP (Portal Nacional de Contratações Públicas) é o sítio eletrônico oficial destinado à divulgação centralizada e obrigatória dos atos exigidos pela Lei 14.133/2021. Todos os órgãos da administração pública devem publicar seus editais, contratos e atas no PNCP.',
  },
  {
    question: 'O que é um Termo de Referência na Lei 14.133/2021?',
    answer: 'O Termo de Referência é o documento elaborado a partir dos Estudos Técnicos Preliminares (ETP), que deve conter os elementos necessários e suficientes para caracterizar a contratação, incluindo: definição do objeto, fundamentação, descrição da solução, requisitos, modelo de execução, critérios de medição e pagamento (Art. 6, XXIII da Lei 14.133/2021).',
  },
  {
    question: 'A ATA360 está em conformidade com a LGPD?',
    answer: 'Sim. A ATA360 implementa os princípios de privacy-by-design conforme a LGPD (Lei 13.709/2018), incluindo: consentimento granular (Art. 7), anonimização de dados pessoais (Art. 18, IV), políticas de retenção (Art. 15-16), direitos do titular (Art. 18) e bases legais adequadas para cada tratamento de dados.',
  },
] as const

export function FAQJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

// ─── Breadcrumb Schema (per-route) ───────────────────────────────────────────

interface BreadcrumbItem {
  name: string
  href: string
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${BASE_URL}${item.href}`,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

// ─── Export FAQ items for reuse in page content ──────────────────────────────

export { FAQ_ITEMS }
