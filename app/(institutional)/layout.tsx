import React from 'react'
import type { Metadata } from 'next'
import type { Route } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  robots: { index: true, follow: true },
}

const NAV_LINKS = [
  { href: '/quem-somos', label: 'Quem Somos' },
  { href: '/solucoes', label: 'Soluções' },
  { href: '/blog', label: 'Notícias' },
  { href: '/contato', label: 'Contato' },
] as const

const FOOTER_INSTITUTIONAL = [
  { href: '/quem-somos', label: 'Quem Somos' },
  { href: '/solucoes', label: 'Soluções' },
  { href: '/humano-ia', label: 'Humano + I.A.' },
  { href: '/parceiros', label: 'Parceiros' },
  { href: '/carreiras', label: 'Carreiras' },
  { href: '/manifesto', label: 'Manifesto' },
] as const

const FOOTER_LEGAL_CONTEUDO = [
  { href: '/blog', label: 'Notícias' },
  { href: '/glossario', label: 'Glossário' },
  { href: '/privacidade', label: 'Privacidade' },
  { href: '/termos', label: 'Termos de Uso' },
  { href: '/lgpd', label: 'LGPD' },
  { href: '/cookies', label: 'Cookies' },
] as const

/**
 * Layout institucional — paginas públicas de apresentação.
 * Header com navegação principal + footer completo.
 * Sem autenticação. Otimizado para AI crawlers e SEO.
 */
export default function InstitutionalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-4">
          <Link href={'/' as Route} className="flex items-center gap-2 font-semibold text-lg tracking-tight">
            <span className="text-primary">&#9654;</span>
            <span>ATA360</span>
          </Link>
          <nav className="hidden sm:flex items-center gap-6 text-sm text-muted-foreground">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href as Route}
                className="hover:text-foreground transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>
          <a
            href="https://app.ata360.com.br"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Acessar
          </a>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/30">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 font-semibold text-lg mb-3">
                <span className="text-primary">&#9654;</span>
                <span>ATA360</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Infraestrutura de inteligência em contratações públicas brasileiras.
              </p>
            </div>

            {/* Institucional */}
            <div>
              <h3 className="font-semibold text-sm mb-3">Institucional</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {FOOTER_INSTITUTIONAL.map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href as Route} className="hover:text-foreground transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal & Conteúdo */}
            <div>
              <h3 className="font-semibold text-sm mb-3">Legal &amp; Conteúdo</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {FOOTER_LEGAL_CONTEUDO.map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href as Route} className="hover:text-foreground transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contato */}
            <div>
              <h3 className="font-semibold text-sm mb-3">Contato</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="mailto:suporte@ata360.com.br"
                    className="hover:text-foreground transition-colors"
                  >
                    suporte@ata360.com.br
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:ouvidoria@ata360.com.br"
                    className="hover:text-foreground transition-colors"
                  >
                    ouvidoria@ata360.com.br
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:financeiro@ata360.com.br"
                    className="hover:text-foreground transition-colors"
                  >
                    financeiro@ata360.com.br
                  </a>
                </li>
                <li>
                  <Link href={'/contato' as Route} className="hover:text-foreground transition-colors">
                    Fale Conosco
                  </Link>
                </li>
                <li>
                  <Link href={'/suporte' as Route} className="hover:text-foreground transition-colors">
                    Suporte
                  </Link>
                </li>
                <li>
                  <Link href={'/acessibilidade' as Route} className="hover:text-foreground transition-colors">
                    Acessibilidade
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground/60">
            <p>&copy; {new Date().getFullYear()} ATA360 TECNOLOGIA LTDA. Todos os direitos reservados.</p>
            <p>CNPJ 61.291.296/0001-31 &bull; Empresa Simples de Inovação (LC 182/2021)</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
