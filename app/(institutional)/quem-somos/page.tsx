import type { Metadata } from 'next'
import type { Route } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Quem Somos — Infraestrutura de Dados Oficiais',
  description: 'A ATA360 é uma empresa brasileira de tecnologia especializada em inteligência para contratações públicas. Conheça a infraestrutura, os números e a base de dados que sustentam a plataforma.',
}

const INFRAESTRUTURA = [
  { indicador: '17+ fontes oficiais', descrição: 'PNCP, IBGE, TCU, CGU, BCB, Portal da Transparência, Compras.gov.br, TransfereGov, FNDE, FNS, SICONFI, Câmara, Senado e outras', categoria: 'Dados' },
  { indicador: '110+ endpoints', descrição: 'APIs governamentais integradas para consulta em tempo real de preços, contratos, atas, órgãos, emendas e indicadores', categoria: 'APIs' },
  { indicador: '1.4M+ itens', descrição: 'Atas de registro de preços e contratos unificados em base analítica para pesquisa estatística conforme IN SEGES 65/2021', categoria: 'Preços' },
  { indicador: '560+ jurisprudências', descrição: 'Acórdãos do TCU e tribunais estaduais indexados e vinculados a artigos específicos da Lei 14.133/2021', categoria: 'Jurídico' },
  { indicador: '337K+ itens CATMAT', descrição: 'Catálogo de materiais do governo federal para padronização de descrição de objetos', categoria: 'Catálogos' },
  { indicador: '35K+ itens CATSER', descrição: 'Catálogo de serviços do governo federal para classificação de contratações', categoria: 'Catálogos' },
  { indicador: '40+ tipos de documentos', descrição: 'PCA, DFD, ETP, TR, PP, JCD, ARP e outros artefatos licitatórios gerados via motor determinístico', categoria: 'Artefatos' },
  { indicador: '9 séries BCB', descrição: 'IPCA, IGP-M, Selic, dólar e demais índices econômicos atualizados automaticamente via API do Banco Central', categoria: 'Índices' },
] as const

const O_QUE_NAO_SOMOS = [
  'Não somos IA genérica adaptada ao setor público.',
  'Não vendemos para fornecedores ou licitantes.',
  'Não sugerimos marcas, fornecedores ou direcionamos licitações.',
  'Não inventamos dados — toda informação vem de fonte oficial.',
  'Não substituímos a decisão do servidor — ela é soberana.',
] as const

const VALORES = [
  {
    título: 'Transparência radical',
    descrição: 'Cada documento gerado inclui referências legais explícitas. Cada dado pode ser rastreado até sua fonte oficial. Não há caixa-preta.',
  },
  {
    título: 'Decisão humana soberana',
    descrição: 'A IA fundamenta, o servidor decide. Conforme Art. 20 da LINDB, a decisão final é sempre humana — a plataforma entrega subsídios, nunca substitui o julgamento.',
  },
  {
    título: 'Soberania de dados',
    descrição: 'Infraestrutura no Brasil, conformidade com LGPD (Lei 13.709/2018), criptografia em trânsito e em repouso, e isolamento multi-tenant por órgão.',
  },
  {
    título: 'Interesse público acima de tudo',
    descrição: 'Atendemos exclusivamente entes públicos. Não vendemos para fornecedores — garantindo alinhamento total com o interesse coletivo.',
  },
  {
    título: 'Rigor técnico e jurídico',
    descrição: 'Múltiplas camadas de auditoria, verificação cruzada contra fontes oficiais e blindagem anti-alucinação. Fundamentação baseada na Lei 14.133/2021 e jurisprudência do TCU.',
  },
  {
    título: 'Inovação responsável',
    descrição: 'Classificação de risco conforme PL 2.338/2023 (Marco Regulatório da IA) e PBIA 2024-2028, com Avaliação de Impacto Algorítmico documentada.',
  },
] as const

