import type { Metadata } from 'next'
import type { Route } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Compliance e Etica',
  description: 'Programa de compliance da ATA360: anticorrupcao, etica, código de conduta, diversidade, proteção a crianca, canal de denúncia e fundamentação legal completa.',
}

const PILARES = [
  {
    titulo: 'Anticorrupcao',
    descrição: 'Politica de tolerância zero conforme Lei 12.846/2013. A plataforma não permite direcionamento de licitações, conluio ou favorecimento. A imparcialidade é estrutural: algoritmos auditáveis, dados rastreavéis, zero parâmetros ocultos.',
    fundamentação: 'Lei 12.846/2013, Arts. 41-42 da Lei 14.133/2021',
  },
  {
    titulo: 'Codigo de Conduta',
    descrição: 'Todos os colaboradores e parceiros da ATA360 aderem ao Codigo de Conduta que inclui: vedacao a conflito de interesses, dever de confidencialidade, proibicao de uso de informação privilegiada e compromisso com a imparcialidade em todas as operacoes.',
    fundamentação: 'Portaria CGU 226/2025, Decreto 11.129/2022',
  },
  {
    titulo: 'Politica de Brindes e Hospitalidade',
    descrição: 'A ATA360 não oferece brindes, presentes, hospitalidade ou qualquer benefício a agentes públicos. Nenhum colaborador esta autorizado a aceitar ou oferecer vantagens que possam influênciar decisões de contratação.',
    fundamentação: 'Art. 337-B do Codigo Penal (corrupcao ativa), Decreto 11.129/2022',
  },
  {
    titulo: 'Due Diligence de Parceiros',
    descrição: 'Parceiros comerciais e fornecedores sao avaliados quanto a idoneidade, antecedentes e alinhamento com nossas políticas de compliance. A ATA360 não contrata empresas impedidas ou sancionadas.',
    fundamentação: 'CEIS, CNEP, CEPIM — Portal da Transparência',
  },
  {
    titulo: 'Diversidade e Inclusao',
    descrição: 'Compromisso com equidade em contratações e acesso. A plataforma atende WCAG 2.1 AA para acessibilidade. A precificacao por FPM garante que municípios menores tenham acesso proporcional.',
    fundamentação: 'Constituição Federal Art. 5, Lei 13.146/2015 (Estatuto PcD)',
  },
  {
    titulo: 'Protecao a Crianca e ao Adolescente',
    descrição: 'A ATA360 não coleta, processa ou armazena dados de menores de idade. A plataforma atende exclusivamente entes públicos e servidores. Clausula expressa no Codigo de Conduta vedando trabalho infantil na cadeia de fornecimento.',
    fundamentação: 'ECA (Lei 8.069/1990), LGPD Art. 14',
  },
] as const

