import type { Metadata } from 'next'
import Link from 'next/link'
import type { Route } from 'next'

export const metadata: Metadata = {
  title: 'Humano + I.A. — ATA360',
  description: 'Como o ATA360 combina inteligência artificial com decisão humana soberana. Zero alucinação, dados oficiais, soberania nacional e LGPD.',
}

const FONTES_OFICIAIS = [
  'PNCP (Portal Nacional de Contratações Públicas)',
  'Compras.gov.br / Painel de Precos',
  'IBGE (dados municipais, demograficos, econômicos)',
  'TCU (jurisprudência e acórdãos)',
  'CGU (Portal da Transparência)',
  'BCB (índices econômicos, IPCA, SELIC)',
  'TransfereGov (convenios e transferências)',
  'FNDE, FNS, SICONFI',
  'Camara dos Deputados e Senado Federal',
  'SERPRO (consultas cadastrais)',
] as const

const CAMADAS_ANTI_ALUCINACAO = [
  'Motor determinístico para geração de documentos (não é IA generativa pura)',
  'Validacao cruzada de referências legais antes da exibicao',
  'Auditoria automática de conformidade em cada campo',
  'Trilha de auditoria imutavel com hash SHA-256',
  'Se a fonte oficial não confirma, o sistema não sugere',
] as const

export default function HumanoIaPage() {
  return (
    <article className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
      {/* Header */}
      <header className="max-w-3xl mb-16">
        <p className="text-sm font-medium text-primary mb-4 tracking-wide uppercase">
          Humano + I.A.
        </p>
        <h1 className="text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-6">
          A inteligência por tras do ATA360
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          A decisão e sempre do servidor. A tecnologia existe para que essa decisão seja
          mais informada, mais fundamentada e mais segura.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-12">
        {/* Filosofia */}
        <section>
          <h2 className="text-xl font-bold mb-4">Decisão humana soberana</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            O Art. 20 da LINDB (Lei 13.655/2018) determina que decisões devem considerar
            consequências práticas. O ATA360 respeita esse princípio: a IA sugere,
            fundamenta e audita — mas quem decide e o servidor.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Revisao humana obrigatória em cada etapa. Nenhum documento e finalizado sem
            a aprovacao do agente responsável.
          </p>
        </section>

        {/* Como funciona */}
        <section>
          <h2 className="text-xl font-bold mb-4">Como funciona a IA do ATA360</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            O ATA360 não é um chat genérico. E uma inteligência especializada na legislação
            brasileira que consulta fontes oficiais antes de responder, fundamenta cada
            sugestão com artigo de lei, e gera documentos que herdam contexto uns dos outros.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Se não éncontra resposta verificável, avisa que não sabe. Zero alucinação por design.
          </p>
        </section>

        {/* Fontes */}
        <section>
          <h2 className="text-xl font-bold mb-4">17+ fontes oficiais do governo</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Sao 110+ endpoints de APIs governamentais consultados em tempo real.
            Nenhum dado de origem privada.
          </p>
          <ul className="space-y-2">
            {FONTES_OFICIAIS.map((fonte) => (
              <li key={fonte} className="text-sm text-muted-foreground flex gap-2">
                <span className="text-primary shrink-0">&bull;</span>
                {fonte}
              </li>
            ))}
          </ul>
        </section>

        {/* Anti-alucinação */}
        <section>
          <h2 className="text-xl font-bold mb-4">Anti-alucinação: múltiplas camadas</h2>
          <div className="space-y-3">
            {CAMADAS_ANTI_ALUCINACAO.map((camada, i) => (
              <div key={camada} className="rounded-lg border border-border p-4">
                <p className="text-sm text-muted-foreground flex gap-2">
                  <span className="text-primary font-bold shrink-0">{i + 1}.</span>
                  {camada}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Soberania */}
        <section>
          <h2 className="text-xl font-bold mb-4">Soberania de dados</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Quando um servidor usa IA genérica (ChatGPT, Gemini), envia dados do órgão
            para servidores nos EUA. O ATA360 processa tudo no Brasil:
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2"><span className="text-primary shrink-0">&bull;</span>Dados em território nacional</li>
            <li className="flex gap-2"><span className="text-primary shrink-0">&bull;</span>Conformidade total com LGPD (Lei 13.709/2018)</li>
            <li className="flex gap-2"><span className="text-primary shrink-0">&bull;</span>Isolamento multi-tenant com Row-Level Security</li>
            <li className="flex gap-2"><span className="text-primary shrink-0">&bull;</span>Criptografia em transito (TLS 1.3) e em repouso (AES-256)</li>
            <li className="flex gap-2"><span className="text-primary shrink-0">&bull;</span>Trilha de auditoria acessível para controle interno</li>
          </ul>
        </section>

        {/* Compliance */}
        <section>
          <h2 className="text-xl font-bold mb-4">Compliance e regulacao</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            O ATA360 foi projetado para operar dentro do marco regulatório brasileiro:
          </p>
          <div className="space-y-2">
            {[
              'Lei 14.133/2021 — Nova Lei de Licitacoes',
              'LGPD — Lei 13.709/2018',
              'LINDB — Lei 13.655/2018 (Arts. 20-23, 28, 30)',
              'Lei 12.846/2013 — Lei Anticorrupcao',
              'Lei 14.063/2020 — Assinatura Eletronica',
            ].map((lei) => (
              <div key={lei} className="rounded-lg border border-border p-3">
                <p className="text-sm text-muted-foreground">{lei}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* CTA */}
      <div className="mt-16 rounded-lg border border-border bg-muted/20 p-8 text-center">
        <h2 className="text-xl font-bold mb-3">Veja a diferenca na prática</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Teste o ATA360 por 14 dias. Exclusivo para órgãos públicos.
        </p>
        <Link
          href={'/solicitar-demonstracao' as Route}
          className="inline-block rounded-md bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Solicitar demonstração gratuita
        </Link>
      </div>
    </article>
  )
}
