import type { Metadata } from 'next'
import type { Route } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Politica de Cookies',
  description: 'Politica de cookies da ATA360: categorias, finalidades, duracao e como gerenciar seus cookies na plataforma de contratacoes publicas.',
}

const COOKIES = [
  {
    categoria: 'Essenciais',
    obrigatorio: true,
    descricao: 'Necessarios para o funcionamento basico da plataforma. Nao podem ser desabilitados.',
    cookies: [
      { nome: 'sb-session', finalidade: 'Sessao de autenticacao Gov.br via provedor de identidade.', duracao: 'Sessao (expira ao fechar navegador)', tipo: 'Funcional' },
      { nome: 'sb-refresh', finalidade: 'Token de renovacao de sessao para manter autenticacao ativa.', duracao: '7 dias', tipo: 'Funcional' },
      { nome: 'csrf-token', finalidade: 'Protecao contra ataques CSRF (Cross-Site Request Forgery).', duracao: 'Sessao', tipo: 'Seguranca' },
      { nome: 'cookie-consent', finalidade: 'Registra a preferencia de cookies do usuario.', duracao: '1 ano', tipo: 'Funcional' },
    ],
  },
  {
    categoria: 'Analiticos',
    obrigatorio: false,
    descricao: 'Utilizados para entender como a plataforma e utilizada e identificar melhorias. Dados anonimizados.',
    cookies: [
      { nome: 'analytics-session', finalidade: 'Identificador anonimo de sessao para metricas de uso.', duracao: '30 minutos', tipo: 'Analitico' },
      { nome: 'web-vitals', finalidade: 'Metricas de performance (LCP, FID, CLS) conforme Core Web Vitals.', duracao: 'Sessao', tipo: 'Performance' },
    ],
  },
  {
    categoria: 'IA e Processamento',
    obrigatorio: false,
    descricao: 'Utilizados para otimizar interacoes com a inteligencia artificial da plataforma.',
    cookies: [
      { nome: 'ai-context', finalidade: 'Contexto da conversa atual para continuidade de interacao.', duracao: 'Sessao', tipo: 'Funcional' },
      { nome: 'ai-preferences', finalidade: 'Preferencias de uso da IA (formato de saida, nivel de detalhe).', duracao: '30 dias', tipo: 'Preferencia' },
    ],
  },
  {
    categoria: 'Comunicacao',
    obrigatorio: false,
    descricao: 'Utilizados para notificacoes e comunicacao com o usuario.',
    cookies: [
      { nome: 'notification-pref', finalidade: 'Preferencias de notificacao (alertas de prazo, atualizacoes).', duracao: '1 ano', tipo: 'Preferencia' },
    ],
  },
] as const

export default function CookiesPage() {
  return (
    <article className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
      {/* Header */}
      <header className="max-w-3xl mb-16">
        <p className="text-sm font-medium text-primary mb-4 tracking-wide uppercase">
          Politica de Cookies
        </p>
        <h1 className="text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-6">
          Cookies e rastreamento
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Esta politica explica quais cookies a plataforma ATA360 utiliza, para que
          servem e como voce pode gerencia-los.
        </p>
        <p className="text-sm text-muted-foreground mt-4">
          Ultima atualizacao: 10 de fevereiro de 2026
        </p>
      </header>

      {/* O que sao cookies */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-4">O que sao cookies</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Cookies sao pequenos arquivos de texto armazenados no seu navegador quando
            voce acessa um site. Eles permitem que a plataforma funcione corretamente,
            mantenha sua sessao ativa e melhore a experiencia de uso.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            O ATA360 utiliza o minimo de cookies necessario para operar. Nao utilizamos
            cookies de publicidade, nao vendemos dados e nao rastreamos usuarios em
            sites de terceiros. Conforme a LGPD (Lei 13.709/2018), cookies nao essenciais
            requerem consentimento previo.
          </p>
        </div>
      </section>

      {/* Tabelas por categoria */}
      <section className="mb-12 space-y-10">
        {COOKIES.map(({ categoria, obrigatorio, descricao, cookies: items }) => (
          <div key={categoria}>
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-lg font-bold">{categoria}</h2>
              {obrigatorio ? (
                <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded">
                  Obrigatorio
                </span>
              ) : (
                <span className="text-xs font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded">
                  Opcional
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-4">{descricao}</p>

            <div className="rounded-lg border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left p-3 font-semibold">Cookie</th>
                      <th className="text-left p-3 font-semibold">Finalidade</th>
                      <th className="text-left p-3 font-semibold">Duracao</th>
                      <th className="text-left p-3 font-semibold">Tipo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map(({ nome, finalidade, duracao, tipo }) => (
                      <tr key={nome} className="border-b border-border/50 last:border-0">
                        <td className="p-3 font-mono text-xs whitespace-nowrap">{nome}</td>
                        <td className="p-3 text-muted-foreground">{finalidade}</td>
                        <td className="p-3 text-muted-foreground whitespace-nowrap">{duracao}</td>
                        <td className="p-3 text-muted-foreground whitespace-nowrap">{tipo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Gerenciamento — 2 colunas */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-4">Como gerenciar cookies</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-6">
          <div>
            <h3 className="font-semibold text-sm mb-2">No navegador</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Voce pode configurar seu navegador para bloquear ou alertar sobre cookies.
              Note que desabilitar cookies essenciais pode impedir o funcionamento correto
              da plataforma, incluindo a autenticacao via Gov.br.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-2">Na plataforma</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Ao acessar o ATA360 pela primeira vez, voce vera um banner de consentimento
              que permite aceitar ou recusar cookies opcionais. Sua preferencia e armazenada
              no cookie <code className="text-xs bg-muted px-1 py-0.5 rounded">cookie-consent</code> por
              1 ano.
            </p>
          </div>
        </div>
      </section>

      {/* Base legal e contato */}
      <section className="rounded-lg border border-border bg-muted/20 p-6">
        <h2 className="font-semibold text-sm mb-3">Base legal e contato</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          O uso de cookies pela ATA360 e fundamentado na LGPD (Lei 13.709/2018):
          cookies essenciais operam sob a base legal de execucao de contrato (Art. 7, V);
          cookies opcionais requerem consentimento (Art. 7, I).
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Duvidas sobre cookies e privacidade:{' '}
          <a href="mailto:contato@ata360.com.br" className="text-primary hover:underline">contato@ata360.com.br</a>.
          Consulte tambem nossa{' '}
          <Link href={'/privacidade' as Route} className="text-primary hover:underline">Politica de Privacidade</Link>{' '}
          e pagina de{' '}
          <Link href={'/lgpd' as Route} className="text-primary hover:underline">Direitos LGPD</Link>.
        </p>
      </section>
    </article>
  )
}
