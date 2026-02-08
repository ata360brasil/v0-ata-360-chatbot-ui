import React from "react"
import type { Metadata, Viewport } from 'next'
import { DM_Sans, JetBrains_Mono } from 'next/font/google'
// @vercel/analytics REMOVIDO: deploy = Cloudflare Pages, não Vercel (spec v8)
// Observability: lib/observability.ts (logs + metrics + traces + Web Vitals)
import { OrganizationJsonLd, FAQJsonLd } from '@/components/structured-data'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700'],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
})

// Viewport separado de metadata (Next.js 14+ best practice — Guillermo Rauch / Vercel)
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1f36' },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL('https://app.ata360.com.br'),
  title: {
    default: 'ATA360 — Plataforma Inteligente de Contratações Públicas',
    template: '%s | ATA360',
  },
  description: 'Plataforma com IA especialista na Lei 14.133/2021 para gestão de contratações públicas, atas de registro de preços e processos licitatórios em municípios brasileiros.',
  keywords: [
    'contratações públicas', 'licitação', 'lei 14.133', 'ata de registro de preços',
    'pregão eletrônico', 'PNCP', 'compras públicas', 'gestão municipal',
    'termo de referência', 'estudo técnico preliminar', 'DFD', 'ETP',
    'compliance licitação', 'GovTech Brasil'
  ],
  authors: [{ name: 'ATA360', url: 'https://ata360.com.br' }],
  creator: 'ATA360',
  publisher: 'ATA360',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://app.ata360.com.br',
    siteName: 'ATA360',
    title: 'ATA360 — Plataforma Inteligente de Contratações Públicas',
    description: 'IA sem alucinações, especialista na Lei 14.133/2021. Pesquisas e documentos em segundos.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ATA360 - Plataforma de Contratações Públicas',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ATA360 — Contratações Públicas com IA',
    description: 'IA especialista na Lei 14.133/2021. Pesquisas e documentos em segundos.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://app.ata360.com.br',
    languages: {
      'pt-BR': 'https://app.ata360.com.br',
    },
  },
  category: 'technology',
  classification: 'Government Technology',
  applicationName: 'ATA360',
  other: {
    'geo.region': 'BR',
    'geo.placename': 'Brasil',
    'geo.position': '-19.6285;-43.8953',
    'ICBM': '-19.6285, -43.8953',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" dir="ltr" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
      </head>
      <body className={`${dmSans.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <OrganizationJsonLd />
        <FAQJsonLd />
        {children}
      </body>
    </html>
  )
}