const COMPROMISSOS_ODS = [
  {
    ods: 'ODS 16',
    título: 'Paz, Justiça e Instituições Eficazes',
    cor: 'bg-[#00689D]',
    descrição: 'Fortalecemos instituições públicas com transparência, rastreabilidade e fundamentação legal em cada ato de contratação — combatendo irregularidades e protegendo o erário.',
  },
  {
    ods: 'ODS 9',
    título: 'Indústria, Inovação e Infraestrutura',
    cor: 'bg-[#FD6925]',
    descrição: 'Infraestrutura digital que integra 17+ fontes governamentais com IA especializada, modernizando processos de compras públicas em municípios de todos os portes.',
  },
  {
    ods: 'ODS 11',
    título: 'Cidades e Comunidades Sustentáveis',
    cor: 'bg-[#FD9D24]',
    descrição: 'Capacitamos os 5.570+ municípios brasileiros a contratar melhor — otimizando recursos públicos e garantindo que cada real seja aplicado com fundamentação.',
  },
  {
    ods: 'ODS 17',
    título: 'Parcerias e Meios de Implementação',
    cor: 'bg-[#19486A]',
    descrição: 'Integração com PNCP, Compras.gov, TCU, IBGE e outras fontes oficiais para criar um ecossistema de dados abertos e interoperáveis a serviço do setor público.',
  },
] as const

