import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ATA360 - Contratações Públicas',
    short_name: 'ATA360',
    description: 'Plataforma inteligente de contratações públicas',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1E3A5F',
    icons: [
      { src: '/icon-light-32x32.png', sizes: '32x32', type: 'image/png' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    lang: 'pt-BR',
    categories: ['government', 'business', 'productivity'],
  }
}
