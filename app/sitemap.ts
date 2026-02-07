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
  ]
}
