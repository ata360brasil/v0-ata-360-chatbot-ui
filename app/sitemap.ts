import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://app.ata360.com.br'
  const lastModified = new Date()

  return [
    { url: baseUrl, lastModified, changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/dashboard`, lastModified, changeFrequency: 'hourly', priority: 0.9 },
    { url: `${baseUrl}/contracts`, lastModified, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/processes`, lastModified, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/assistants`, lastModified, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/files`, lastModified, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${baseUrl}/history`, lastModified, changeFrequency: 'daily', priority: 0.5 },
    { url: `${baseUrl}/team`, lastModified, changeFrequency: 'weekly', priority: 0.5 },
    // Paginas institucionais (publicas — alta prioridade SEO)
    { url: `${baseUrl}/manifesto`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/quem-somos`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/missao-visao-valores`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/compromissos`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/compliance`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/seguranca`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/carta-servidor`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/contato`, lastModified, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/cookies`, lastModified, changeFrequency: 'monthly', priority: 0.3 },
    // Paginas legais (publicas)
    { url: `${baseUrl}/privacidade`, lastModified, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/termos`, lastModified, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/lgpd`, lastModified, changeFrequency: 'monthly', priority: 0.4 },
  ]
}