export default function QuemSomosPage() {
  return (
    <article className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
      {/* Header */}
      <header className="max-w-3xl mb-16">
        <p className="text-sm font-medium text-primary mb-4 tracking-wide uppercase">
          Quem Somos
        </p>
        <h1 className="text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-6">
          Infraestrutura de dados oficiais para compras públicas
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          A ATA360 é uma empresa brasileira de tecnologia, constituída como Empresa
          Simples de Inovação (LC 182/2021), especializada exclusivamente em inteligência
          para contratações públicas conforme a Lei 14.133/2021.
        </p>
      </header>

      {/* Propósito e Missão */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-12 mb-16">
        <section className="rounded-lg border border-primary/20 bg-primary/5 p-8">
          <p className="text-xs font-medium text-primary mb-2 tracking-wide uppercase">Propósito</p>
          <h2 className="text-2xl font-bold mb-4">Proteger quem decide pelo interesse público</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Conforme a LINDB (Art. 20 e 28) e a Lei 14.133 (Art. 8.º), o servidor público
            responde pessoalmente por suas decisões. O ATA360 existe para entregar
            fundamentação robusta em cada ato de contratação — protegendo quem decide
            pelo interesse coletivo.
          </p>
          <p className="mt-4 text-sm font-semibold text-primary italic">
            &ldquo;Enquanto outros pesquisam preços, nós protegemos decisões.&rdquo;
          </p>
        </section>

        <section className="rounded-lg border border-border bg-muted/20 p-8">
          <p className="text-xs font-medium text-primary mb-2 tracking-wide uppercase">Missão</p>
          <h2 className="text-2xl font-bold mb-4">Fundamentar contratações públicas com dados oficiais e IA responsável</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Integrar fontes governamentais, inteligência artificial e legislação vigente em uma
            plataforma única que automatiza pesquisas de preço, gera documentos licitatórios com
            referências legais explícitas e audita conformidade — servindo exclusivamente entes
            públicos brasileiros.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Humano + I.A. — Você decide. A inteligência artificial fundamenta.
          </p>
        </section>
      </div>

      {/* Valores */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-2">Nossos valores</h2>
        <p className="text-sm text-muted-foreground mb-8">
          Os princípios que guiam cada linha de código e cada decisão da plataforma.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {VALORES.map(({ título, descrição }) => (
            <div key={título} className="rounded-lg border border-border p-6">
              <h3 className="text-sm font-bold mb-2">{título}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{descrição}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 2 colunas: apresentação + identidade */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-12 mb-16">
        <section>
          <h2 className="text-xl font-bold mb-4">O que fazemos</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Integramos dados de mais de 17 fontes oficiais do governo brasileiro em uma única
            plataforma de inteligência. A partir dessa base, oferecemos pesquisa de preços com
            cálculo estatístico conforme IN SEGES 65/2021, geração assistida de documentos
            licitatórios com fundamentação legal automática, e auditoria de conformidade
            contra a Lei 14.133/2021, LINDB e jurisprudência do TCU.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            O ATA360 opera como ferramenta de apoio à decisão. Cada sugestão é verificada
            por múltiplas camadas de auditoria antes de chegar ao servidor. A decisão final
            é sempre humana — conforme o Art. 20 da LINDB, que exige que decisões considerem
            consequências práticas.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Somos registrados no CNPJ 61.291.296/0001-31, CNAE 6202-3/00 (Desenvolvimento
            e licenciamento de programas de computador customizáveis), com sede em Minas Gerais.
            CATSER 27502 — Desenvolvimento de software.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">O que não somos</h2>
          <div className="space-y-3 mb-8">
            {O_QUE_NAO_SOMOS.map((item) => (
              <div key={item} className="flex gap-3 items-start">
                <span className="text-destructive mt-0.5 shrink-0 text-sm">&times;</span>
                <p className="text-sm text-muted-foreground">{item}</p>
              </div>
            ))}
          </div>
          <div className="rounded-lg border border-border bg-muted/20 p-6">
            <p className="font-semibold text-sm mb-2">Exclusividade Setor Público</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              O ATA360 atende exclusivamente entes públicos (CNPJ) e seus servidores (CPF
              vinculado). Essa restrição é deliberada: garante que os incentivos da plataforma
              estejam sempre alinhados com o interesse coletivo, sem conflitos com o lado da
              oferta nos processos licitatórios.
            </p>
          </div>
        </section>
      </div>

      {/* Base de dados em números */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-2">Base de dados em números</h2>
        <p className="text-sm text-muted-foreground mb-8">
          Indicadores reais da infraestrutura de dados integrada ao ATA360.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {INFRAESTRUTURA.map(({ indicador, descrição, categoria }) => (
            <div key={indicador} className="rounded-lg border border-border p-5">
              <p className="text-xs font-medium text-primary mb-1 uppercase tracking-wide">{categoria}</p>
              <p className="text-lg font-bold mb-2">{indicador}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{descrição}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Abordagem técnica — 2 colunas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-12 mb-16">
        <section>
          <h2 className="text-xl font-bold mb-4">Arquitetura de dados</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Os dados são processados em camadas: ingestão via APIs oficiais, normalização
            e catalogação (CATMAT/CATSER), armazenamento em bases distribuídas com replicação
            geográfica, e disponibilização ao servidor com latência inferior a 50ms.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            A pesquisa de preços utiliza a base unificada de 1.4M+ itens com cálculo
            estatístico padrão: média saneada, mediana, desvio padrão com correção de Bessel,
            coeficiente de variação e tratamento de outliers por IQR — tudo conforme a
            IN SEGES 65/2021.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Jurisprudências do TCU são indexadas por artigo, inciso e tema. Cada sugestão
            da plataforma pode ser rastreada até a fonte oficial que a fundamenta.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">IA com propósito</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            A inteligência artificial do ATA360 é especializada — treinada e calibrada
            exclusivamente para o contexto de contratações públicas brasileiras. Opera com
            múltiplas camadas de blindagem anti-alucinação, verificação cruzada contra fontes
            oficiais e auditoria automática de conformidade legal.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Documentos são gerados por motor determinístico — não por IA generativa. A IA
            atua nas camadas de sugestão e análise, sempre com revisão humana obrigatória
            antes da finalização.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            A classificação de risco segue as diretrizes do PL 2.338/2023 (Marco Regulatório
            da IA) e os princípios da PBIA 2024-2028 (Plano Brasileiro de Inteligência
            Artificial), com Avaliação de Impacto Algorítmico (AIA) documentada.
          </p>
        </section>
      </div>

      {/* Compromissos ODS */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-2">Compromissos com os ODS</h2>
        <p className="text-sm text-muted-foreground mb-8">
          A ATA360 alinha sua atuação aos Objetivos de Desenvolvimento Sustentável da ONU
          (Agenda 2030), contribuindo diretamente para a modernização e a integridade das
          contratações públicas brasileiras.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {COMPROMISSOS_ODS.map(({ ods, título, cor, descrição }) => (
            <div key={ods} className="rounded-lg border border-border overflow-hidden">
              <div className={`${cor} px-5 py-3 flex items-center gap-3`}>
                <span className="text-white font-bold text-sm">{ods}</span>
                <span className="text-white/90 text-sm">{título}</span>
              </div>
              <div className="p-5">
                <p className="text-xs text-muted-foreground leading-relaxed">{descrição}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="rounded-lg border border-border bg-muted/20 p-8 text-center">
        <h2 className="text-xl font-bold mb-3">Conheça a plataforma</h2>
        <p className="text-sm text-muted-foreground mb-6 max-w-lg mx-auto">
          Solicite uma demonstração e veja como a infraestrutura do ATA360 pode
          transformar a gestão de contratações do seu órgão.
        </p>
        <Link
          href={'/contato' as Route}
          className="inline-block rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Solicitar Demonstração
        </Link>
      </div>
    </article>
  )
}
