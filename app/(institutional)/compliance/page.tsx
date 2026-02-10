import type { Metadata } from 'next'
import type { Route } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Compliance e Etica',
  description: 'Programa de compliance da ATA360: anticorrupcao, etica, codigo de conduta, diversidade, protecao a crianca, canal de denuncia e fundamentacao legal completa.',
}

const PILARES = [
  {
    titulo: 'Anticorrupcao',
    descricao: 'Politica de tolerancia zero conforme Lei 12.846/2013. A plataforma nao permite direcionamento de licitacoes, conluio ou favorecimento. A imparcialidade e estrutural: algoritmos auditaveis, dados rastreavéis, zero parametros ocultos.',
    fundamentacao: 'Lei 12.846/2013, Arts. 41-42 da Lei 14.133/2021',
  },
  {
    titulo: 'Codigo de Conduta',
    descricao: 'Todos os colaboradores e parceiros da ATA360 aderem ao Codigo de Conduta que inclui: vedacao a conflito de interesses, dever de confidencialidade, proibicao de uso de informacao privilegiada e compromisso com a imparcialidade em todas as operacoes.',
    fundamentacao: 'Portaria CGU 226/2025, Decreto 11.129/2022',
  },
  {
    titulo: 'Politica de Brindes e Hospitalidade',
    descricao: 'A ATA360 nao oferece brindes, presentes, hospitalidade ou qualquer beneficio a agentes publicos. Nenhum colaborador esta autorizado a aceitar ou oferecer vantagens que possam influenciar decisoes de contratacao.',
    fundamentacao: 'Art. 337-B do Codigo Penal (corrupcao ativa), Decreto 11.129/2022',
  },
  {
    titulo: 'Due Diligence de Parceiros',
    descricao: 'Parceiros comerciais e fornecedores sao avaliados quanto a idoneidade, antecedentes e alinhamento com nossas politicas de compliance. A ATA360 nao contrata empresas impedidas ou sancionadas.',
    fundamentacao: 'CEIS, CNEP, CEPIM — Portal da Transparencia',
  },
  {
    titulo: 'Diversidade e Inclusao',
    descricao: 'Compromisso com equidade em contratacoes e acesso. A plataforma atende WCAG 2.1 AA para acessibilidade. A precificacao por FPM garante que municipios menores tenham acesso proporcional.',
    fundamentacao: 'Constituicao Federal Art. 5, Lei 13.146/2015 (Estatuto PcD)',
  },
  {
    titulo: 'Protecao a Crianca e ao Adolescente',
    descricao: 'A ATA360 nao coleta, processa ou armazena dados de menores de idade. A plataforma atende exclusivamente entes publicos e servidores. Clausula expressa no Codigo de Conduta vedando trabalho infantil na cadeia de fornecimento.',
    fundamentacao: 'ECA (Lei 8.069/1990), LGPD Art. 14',
  },
] as const

const LEGISLACAO = [
  { norma: 'Constituicao Federal, Art. 37', tema: 'Principios da administracao publica' },
  { norma: 'Lei 14.133/2021', tema: 'Nova Lei de Licitacoes e Contratos Administrativos' },
  { norma: 'LGPD (Lei 13.709/2018)', tema: 'Protecao de dados pessoais' },
  { norma: 'Lei 12.846/2013', tema: 'Responsabilizacao administrativa e civil de PJ por corrupcao' },
  { norma: 'Decreto 11.129/2022', tema: 'Regulamenta a Lei Anticorrupcao' },
  { norma: 'LINDB (Lei 13.655/2018)', tema: 'Normas de seguranca juridica (Arts. 20-23, 28, 30)' },
  { norma: 'Lei 12.527/2011 (LAI)', tema: 'Acesso a informacao publica' },
  { norma: 'Lei 12.965/2014 (Marco Civil)', tema: 'Principios, garantias, direitos e deveres na internet' },
  { norma: 'Lei 14.063/2020', tema: 'Assinatura eletronica em interacoes com entes publicos' },
  { norma: 'Lei 9.279/1996', tema: 'Propriedade industrial e segredo industrial' },
  { norma: 'Lei 9.609/1998', tema: 'Protecao juridica de software' },
  { norma: 'LC 182/2021', tema: 'Marco Legal das Startups e Empreendedorismo Inovador' },
  { norma: 'PL 2.338/2023', tema: 'Marco regulatorio da IA (em tramitacao)' },
  { norma: 'PBIA 2024-2028', tema: 'Plano Brasileiro de Inteligencia Artificial' },
  { norma: 'Portaria CGU 226/2025', tema: 'Diretrizes para programa de integridade' },
  { norma: 'Lei 13.608/2018', tema: 'Canal de denuncia e protecao ao denunciante' },
] as const

