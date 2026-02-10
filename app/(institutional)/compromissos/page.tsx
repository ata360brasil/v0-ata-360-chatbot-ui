import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Compromissos — ODS, ESG e Agenda 2030',
  description: 'Compromissos da ATA360 com os Objetivos de Desenvolvimento Sustentavel da ONU, governanca ESG, Acordo de Paris e sustentabilidade aplicada as contratacoes publicas brasileiras.',
}

const ODS_ITEMS = [
  {
    numero: 5,
    nome: 'Igualdade de Genero',
    cor: 'bg-[#FF3A21]',
    targets: ['5.5 — Participacao plena e efetiva das mulheres na lideranca'],
    contribuicao: 'A plataforma padroniza criterios e elimina vies subjetivo em contratacoes, contribuindo para processos mais impessoais e igualitarios. Auditorias automaticas garantem que criterios de julgamento sejam objetivos conforme Art. 33 da Lei 14.133/2021.',
  },
  {
    numero: 9,
    nome: 'Industria, Inovacao e Infraestrutura',
    cor: 'bg-[#FD6925]',
    targets: ['9.1 — Infraestrutura de qualidade, confiavel e resiliente', '9.c — Acesso a tecnologia da informacao e comunicacao'],
    contribuicao: 'O ATA360 e infraestrutura digital para compras publicas: 17+ fontes oficiais integradas, 110+ APIs governamentais, computacao em borda distribuida globalmente. Constituida como Empresa Simples de Inovacao (LC 182/2021).',
  },
  {
    numero: 10,
    nome: 'Reducao das Desigualdades',
    cor: 'bg-[#DD1367]',
    targets: ['10.3 — Igualdade de oportunidades e reducao de desigualdade de resultados'],
    contribuicao: 'Municipios de 5 mil habitantes acessam a mesma qualidade de dados e ferramentas que capitais de estado. A precificacao considera o coeficiente FPM (Fundo de Participacao dos Municipios), tornando a plataforma acessivel conforme o porte do ente publico.',
  },
  {
    numero: 12,
    nome: 'Consumo e Producao Responsaveis',
    cor: 'bg-[#BF8B2E]',
    targets: ['12.7 — Compras publicas sustentaveis'],
    contribuicao: 'Meta 12.7: promover praticas de compras publicas sustentaveis conforme politicas e prioridades nacionais. O ATA360 integra criterios de sustentabilidade na geracao de documentos (Decreto 7.746/2012) e permite rastreabilidade de fornecedores em cadastros de impedimento (CEIS, CNEP, CEPIM).',
  },
  {
    numero: 16,
    nome: 'Paz, Justica e Instituicoes Eficazes',
    cor: 'bg-[#00689D]',
    targets: ['16.5 — Reduzir corrupcao e suborno', '16.6 — Instituicoes eficazes, responsaveis e transparentes', '16.10 — Acesso publico a informacao'],
    contribuicao: 'Auditoria automatica contra a Lei 14.133/2021, LINDB e jurisprudencia TCU. Imparcialidade algoritmicamente garantida. Trilha de auditoria completa em cada documento. Integracao com PNCP para publicidade obrigatoria.',
  },
  {
    numero: 17,
    nome: 'Parcerias e Meios de Implementacao',
    cor: 'bg-[#19486A]',
    targets: ['17.8 — Mecanismo de capacitacao em tecnologia para paises menos desenvolvidos'],
    contribuicao: 'Integracao com ecossistema Gov.br (autenticacao federada), PNCP, Compras.gov.br e demais sistemas de governo. A interoperabilidade com plataformas oficiais fortalece a implementacao de politicas publicas de contratacao.',
  },
] as const

const ESG_PILARES = [
  {
    pilar: 'E — Ambiental',
    metricas: [
      'Infraestrutura cloud-first: servidores alimentados por energia renovavel em datacenters certificados (ISO 50001).',
      'Operacao paperless: documentos digitais com assinatura eletronica (Lei 14.063/2020), eliminando impressao.',
      'Avaliacao de sustentabilidade integrada a geracao de Termos de Referencia (Decreto 7.746/2012).',
      'Criterios de logistica reversa e descarte adequado (Lei 12.305/2010) incorporados em checklists.',
    ],
  },
  {
    pilar: 'S — Social',
    metricas: [
      'Acessibilidade WCAG 2.1 AA em toda a interface. Suporte a leitores de tela e navegacao por teclado.',
      'Precificacao por FPM: municipios menores pagam proporcionalmente menos, garantindo acesso universal.',
      'Exclusividade setor publico: alinhamento total com interesse coletivo, sem conflito de interesses.',
      'Canal de ouvidoria com anonimato protegido para denuncia de irregularidades (Lei 13.608/2018).',
    ],
  },
  {
    pilar: 'G — Governanca',
    metricas: [
      'Programa de Integridade alinhado as Diretrizes CGU (Portaria CGU 226/2025) com 5 pilares.',
      'Avaliacao de Impacto Algoritmico (AIA) documentada conforme PL 2.338/2023 e PBIA 2024-2028.',
      'Codigo de Conduta em IA publicavel com 10 principios. Classificacao: alto risco (IA em admin publica).',
      'Trilha de auditoria imutavel em cada operacao. Selo de Qualidade condicionado a conformidade.',
    ],
  },
] as const

