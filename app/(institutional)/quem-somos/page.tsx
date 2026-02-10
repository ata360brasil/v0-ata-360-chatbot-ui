import type { Metadata } from 'next'
import type { Route } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Quem Somos — Infraestrutura de Dados Oficiais',
  description: 'A ATA360 e uma empresa brasileira de tecnologia especializada em inteligencia para contratacoes publicas. Conhega a infraestrutura, os numeros e a base de dados que sustentam a plataforma.',
}

const INFRAESTRUTURA = [
  { indicador: '17+ fontes oficiais', descricao: 'PNCP, IBGE, TCU, CGU, BCB, Portal da Transparencia, Compras.gov.br, TransfereGov, FNDE, FNS, SICONFI, Camara, Senado e outras', categoria: 'Dados' },
  { indicador: '110+ endpoints', descricao: 'APIs governamentais integradas para consulta em tempo real de precos, contratos, atas, orgaos, emendas e indicadores', categoria: 'APIs' },
  { indicador: '1.4M+ itens', descricao: 'Atas de registro de precos e contratos unificados em base analitica para pesquisa estatistica conforme IN SEGES 65/2021', categoria: 'Precos' },
  { indicador: '560+ jurisprudencias', descricao: 'Acordaos do TCU e tribunais estaduais indexados e vinculados a artigos especificos da Lei 14.133/2021', categoria: 'Juridico' },
  { indicador: '337K+ itens CATMAT', descricao: 'Catalogo de materiais do governo federal para padronizacao de descricao de objetos', categoria: 'Catalogos' },
  { indicador: '35K+ itens CATSER', descricao: 'Catalogo de servicos do governo federal para classificacao de contratacoes', categoria: 'Catalogos' },
  { indicador: '40+ tipos de documentos', descricao: 'PCA, DFD, ETP, TR, PP, JCD, ARP e outros artefatos licitatorios gerados via motor deterministic', categoria: 'Artefatos' },
  { indicador: '9 series BCB', descricao: 'IPCA, IGP-M, Selic, dolar e demais indices economicos atualizados automaticamente via API do Banco Central', categoria: 'Indices' },
] as const

const O_QUE_NAO_SOMOS = [
  'Nao somos IA generica adaptada ao setor publico.',
  'Nao vendemos para fornecedores ou licitantes.',
  'Nao sugerimos marcas, fornecedores ou direcionar licitacoes.',
  'Nao inventamos dados — toda informacao vem de fonte oficial.',
  'Nao substituimos a decisao do servidor — ela e soberana.',
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
          Infraestrutura de dados oficiais para compras publicas
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          A ATA360 e uma empresa brasileira de tecnologia, constituida como Empresa
          Simples de Inovacao (LC 182/2021), especializada exclusivamente em inteligencia
          para contratacoes publicas conforme a Lei 14.133/2021.
        </p>
      </header>

      {/* 2 colunas: apresentacao + identidade */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-12 mb-16">
        <section>
          <h2 className="text-xl font-bold mb-4">O que fazemos</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Integramos dados de mais de 17 fontes oficiais do governo brasileiro em uma unica
            plataforma de inteligencia. A partir dessa base, oferecemos pesquisa de precos com
            calculo estatistico conforme IN SEGES 65/2021, geracao assistida de documentos
            licitatorios com fundamentacao legal automatica, e auditoria de conformidade
            contra a Lei 14.133/2021, LINDB e jurisprudencia do TCU.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            O ATA360 opera como ferramenta de apoio a decisao. Cada sugestao e verificada
            por multiplas camadas de auditoria antes de chegar ao servidor. A decisao final
            e sempre humana — conforme o Art. 20 da LINDB, que exige que decisoes considerem
            consequencias praticas.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Somos registrados no CNPJ 61.291.296/0001-31, CNAE 6202-3/00 (Desenvolvimento
            e licenciamento de programas de computador customizaveis), com sede em Minas Gerais.
            CATSER 27502 — Desenvolvimento de software.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">O que nao somos</h2>
          <div className="space-y-3 mb-8">
            {O_QUE_NAO_SOMOS.map((item) => (
              <div key={item} className="flex gap-3 items-start">
                <span className="text-destructive mt-0.5 shrink-0 text-sm">&times;</span>
                <p className="text-sm text-muted-foreground">{item}</p>
              </div>
            ))}
          </div>
          <div className="rounded-lg border border-border bg-muted/20 p-6">
            <p className="font-semibold text-sm mb-2">Exclusividade Setor Publico</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              O ATA360 atende exclusivamente entes publicos (CNPJ) e seus servidores (CPF
              vinculado). Essa restricao e deliberada: garante que os incentivos da plataforma
              estejam sempre alinhados com o interesse coletivo, sem conflitos com o lado da
              oferta nos processos licitatorios.
            </p>
          </div>
        </section>
      </div>

      {/* Base de dados em numeros */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-2">Base de dados em numeros</h2>
        <p className="text-sm text-muted-foreground mb-8">
          Indicadores reais da infraestrutura de dados integrada ao ATA360.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {INFRAESTRUTURA.map(({ indicador, descricao, categoria }) => (
            <div key={indicador} className="rounded-lg border border-border p-5">
              <p className="text-xs font-medium text-primary mb-1 uppercase tracking-wide">{categoria}</p>
              <p className="text-lg font-bold mb-2">{indicador}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{descricao}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Abordagem tecnica — 2 colunas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-12 mb-16">
        <section>
          <h2 className="text-xl font-bold mb-4">Arquitetura de dados</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Os dados sao processados em camadas: ingestao via APIs oficiais, normalizacao
            e catalogacao (CATMAT/CATSER), armazenamento em bases distribuidas com replicacao
            geografica, e disponibilizacao ao servidor com latencia inferior a 50ms.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            A pesquisa de precos utiliza a base unificada de 1.4M+ itens com calculo
            estatistico padrao: media saneada, mediana, desvio padrao com correcao de Bessel,
            coeficiente de variacao e tratamento de outliers por IQR — tudo conforme a
            IN SEGES 65/2021.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Jurisprudencias do TCU sao indexadas por artigo, inciso e tema. Cada sugestao
            da plataforma pode ser rastreada ate a fonte oficial que a fundamenta.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">IA com proposito</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            A inteligencia artificial do ATA360 e especializada — treinada e calibrada
            exclusivamente para o contexto de contratacoes publicas brasileiras. Opera com
            multiplas camadas de blindagem anti-alucinacao, verificacao cruzada contra fontes
            oficiais e auditoria automatica de conformidade legal.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Documentos sao gerados por motor deterministico — nao por IA generativa. A IA
            atua nas camadas de sugestao e analise, sempre com revisao humana obrigatoria
            antes da finalizacao.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            A classificacao de risco segue as diretrizes do PL 2.338/2023 (Marco Regulatorio
            da IA) e os principios da PBIA 2024-2028 (Plano Brasileiro de Inteligencia
            Artificial), com Avaliacao de Impacto Algoritmico (AIA) documentada.
          </p>
        </section>
      </div>

      {/* CTA */}
      <div className="rounded-lg border border-border bg-muted/20 p-8 text-center">
        <h2 className="text-xl font-bold mb-3">Conhega a plataforma</h2>
        <p className="text-sm text-muted-foreground mb-6 max-w-lg mx-auto">
          Solicite uma demonstracao e veja como a infraestrutura do ATA360 pode
          transformar a gestao de contratacoes do seu orgao.
        </p>
        <Link
          href={'/contato' as Route}
          className="inline-block rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Solicitar Demonstracao
        </Link>
      </div>
    </article>
  )
}
