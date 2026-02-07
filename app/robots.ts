import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/settings/'],
      },
    ],
    sitemap: 'https://app.ata360.com.br/sitemap.xml',
  }
}