export default function CompromissosPage() {
  return (
    <article className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
      {/* Header */}
      <header className="max-w-3xl mb-16">
        <p className="text-sm font-medium text-primary mb-4 tracking-wide uppercase">
          Compromissos
        </p>
        <h1 className="text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-6">
          ODS, ESG e Agenda 2030
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Nossos compromissos nao sao declaratorios — sao verificaveis na arquitetura
          do sistema, nas funcionalidades entregues e nos dados que utilizamos.
        </p>
      </header>

      {/* ODS */}
      <section className="mb-20">
        <h2 className="text-2xl font-bold mb-2">Objetivos de Desenvolvimento Sustentavel</h2>
        <p className="text-sm text-muted-foreground mb-4">
          A ATA360 contribui diretamente para 6 dos 17 ODS da Agenda 2030 da ONU,
          com acoes verificaveis vinculadas a metas e targets especificos.
        </p>
        <p className="text-xs text-muted-foreground mb-10">
          Referencia: Resolucao A/RES/70/1 da Assembleia Geral da ONU (25/09/2015) — Transformando Nosso Mundo: a Agenda 2030 para o Desenvolvimento Sustentavel.
        </p>

        <div className="space-y-6">
          {ODS_ITEMS.map(({ numero, nome, cor, targets, contribuicao }) => (
            <div key={numero} className="rounded-lg border border-border overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-0">
                {/* Indicador ODS */}
                <div className={`${cor} text-white p-6 flex items-center gap-4 lg:w-56`}>
                  <span className="text-4xl font-bold">{numero}</span>
                  <span className="text-sm font-medium leading-tight">{nome}</span>
                </div>
                {/* Conteudo */}
                <div className="p-6">
                  <div className="mb-3">
                    {targets.map((t) => (
                      <p key={t} className="text-xs text-muted-foreground mb-1">
                        Meta {t}
                      </p>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{contribuicao}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ESG */}
      <section className="mb-20">
        <h2 className="text-2xl font-bold mb-2">Governanca ESG</h2>
        <p className="text-sm text-muted-foreground mb-10">
          Compromissos ambientais, sociais e de governanca integrados a operacao do ATA360.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {ESG_PILARES.map(({ pilar, metricas }) => (
            <div key={pilar} className="rounded-lg border border-border p-6">
              <h3 className="font-bold mb-4">{pilar}</h3>
              <ul className="space-y-3">
                {metricas.map((m) => (
                  <li key={m} className="text-sm text-muted-foreground leading-relaxed flex gap-2">
                    <span className="text-primary shrink-0 mt-1">&bull;</span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Acordo de Paris + Sustentabilidade */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-2">Sustentabilidade e Acordo de Paris</h2>
        <p className="text-sm text-muted-foreground mb-10">
          Acoes concretas de reducao de impacto ambiental alinhadas ao Acordo de Paris
          (UNFCCC, 2015) e a Politica Nacional sobre Mudanca do Clima (Lei 12.187/2009).
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-8">
          <div>
            <h3 className="font-semibold mb-3">Infraestrutura cloud-first</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              A infraestrutura do ATA360 opera em edge computing com datacenters que
              utilizam energia 100% renovavel e possuem certificacoes de eficiencia
              energetica. A computacao distribuida reduz a necessidade de servidores
              dedicados e otimiza o consumo energetico por requisicao.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              PUE (Power Usage Effectiveness) dos datacenters parceiros: inferior a 1.1,
              entre os melhores da industria global.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Operacao 100% digital</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Toda a operacao e paperless. Documentos sao gerados, assinados e
              armazenados digitalmente. A assinatura eletronica conforme Lei 14.063/2020
              (niveis simples, avancado e qualificado com ICP-Brasil) elimina a necessidade
              de impressao.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Considerando que um processo licitatorio tipico gera 200+ paginas impressas,
              e que o Brasil realiza centenas de milhares de licitacoes por ano, a
              digitalizacao completa tem impacto ambiental mensuravel.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Compras publicas sustentaveis</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              O ATA360 integra criterios de sustentabilidade na geracao de Termos de
              Referencia e Estudos Tecnicos Preliminares, conforme Decreto 7.746/2012
              (compras sustentaveis na administracao federal), IN SLTI/MPOG 01/2010 e
              os guias de contratacao sustentavel da AGU e do TCU.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Logistica reversa e descarte</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Checklists de conformidade incluem verificacao de logistica reversa
              (Lei 12.305/2010 — Politica Nacional de Residuos Solidos) e clausulas
              de descarte adequado em contratacoes de bens com ciclo de vida definido.
            </p>
          </div>
        </div>
      </section>

      {/* Nota */}
      <div className="rounded-lg border border-border bg-muted/20 p-6">
        <p className="text-xs text-muted-foreground leading-relaxed">
          <strong>Nota de transparencia:</strong> Os compromissos acima refletem a
          arquitetura e funcionalidades atuais do ATA360. Certificacoes formais (Pro-Etica
          CGU, ABES, TCU Diamante) estao em processo de obtencao. Todos os dados citados
          sao verificaveis nas fontes oficiais referenciadas.
        </p>
      </div>
    </article>
  )
}
