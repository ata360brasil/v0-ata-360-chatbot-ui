export function OrganizationJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'ATA360',
    applicationCategory: 'GovernmentApplication',
    operatingSystem: 'Web',
    description: 'Plataforma inteligente para gestão de contratações públicas brasileiras com IA especialista na Lei 14.133/2021',
    url: 'https://ata360.com.br',
    author: {
      '@type': 'Organization',
      name: 'ATA360',
      url: 'https://ata360.com.br',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Lagoa Santa',
        addressRegion: 'MG',
        addressCountry: 'BR',
      },
    },
    offers: {
      '@type': 'Offer',
      category: 'SaaS',
      availability: 'https://schema.org/InStock',
    },
    featureList: [
      'Geração automática de documentos licitatórios',
      'Rastreamento de atas de registro de preços',
      'IA especialista na Lei 14.133/2021',
      'Integração PNCP',
      'Auditoria e compliance',
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