export default function CompliancePage() {
  return (
    <article className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
      {/* Header */}
      <header className="max-w-3xl mb-16">
        <p className="text-sm font-medium text-primary mb-4 tracking-wide uppercase">
          Compliance e Etica
        </p>
        <h1 className="text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-6">
          Integridade como infraestrutura
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          O programa de compliance da ATA360 segue as Diretrizes da CGU para
          Programas de Integridade e e aplicado em todas as operacoes,
          desenvolvimento de produto e relacoes com o setor publico.
        </p>
      </header>

      {/* Pilares — 2 colunas */}
      <section className="mb-20">
        <h2 className="text-2xl font-bold mb-2">Pilares de integridade</h2>
        <p className="text-sm text-muted-foreground mb-10">
          Baseados nas Diretrizes CGU (Portaria 226/2025) e na Lei 12.846/2013.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PILARES.map(({ titulo, descricao, fundamentacao }) => (
            <div key={titulo} className="rounded-lg border border-border p-6">
              <h3 className="font-semibold mb-3">{titulo}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">{descricao}</p>
              <p className="text-xs text-muted-foreground/60">Base legal: {fundamentacao}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Canal de Denuncia */}
      <section className="mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Canal de Denuncia</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              A ATA360 mantem canal de denuncia acessivel a qualquer pessoa — servidores
              publicos, colaboradores, parceiros e cidadaos — para comunicar
              irregularidades, condutas antiéticas ou violacoes de compliance.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              <strong>Anonimato garantido:</strong> Denuncias podem ser realizadas de forma
              anonima. O sistema gera protocolo unico para acompanhamento sem identificacao
              do denunciante.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong>Protecao ao denunciante:</strong> Conforme Lei 13.608/2018, e vedada
              qualquer forma de retaliacao contra quem comunicar irregularidades de boa-fe.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">Como reportar</h2>
            <div className="rounded-lg border border-border p-6 space-y-4">
              <div>
                <p className="text-sm font-semibold mb-1">E-mail</p>
                <a href="mailto:contato@ata360.com.br" className="text-sm text-primary hover:underline">
                  contato@ata360.com.br
                </a>
                <p className="text-xs text-muted-foreground mt-1">Assunto: &ldquo;Canal de Denuncia&rdquo;</p>
              </div>
              <div>
                <p className="text-sm font-semibold mb-1">Formulario</p>
                <Link href={'/contato' as Route} className="text-sm text-primary hover:underline">
                  Fale Conosco &rarr;
                </Link>
                <p className="text-xs text-muted-foreground mt-1">Selecione &ldquo;Denuncia/Ouvidoria&rdquo;</p>
              </div>
              <div>
                <p className="text-sm font-semibold mb-1">Prazo de resposta</p>
                <p className="text-sm text-muted-foreground">Ate 10 dias uteis para acusacao de recebimento.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabela de legislacao */}
      <section>
        <h2 className="text-2xl font-bold mb-2">Fundamentacao legal</h2>
        <p className="text-sm text-muted-foreground mb-8">
          Normativos que fundamentam o programa de compliance da ATA360.
        </p>

        <div className="rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left p-4 font-semibold">Normativo</th>
                  <th className="text-left p-4 font-semibold">Tema</th>
                </tr>
              </thead>
              <tbody>
                {LEGISLACAO.map(({ norma, tema }) => (
                  <tr key={norma} className="border-b border-border/50 last:border-0">
                    <td className="p-4 font-medium whitespace-nowrap">{norma}</td>
                    <td className="p-4 text-muted-foreground">{tema}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </article>
  )
}
