import React from 'react'
import type { Metadata } from 'next'
import type { Route } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  robots: { index: true, follow: true },
}

const NAV_LINKS = [
  { href: '/quem-somos', label: 'Quem Somos' },
  { href: '/blog', label: 'Blog' },
  { href: '/glossario', label: 'Glossario' },
  { href: '/contato', label: 'Contato' },
] as const

const FOOTER_INSTITUTIONAL = [
  { href: '/manifesto', label: 'Manifesto' },
  { href: '/quem-somos', label: 'Quem Somos' },
  { href: '/missao-visao-valores', label: 'Missao e Valores' },
  { href: '/compromissos', label: 'Compromissos' },
  { href: '/compliance', label: 'Compliance' },
  { href: '/seguranca', label: 'Seguranca e IA' },
  { href: '/carta-servidor', label: 'Carta ao Servidor' },
  { href: '/blog', label: 'Blog' },
  { href: '/glossario', label: 'Glossario' },
] as const

const FOOTER_LEGAL = [
  { href: '/privacidade', label: 'Privacidade' },
  { href: '/termos', label: 'Termos de Uso' },
  { href: '/lgpd', label: 'LGPD' },
  { href: '/cookies', label: 'Cookies' },
] as const

/**
 * Layout institucional — paginas publicas de apresentacao.
 * Header com navegacao principal + footer completo.
 * Sem autenticacao. Otimizado para AI crawlers e SEO.
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
          <Link
            href={'/login' as Route}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Acessar
          </Link>
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
                Infraestrutura de inteligencia em contratacoes publicas brasileiras.
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

            {/* Legal */}
            <div>
              <h3 className="font-semibold text-sm mb-3">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {FOOTER_LEGAL.map(({ href, label }) => (
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
                    href="https://www.ata360.com.br"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors"
                  >
                    www.ata360.com.br
                  </a>
                </li>
                <li>
                  <Link href={'/contato' as Route} className="hover:text-foreground transition-colors">
                    Fale Conosco
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground/60">
            <p>&copy; {new Date().getFullYear()} ATA360 TECNOLOGIA LTDA. Todos os direitos reservados.</p>
            <p>CNPJ 61.291.296/0001-31 &bull; Empresa Simples de Inovacao (LC 182/2021)</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
