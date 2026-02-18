import type { Metadata } from 'next'
import type { Route } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'ATA360 — Infraestrutura de Inteligência em Contratações Públicas',
  description: 'Plataforma brasileira com IA especialista na Lei 14.133/2021. Pesquisa de preços em fontes oficiais, geração de documentos licitatórios e auditoria automática de conformidade para municípios e órgãos públicos.',
  keywords: [
    'contratações públicas', 'licitação', 'lei 14.133', 'ata de registro de preços',
    'PNCP', 'GovTech Brasil', 'pesquisa de preços', 'pregão eletrônico',
    'termo de referência', 'estudo técnico preliminar', 'compliance licitatório',
  ],
}

const NUMEROS = [
  { valor: 'R$ 1+ tri', descrição: 'Movimentados anualmente em compras públicas no Brasil', fonte: 'Portal da Transparência / TCU' },
  { valor: '5.570', descrição: 'Municípios brasileiros com obrigação de licitar conforme Lei 14.133/2021', fonte: 'IBGE' },
  { valor: '17+', descrição: 'Fontes oficiais integradas: PNCP, IBGE, TCU, CGU, BCB e outras', fonte: 'Infraestrutura propria' },
  { valor: '110+', descrição: 'Endpoints de APIs governamentais para dados em tempo real', fonte: 'Infraestrutura propria' },
  { valor: '560+', descrição: 'Jurisprudências do TCU e tribunais estaduais indexadas', fonte: 'TCU / TCEs' },
  { valor: '1.4M+', descrição: 'Itens de atas e contratos unificados para pesquisa de preços', fonte: 'PNCP / Compras.gov.br' },
] as const

const CAPACIDADES = [
  {
    titulo: 'Pesquisa de Precos',
    descrição: 'Consulta automática ao PNCP, Compras.gov.br e demais fontes oficiais. Calculo estatístico conforme IN SEGES 65/2021: media, mediana, desvio padrão e coeficiente de variação.',
  },
  {
    titulo: 'Documentos Licitatorios',
    descrição: 'Geracao assistida de DFD, ETP, TR, PP, JCD, ARP e mais de 40 tipos de artefatos. Fundamentacao legal automática com Art. e inciso correspondente.',
  },
  {
    titulo: 'Auditoria de Conformidade',
    descrição: 'Verificacao automática contra a Lei 14.133/2021, LINDB, jurisprudência TCU e normativos aplicaveis. Parecer tripartite: conforme, ressalva ou não conforme.',
  },
  {
    titulo: 'Inteligência de Dados',
    descrição: 'Cruzamento de dados de 17+ fontes oficiais para identificar oportunidades, riscos e padroes. Radar de recursos, emendas parlamentares e transferências voluntárias.',
  },
] as const

const DIFERENCIAIS = [
  { titulo: 'Dados Oficiais', descrição: 'Toda informação vem de fontes do governo brasileiro. O sistema não inventa dados.' },
  { titulo: 'Multiplas Blindagens', descrição: 'Camadas de verificação cruzada, auditoria automática e revisao humana obrigatória.' },
  { titulo: 'Exclusivo Setor Público', descrição: 'Atende apenas entes públicos. Não vende para fornecedores ou licitantes.' },
  { titulo: 'Selo de Qualidade', descrição: 'Certificacao de conformidade com a Lei 14.133/2021 em cada documento aprovado.' },
  { titulo: 'Edge Computing', descrição: 'Infraestrutura distribuida globalmente com latência inferior a 50ms em todo o Brasil.' },
  { titulo: 'Seguranca Nivel Bancario', descrição: 'Criptografia AES-256, isolamento multi-tenant, certificacoes SOC 2 e ISO 27001.' },
] as const

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="mx-auto max-w-6xl px-6 py-24 lg:py-32">
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-primary mb-4 tracking-wide uppercase">
              GovTech &bull; Lei 14.133/2021 &bull; Dados Oficiais
            </p>
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-6">
              Infraestrutura de Inteligência em Contratações Públicas
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-2xl">
              Plataforma brasileira com IA especializada na Nova Lei de Licitacoes.
              Pesquisa de preços em fontes oficiais, geração de documentos e auditoria
              de conformidade — tudo em um único ambiente seguro.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href={'/contato' as Route}
                className="rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Solicitar Demonstração
              </Link>
              <Link
                href={'/login' as Route}
                className="rounded-md border border-border px-6 py-3 text-sm font-semibold hover:bg-accent transition-colors"
              >
                Acessar Plataforma
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Numeros */}
      <section className="border-b border-border/40 bg-muted/20">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-2xl font-bold mb-2">Brasil em números</h2>
          <p className="text-sm text-muted-foreground mb-10">
            Dados reais da infraestrutura de compras públicas brasileira.
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {NUMEROS.map(({ valor, descrição, fonte }) => (
              <div key={valor} className="rounded-lg border border-border bg-card p-6">
                <p className="text-3xl font-bold text-primary mb-2">{valor}</p>
                <p className="text-sm text-foreground leading-relaxed">{descrição}</p>
                <p className="text-xs text-muted-foreground mt-2">Fonte: {fonte}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capacidades */}
      <section className="border-b border-border/40">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-2xl font-bold mb-2">O que o ATA360 faz</h2>
          <p className="text-sm text-muted-foreground mb-10">
            Quatro nucleos de inteligência que operam de forma integrada.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CAPACIDADES.map(({ titulo, descrição }) => (
              <div key={titulo} className="rounded-lg border border-border bg-card p-6">
                <h3 className="font-semibold mb-2">{titulo}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{descrição}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section className="border-b border-border/40 bg-muted/20">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-2xl font-bold mb-2">Por que o ATA360</h2>
          <p className="text-sm text-muted-foreground mb-10">
            Construido para o setor público brasileiro, com a infraestrutura que ele merece.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {DIFERENCIAIS.map(({ titulo, descrição }) => (
              <div key={titulo} className="rounded-lg border border-border bg-card p-6">
                <h3 className="font-semibold mb-2">{titulo}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{descrição}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-primary/5">
        <div className="mx-auto max-w-6xl px-6 py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Compras públicas com inteligência, transparência e conformidade
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            O ATA360 esta pronto para transformar a gestão de contratações do seu órgão.
            Solicite uma demonstração e veja como dados oficiais, IA especializada e
            auditoria automática trabalham juntos.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href={'/contato' as Route}
              className="rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Solicitar Demonstração
            </Link>
            <Link
              href={'/manifesto' as Route}
              className="rounded-md border border-border px-6 py-3 text-sm font-semibold hover:bg-accent transition-colors"
            >
              Nosso Manifesto
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
