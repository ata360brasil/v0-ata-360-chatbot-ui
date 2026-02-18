import type { Metadata } from 'next'
import type { Route } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Quem Somos — Infraestrutura de Dados Oficiais',
  description: 'A ATA360 é uma empresa brasileira de tecnologia especializada em inteligência para contratações públicas. Conheça a infraestrutura, os números é a base de dados que sustentam a plataforma.',
}

const INFRAESTRUTURA = [
  { indicador: '17+ fontes oficiais', descrição: 'PNCP, IBGE, TCU, CGU, BCB, Portal da Transparência, Compras.gov.br, TransfereGov, FNDE, FNS, SICONFI, Camara, Senado e outras', categoria: 'Dados' },
  { indicador: '110+ endpoints', descrição: 'APIs governamentais integradas para consulta em tempo real de preços, contratos, atas, órgãos, emendas e indicadores', categoria: 'APIs' },
  { indicador: '1.4M+ itens', descrição: 'Atas de registro de preços e contratos unificados em base analítica para pesquisa estatística conforme IN SEGES 65/2021', categoria: 'Precos' },
  { indicador: '560+ jurisprudências', descrição: 'Acórdãos do TCU e tribunais estaduais indexados e vinculados a artigos específicos da Lei 14.133/2021', categoria: 'Juridico' },
  { indicador: '337K+ itens CATMAT', descrição: 'Catálogo de materiais do governo federal para padronização de descrição de objetos', categoria: 'Catálogos' },
  { indicador: '35K+ itens CATSER', descrição: 'Catálogo de serviços do governo federal para classificação de contratações', categoria: 'Catálogos' },
  { indicador: '40+ tipos de documentos', descrição: 'PCA, DFD, ETP, TR, PP, JCD, ARP e outros artefatos licitatórios gerados via motor deterministic', categoria: 'Artefatos' },
  { indicador: '9 series BCB', descrição: 'IPCA, IGP-M, Selic, dólar e demais índices econômicos atualizados automáticamente via API do Banco Central', categoria: 'Índices' },
] as const

const O_QUE_NAO_SOMOS = [
  'Não somos IA genérica adaptada ao setor público.',
  'Não vendemos para fornecedores ou licitantes.',
  'Não sugerimos marcas, fornecedores ou direcionar licitações.',
  'Não inventamos dados — toda informação vem de fonte oficial.',
  'Não substituímos a decisão do servidor — ela é soberana.',
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
            O ATA360 opera como ferramenta de apoio a decisão. Cada sugestão e verificada
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
            Os dados sao processados em camadas: ingestão via APIs oficiais, normalizacao
            e catalogação (CATMAT/CATSER), armazenamento em bases distribuidas com replicação
            geográfica, e disponibilização ao servidor com latência inferior a 50ms.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            A pesquisa de preços utiliza a base unificada de 1.4M+ itens com cálculo
            estatístico padrão: média saneada, mediana, desvio padrão com correção de Bessel,
            coeficiente de variação e tratamento de outliers por IQR — tudo conforme a
            IN SEGES 65/2021.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Jurisprudências do TCU sao indexadas por artigo, inciso e tema. Cada sugestão
            da plataforma pode ser rastreada até a fonte oficial que a fundamenta.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">IA com propósito</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            A inteligência artificial do ATA360 e especializada — treinada e calibrada
            exclusivamente para o contexto de contratações públicas brasileiras. Opera com
            múltiplas camadas de blindagem anti-alucinação, verificação cruzada contra fontes
            oficiais e auditoria automática de conformidade legal.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Documentos sao gerados por motor determinístico — não por IA generativa. A IA
            atua nas camadas de sugestão e análise, sempre com revisao humana obrigatória
            antes da finalização.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            A classificação de risco segue as diretrizes do PL 2.338/2023 (Marco Regulatorio
            da IA) e os princípios da PBIA 2024-2028 (Plano Brasileiro de Inteligência
            Artificial), com Avaliação de Impacto Algoritmico (AIA) documentada.
          </p>
        </section>
      </div>

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
