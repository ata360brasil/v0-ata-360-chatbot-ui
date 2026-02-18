import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'LGPD — Seus Direitos',
  description: 'Seus direitos como titular de dados pessoais conforme a LGPD (Lei 13.709/2018) na plataforma ATA360.',
}

/**
 * LGPD — Direitos do Titular — ATA360
 *
 * Conforme LGPD Art. 18 e diretrizes da ANPD.
 * NUNCA citar fornecedores, parceiros ou tecnologias internas.
 */
export default function LGPDPage() {
  return (
    <article className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>LGPD — Seus Direitos como Titular de Dados</h1>
      <p className="text-sm text-muted-foreground">
        Ultima atualizacao: 10 de fevereiro de 2026 &bull; Versao 1.0
      </p>

      <hr />

      <p>
        A ATA360 respeita integralmente a <strong>Lei Geral de Protecao de Dados</strong> (Lei
        13.709/2018 — LGPD) e garante que voce, como titular de dados pessoais, possa exercer
        todos os seus direitos de forma simples, transparente e gratuita.
      </p>

      {/* 1 */}
      <h2>1. Seus Direitos (Art. 18 da LGPD)</h2>

      <div className="space-y-6 not-prose">
        {DIREITOS_TITULAR.map((direito) => (
          <div key={direito.inciso} className="rounded-lg border border-border p-5 bg-card">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold">
                {direito.inciso}
              </span>
              <div>
                <h3 className="font-semibold text-foreground text-base">{direito.nome}</h3>
                <p className="text-sm text-muted-foreground mt-1">{direito.descricao}</p>
                <p className="text-xs text-muted-foreground/70 mt-2">
                  Base legal: Art. 18, {direito.inciso} da LGPD
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 2 */}
      <h2>2. Como Exercer Seus Direitos</h2>
      <p>
        Para exercer qualquer direito listado acima, entre em contato conosco:
      </p>
      <div className="rounded-lg border border-border p-6 bg-muted/20">
        <p>
          <strong>E-mail:</strong>{' '}
          <a href="mailto:suporte@ata360.com.br">suporte@ata360.com.br</a>
        </p>
        <p>
          <strong>Site:</strong>{' '}
          <a href="https://www.ata360.com.br" target="_blank" rel="noopener noreferrer">
            www.ata360.com.br
          </a>{' '}
          (formulario &quot;Fale Conosco&quot;)
        </p>
      </div>
      <p className="text-sm text-muted-foreground">
        Sua solicitacao sera respondida no prazo de <strong>15 dias</strong>, conforme
        Art. 18, &sect;5 da LGPD. Em caso de impossibilidade tecnica, informaremos o
        prazo necessario e a justificativa.
      </p>

      {/* 3 */}
      <h2>3. Dados que Tratamos</h2>
      <table>
        <thead>
          <tr>
            <th>Dado</th>
            <th>Finalidade</th>
            <th>Base Legal</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Nome, CPF, cargo</td>
            <td>Identificacao e autenticação</td>
            <td>Execucao de contrato (Art. 7, V)</td>
          </tr>
          <tr>
            <td>Orgao de vinculacao (CNPJ)</td>
            <td>Isolamento multi-tenant</td>
            <td>Execucao de contrato (Art. 7, V)</td>
          </tr>
          <tr>
            <td>Logs de navegacao</td>
            <td>Seguranca e auditoria</td>
            <td>Interesse legitimo (Art. 7, IX)</td>
          </tr>
          <tr>
            <td>Mensagens no chat</td>
            <td>Prestação do servico</td>
            <td>Execucao de contrato (Art. 7, V)</td>
          </tr>
          <tr>
            <td>Documentos gerados</td>
            <td>Objeto principal do servico</td>
            <td>Execucao de contrato (Art. 7, V)</td>
          </tr>
          <tr>
            <td>Metricas de uso</td>
            <td>Melhoria da plataforma</td>
            <td>Consentimento (Art. 7, I)</td>
          </tr>
          <tr>
            <td>Dados processados por IA</td>
            <td>Geracao e auditoria de documentos</td>
            <td>Consentimento (Art. 7, I)</td>
          </tr>
        </tbody>
      </table>

      {/* 4 */}
      <h2>4. Consentimento Granular</h2>
      <p>
        Voce controla quais tipos de processamento sao autorizados. A qualquer momento,
        pode modificar suas preferencias:
      </p>
      <table>
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Descricao</th>
            <th>Obrigatorio?</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Essencial</strong></td>
            <td>Funcionamento basico da plataforma</td>
            <td>Sim (Art. 7, V)</td>
          </tr>
          <tr>
            <td><strong>Analytics</strong></td>
            <td>Metricas de uso e desempenho</td>
            <td>Nao</td>
          </tr>
          <tr>
            <td><strong>Inteligencia Artificial</strong></td>
            <td>Processamento por modelos de IA</td>
            <td>Nao</td>
          </tr>
          <tr>
            <td><strong>Comunicacao</strong></td>
            <td>Notificacoes e e-mails informativos</td>
            <td>Nao</td>
          </tr>
          <tr>
            <td><strong>Terceiros</strong></td>
            <td>Compartilhamento com orgaos de controle</td>
            <td>Nao (exceto obrigação legal)</td>
          </tr>
        </tbody>
      </table>

      {/* 5 */}
      <h2>5. Anonimizacao de Dados</h2>
      <p>
        Aplicamos tecnicas de anonimização e pseudonimizacao em conformidade com as
        melhores praticas internacionais:
      </p>
      <ul>
        <li>CPF: mascaramento parcial (ex.: 123.***.***-00)</li>
        <li>CNPJ: mascaramento de digitos centrais</li>
        <li>E-mail: mascaramento do endereco local (ex.: us***@dominio.com)</li>
        <li>Telefone: mascaramento de digitos intermediários</li>
        <li>Nome: preservacao do primeiro nome, iniciais dos demais</li>
      </ul>
      <p>
        Dados anonimizados nao sao considerados dados pessoais (Art. 12, LGPD) e podem
        ser utilizados para fins estatisticos e de melhoria da plataforma.
      </p>

      {/* 6 */}
      <h2>6. Portabilidade de Dados</h2>
      <p>
        Voce tem direito a receber seus dados pessoais em formato estruturado, de uso
        corrente e leitura automatizada (JSON), conforme Art. 18, V da LGPD. A solicitacao
        de portabilidade sera atendida no prazo de 15 dias.
      </p>
      <p>
        <strong>Dados portaveis:</strong> cadastro, historico de conversas, documentos gerados,
        preferencias e configuracoes.
      </p>
      <p>
        <strong>Dados nao portaveis:</strong> trilhas de auditoria (obrigação legal, Art. 16, I)
        e dados anonimizados (Art. 12).
      </p>

      {/* 7 */}
      <h2>7. Eliminacao de Dados</h2>
      <p>
        Voce pode solicitar a eliminacao dos seus dados pessoais a qualquer momento (Art. 18, VI).
        A eliminacao sera realizada no prazo de 15 dias, <strong>exceto</strong> nas seguintes hipoteses:
      </p>
      <ul>
        <li>
          <strong>Obrigacao legal:</strong> trilhas de auditoria sao mantidas por 5 anos
          conforme Lei 14.133/2021 (Art. 16, I da LGPD).
        </li>
        <li>
          <strong>Exercicio regular de direitos:</strong> dados necessarios para defesa em
          processos judiciais, administrativos ou arbitrais (Art. 16, II).
        </li>
        <li>
          <strong>Interesse legitimo:</strong> dados anonimizados para fins estatisticos
          (Art. 16, IV).
        </li>
      </ul>

      {/* 8 */}
      <h2>8. Autoridade Nacional de Protecao de Dados (ANPD)</h2>
      <p>
        Caso considere que o tratamento dos seus dados pessoais viola a LGPD, voce tem
        direito de peticionar perante a <strong>Autoridade Nacional de Protecao de Dados</strong>:
      </p>
      <div className="rounded-lg border border-border p-6 bg-muted/20">
        <p><strong>ANPD — Autoridade Nacional de Protecao de Dados</strong></p>
        <p>Site: <a href="https://www.gov.br/anpd" target="_blank" rel="noopener noreferrer">www.gov.br/anpd</a></p>
        <p>Canal de atendimento: <a href="https://www.gov.br/anpd/pt-br/canais_atendimento" target="_blank" rel="noopener noreferrer">gov.br/anpd/canais_atendimento</a></p>
      </div>

      {/* 9 */}
      <h2>9. Encarregado de Dados (DPO)</h2>
      <div className="rounded-lg border border-border p-6 bg-muted/20">
        <p className="font-semibold">ATA360 TECNOLOGIA LTDA</p>
        <p>CNPJ: 61.291.296/0001-31</p>
        <p>
          E-mail do Encarregado: <a href="mailto:suporte@ata360.com.br">suporte@ata360.com.br</a>
        </p>
        <p>
          Site: <a href="https://www.ata360.com.br" target="_blank" rel="noopener noreferrer">www.ata360.com.br</a>
        </p>
      </div>
    </article>
  )
}

// ─── Dados Estruturados dos Direitos do Titular ────────────────────────────

const DIREITOS_TITULAR = [
  {
    inciso: 'II',
    nome: 'Acesso aos dados',
    descricao:
      'Voce pode solicitar acesso completo a todos os dados pessoais que a ATA360 possui sobre voce, incluindo informacoes sobre tratamento realizado.',
  },
  {
    inciso: 'III',
    nome: 'Correcao de dados',
    descricao:
      'Voce pode solicitar a correcao de dados pessoais incompletos, inexatos ou desatualizados.',
  },
  {
    inciso: 'IV',
    nome: 'Anonimizacao, bloqueio ou eliminacao',
    descricao:
      'Voce pode solicitar a anonimização, bloqueio ou eliminacao de dados desnecessarios, excessivos ou tratados em desconformidade com a LGPD.',
  },
  {
    inciso: 'V',
    nome: 'Portabilidade',
    descricao:
      'Voce pode solicitar a portabilidade dos seus dados a outro fornecedor de servico, em formato estruturado e de uso corrente (JSON).',
  },
  {
    inciso: 'VI',
    nome: 'Eliminacao de dados',
    descricao:
      'Voce pode solicitar a eliminacao dos dados pessoais tratados com base no consentimento, exceto nas hipoteses de conservacao previstas no Art. 16.',
  },
  {
    inciso: 'VII',
    nome: 'Informacao sobre compartilhamento',
    descricao:
      'Voce tem direito a ser informado sobre as entidades publicas e privadas com as quais a ATA360 realizou compartilhamento de dados.',
  },
  {
    inciso: 'IX',
    nome: 'Revogacao do consentimento',
    descricao:
      'Voce pode revogar seu consentimento a qualquer momento, de forma gratuita e facilitada. A revogacao nao afeta a licitude do tratamento realizado anteriormente.',
  },
] as const
