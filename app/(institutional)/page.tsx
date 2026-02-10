import type { Metadata } from 'next'
import type { Route } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'ATA360 — Infraestrutura de Inteligencia em Contratacoes Publicas',
  description: 'Plataforma brasileira com IA especialista na Lei 14.133/2021. Pesquisa de precos em fontes oficiais, geracao de documentos licitatorios e auditoria automatica de conformidade para municipios e orgaos publicos.',
  keywords: [
    'contratacoes publicas', 'licitacao', 'lei 14.133', 'ata de registro de precos',
    'PNCP', 'GovTech Brasil', 'pesquisa de precos', 'pregao eletronico',
    'termo de referencia', 'estudo tecnico preliminar', 'compliance licitatorio',
  ],
}

const NUMEROS = [
  { valor: 'R$ 1+ tri', descricao: 'Movimentados anualmente em compras publicas no Brasil', fonte: 'Portal da Transparencia / TCU' },
  { valor: '5.570', descricao: 'Municipios brasileiros com obrigacao de licitar conforme Lei 14.133/2021', fonte: 'IBGE' },
  { valor: '17+', descricao: 'Fontes oficiais integradas: PNCP, IBGE, TCU, CGU, BCB e outras', fonte: 'Infraestrutura propria' },
  { valor: '110+', descricao: 'Endpoints de APIs governamentais para dados em tempo real', fonte: 'Infraestrutura propria' },
  { valor: '560+', descricao: 'Jurisprudencias do TCU e tribunais estaduais indexadas', fonte: 'TCU / TCEs' },
  { valor: '1.4M+', descricao: 'Itens de atas e contratos unificados para pesquisa de precos', fonte: 'PNCP / Compras.gov.br' },
] as const

const CAPACIDADES = [
  {
    titulo: 'Pesquisa de Precos',
    descricao: 'Consulta automatica ao PNCP, Compras.gov.br e demais fontes oficiais. Calculo estatistico conforme IN SEGES 65/2021: media, mediana, desvio padrao e coeficiente de variacao.',
  },
  {
    titulo: 'Documentos Licitatorios',
    descricao: 'Geracao assistida de DFD, ETP, TR, PP, JCD, ARP e mais de 40 tipos de artefatos. Fundamentacao legal automatica com Art. e inciso correspondente.',
  },
  {
    titulo: 'Auditoria de Conformidade',
    descricao: 'Verificacao automatica contra a Lei 14.133/2021, LINDB, jurisprudencia TCU e normativos aplicaveis. Parecer tripartite: conforme, ressalva ou nao conforme.',
  },
  {
    titulo: 'Inteligencia de Dados',
    descricao: 'Cruzamento de dados de 17+ fontes oficiais para identificar oportunidades, riscos e padroes. Radar de recursos, emendas parlamentares e transferencias voluntarias.',
  },
] as const

const DIFERENCIAIS = [
  { titulo: 'Dados Oficiais', descricao: 'Toda informacao vem de fontes do governo brasileiro. O sistema nao inventa dados.' },
  { titulo: 'Multiplas Blindagens', descricao: 'Camadas de verificacao cruzada, auditoria automatica e revisao humana obrigatoria.' },
  { titulo: 'Exclusivo Setor Publico', descricao: 'Atende apenas entes publicos. Nao vende para fornecedores ou licitantes.' },
  { titulo: 'Selo de Qualidade', descricao: 'Certificacao de conformidade com a Lei 14.133/2021 em cada documento aprovado.' },
  { titulo: 'Edge Computing', descricao: 'Infraestrutura distribuida globalmente com latencia inferior a 50ms em todo o Brasil.' },
  { titulo: 'Seguranca Nivel Bancario', descricao: 'Criptografia AES-256, isolamento multi-tenant, certificacoes SOC 2 e ISO 27001.' },
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
              Infraestrutura de Inteligencia em Contratacoes Publicas
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-2xl">
              Plataforma brasileira com IA especializada na Nova Lei de Licitacoes.
              Pesquisa de precos em fontes oficiais, geracao de documentos e auditoria
              de conformidade — tudo em um unico ambiente seguro.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href={'/contato' as Route}
                className="rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Solicitar Demonstracao
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
          <h2 className="text-2xl font-bold mb-2">Brasil em numeros</h2>
          <p className="text-sm text-muted-foreground mb-10">
            Dados reais da infraestrutura de compras publicas brasileira.
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {NUMEROS.map(({ valor, descricao, fonte }) => (
              <div key={valor} className="rounded-lg border border-border bg-card p-6">
                <p className="text-3xl font-bold text-primary mb-2">{valor}</p>
                <p className="text-sm text-foreground leading-relaxed">{descricao}</p>
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
            Quatro nucleos de inteligencia que operam de forma integrada.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CAPACIDADES.map(({ titulo, descricao }) => (
              <div key={titulo} className="rounded-lg border border-border bg-card p-6">
                <h3 className="font-semibold mb-2">{titulo}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{descricao}</p>
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
            Construido para o setor publico brasileiro, com a infraestrutura que ele merece.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {DIFERENCIAIS.map(({ titulo, descricao }) => (
              <div key={titulo} className="rounded-lg border border-border bg-card p-6">
                <h3 className="font-semibold mb-2">{titulo}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-primary/5">
        <div className="mx-auto max-w-6xl px-6 py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Compras publicas com inteligencia, transparencia e conformidade
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            O ATA360 esta pronto para transformar a gestao de contratacoes do seu orgao.
            Solicite uma demonstracao e veja como dados oficiais, IA especializada e
            auditoria automatica trabalham juntos.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href={'/contato' as Route}
              className="rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Solicitar Demonstracao
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