const LEGISLACAO = [
  { norma: 'Constituição Federal, Art. 37', tema: 'Principios da administração publica' },
  { norma: 'Lei 14.133/2021', tema: 'Nova Lei de Licitacoes e Contratos Administrativos' },
  { norma: 'LGPD (Lei 13.709/2018)', tema: 'Protecao de dados pessoais' },
  { norma: 'Lei 12.846/2013', tema: 'Responsabilizacao administrativa e civil de PJ por corrupcao' },
  { norma: 'Decreto 11.129/2022', tema: 'Regulamenta a Lei Anticorrupcao' },
  { norma: 'LINDB (Lei 13.655/2018)', tema: 'Normas de segurança jurídica (Arts. 20-23, 28, 30)' },
  { norma: 'Lei 12.527/2011 (LAI)', tema: 'Acesso a informação publica' },
  { norma: 'Lei 12.965/2014 (Marco Civil)', tema: 'Principios, garantias, direitos e deveres na internet' },
  { norma: 'Lei 14.063/2020', tema: 'Assinatura eletrônica em interacoes com entes públicos' },
  { norma: 'Lei 9.279/1996', tema: 'Propriedade industrial e segredo industrial' },
  { norma: 'Lei 9.609/1998', tema: 'Protecao jurídica de software' },
  { norma: 'LC 182/2021', tema: 'Marco Legal das Startups e Empreendedorismo Inovador' },
  { norma: 'PL 2.338/2023', tema: 'Marco regulatório da IA (em tramitacao)' },
  { norma: 'PBIA 2024-2028', tema: 'Plano Brasileiro de Inteligência Artificial' },
  { norma: 'Portaria CGU 226/2025', tema: 'Diretrizes para programa de integridade' },
  { norma: 'Lei 13.608/2018', tema: 'Canal de denúncia e proteção ao denúnciante' },
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
          desenvolvimento de produto e relacoes com o setor público.
        </p>
      </header>

      {/* Pilares — 2 colunas */}
      <section className="mb-20">
        <h2 className="text-2xl font-bold mb-2">Pilares de integridade</h2>
        <p className="text-sm text-muted-foreground mb-10">
          Baseados nas Diretrizes CGU (Portaria 226/2025) e na Lei 12.846/2013.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PILARES.map(({ titulo, descrição, fundamentação }) => (
            <div key={titulo} className="rounded-lg border border-border p-6">
              <h3 className="font-semibold mb-3">{titulo}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">{descrição}</p>
              <p className="text-xs text-muted-foreground/60">Base legal: {fundamentação}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Jurisprudência Aplicada */}
      <section className="mb-20">
        <h2 className="text-2xl font-bold mb-2">Jurisprudência aplicada</h2>
        <p className="text-sm text-muted-foreground mb-10">
          O ATA360 incorpora entendimentos consolidados dos tribunais de contas
          na logica de auditoria e geração de documentos.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-lg border border-border p-6">
            <p className="text-xs font-medium text-primary mb-2 uppercase tracking-wide">Responsabilidade</p>
            <h3 className="font-semibold mb-2">LINDB Art. 28 + Lei 14.133 Art. 73</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Responsabilizacao pessoal do agente exige dolo ou erro grosseiro.
              Em contratação direta indevida, agente e contratada respondem
              solidariamente pelo ressarcimento ao erario. O ATA360 atua de forma
              preventiva: auditoria antes da assinatura reduz o risco de erro.
            </p>
          </div>

          <div className="rounded-lg border border-border p-6">
            <p className="text-xs font-medium text-primary mb-2 uppercase tracking-wide">Planejamento</p>
            <h3 className="font-semibold mb-2">ETP: diagnóstico antes da solução</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              O ETP (Art. 18, Lei 14.133) existe para entender o problema e mapear
              alternativas — não para descrever o objeto. A antecipacao da definição
              do objeto na fase de estudo e erro recorrente que compromete a logica
              do planejamento. O ATA360 garante a sequencia correta.
            </p>
          </div>

          <div className="rounded-lg border border-border p-6">
            <p className="text-xs font-medium text-primary mb-2 uppercase tracking-wide">Habilitacao</p>
            <h3 className="font-semibold mb-2">TCE-MG: proporcionalidade no Art. 67</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              O TCE-MG orienta que exigências de documentação na habilitação devem
              respeitar razoabilidade e proporcionalidade (Arts. 12 e 64, Lei 14.133).
              Excesso restringe competição. O ATA360 calibra checklists conforme tipo
              e porte da contratação.
            </p>
          </div>

          <div className="rounded-lg border border-border p-6">
            <p className="text-xs font-medium text-primary mb-2 uppercase tracking-wide">Prestação de Contas</p>
            <h3 className="font-semibold mb-2">Medicoes e responsabilidade solidaria</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Tribunais de contas consolidam entendimento de que a aprovacao de
              medicoes irregulares gera responsabilidade solidaria entre agente e
              contratada. O ATA360 registra trilha de auditoria em cada medicao
              e etapa, reduzindo risco de irregularidade na prestação de contas.
            </p>
          </div>
        </div>
      </section>

      {/* Canal de Denúncia */}
      <section className="mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Canal de Denúncia</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              A ATA360 mantem canal de denúncia acessível a qualquer pessoa — servidores
              públicos, colaboradores, parceiros e cidadaos — para comúnicar
              irregularidades, condutas antiéticas ou violacoes de compliance.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              <strong>Anonimato garantido:</strong> Denúncias podem ser realizadas de forma
              anonima. O sistema gera protocolo único para acompanhamento sem identificacao
              do denúnciante.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong>Protecao ao denúnciante:</strong> Conforme Lei 13.608/2018, e vedada
              qualquer forma de retaliacao contra quem comúnicar irregularidades de boa-fe.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">Como reportar</h2>
            <div className="rounded-lg border border-border p-6 space-y-4">
              <div>
                <p className="text-sm font-semibold mb-1">E-mail</p>
                <a href="mailto:ouvidoria@ata360.com.br" className="text-sm text-primary hover:underline">
                  ouvidoria@ata360.com.br
                </a>
                <p className="text-xs text-muted-foreground mt-1">Assunto: &ldquo;Canal de Denúncia&rdquo;</p>
              </div>
              <div>
                <p className="text-sm font-semibold mb-1">Formulario</p>
                <Link href={'/contato' as Route} className="text-sm text-primary hover:underline">
                  Fale Conosco &rarr;
                </Link>
                <p className="text-xs text-muted-foreground mt-1">Selecione &ldquo;Denúncia/Ouvidoria&rdquo;</p>
              </div>
              <div>
                <p className="text-sm font-semibold mb-1">Prazo de resposta</p>
                <p className="text-sm text-muted-foreground">Ate 10 dias úteis para acusacao de recebimento.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabela de legislação */}
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
