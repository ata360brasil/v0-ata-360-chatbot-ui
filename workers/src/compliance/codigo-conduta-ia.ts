/**
 * ATA360 — Código de Conduta de Inteligência Artificial
 *
 * Documento público derivado das ATA360_SYSTEM_RULES (chat-guard.ts).
 * Pode ser publicado nos artefatos e no site institucional.
 *
 * Alinhamento:
 * - PBIA 2024-2028 (Resolução CCT nº 4/2024)
 * - PL 2.338/2023 (Marco Legal da IA) — Art. 7º, 14, 16, 29
 * - LGPD (Lei 13.709/2018) — Arts. 18, 20
 * - UNESCO Recommendation on Ethics of AI (2021)
 * - Lei 14.133/2021 — Art. 11, IV (governança)
 * - LINDB (Lei 13.655/2018) — Arts. 20, 22, 28
 * - CGU Portaria 226/2025 — Programa de Integridade
 *
 * @see chat-guard.ts — ATA360_SYSTEM_RULES (versão interna)
 * @see configs/documentos-config.yaml — AIA (Avaliação de Impacto Algorítmico)
 * @see DOCUMENTACAO.md — Seção 9
 */

// ─── Código de Conduta IA — Versão Publicável ────────────────────────────────

export const CODIGO_CONDUTA_IA = {
  titulo: 'Código de Conduta de Inteligência Artificial — ATA360',
  versao: '1.0',
  data: '2026-02-10',
  classificacao: 'PÚBLICO',

  preambulo: `O ATA360 é um sistema de inteligência artificial aplicado a contratações públicas
brasileiras, classificado como de ALTO RISCO conforme o PL 2.338/2023, por operar no contexto
da administração pública com potencial impacto em decisões governamentais. Este Código de Conduta
estabelece os princípios, compromissos e limites éticos que regem o uso de IA no sistema,
em conformidade com o Plano Brasileiro de Inteligência Artificial 2024-2028 (PBIA),
a Lei 14.133/2021 e a legislação brasileira aplicável.`,

  principios: [
    {
      numero: 1,
      titulo: 'Decisão Humana é Soberana',
      descricao: `Toda decisão administrativa no ATA360 é tomada exclusivamente por servidor
público ou gestor humano. O sistema orienta, documenta e alerta, mas NUNCA decide
autonomamente. Existem pontos de parada humana obrigatórios em todo fluxo de trabalho.`,
      base_legal: 'PL 2.338/2023, Art. 16 | Lei 14.133/2021, Art. 11 | LINDB Art. 28',
    },
    {
      numero: 2,
      titulo: 'Dados Oficiais, Nunca Inventados',
      descricao: `O ATA360 utiliza exclusivamente dados de fontes oficiais governamentais:
PNCP, IBGE, SERPRO, TCU, BCB, Portal da Transparência e demais APIs governamentais.
Nenhum dado é inventado, estimado sem fonte ou extrapolado sem fundamentação.`,
      base_legal: 'LINDB Art. 20 | Lei 14.133/2021, Art. 23',
    },
    {
      numero: 3,
      titulo: 'Imparcialidade e Não Discriminação',
      descricao: `O sistema é um intermediador neutro. Não favorece fornecedores,
não direciona licitações, não cria restrições indevidas. Toda orientação
é fundamentada em legislação vigente e dados públicos verificáveis.`,
      base_legal: 'PL 2.338/2023, Art. 4º | CF/88, Art. 37 | Lei 14.133/2021, Art. 5º',
    },
    {
      numero: 4,
      titulo: 'Transparência e Explicabilidade',
      descricao: `Todos os artefatos gerados contêm fundamentação legal explícita,
referências a dados oficiais com links rastreáveis e identificação clara de que
foram elaborados com auxílio de ferramenta tecnológica. O usuário pode solicitar
explicação sobre qualquer recomendação ou resultado via canal de ouvidoria.`,
      base_legal: 'PL 2.338/2023, Art. 7º | LGPD Art. 20 | Lei 14.133/2021, Art. 11, IV',
    },
    {
      numero: 5,
      titulo: 'Proteção de Dados e Privacidade',
      descricao: `O sistema opera com isolamento multi-tenant rigoroso.
Dados de um ente público NUNCA são acessíveis por outro. Dados pessoais
são tratados conforme a LGPD, com base legal definida, anonimização quando
aplicável e respeito integral aos direitos do titular.`,
      base_legal: 'LGPD Arts. 7º, 18 e 20 | PL 2.338/2023, Art. 29, V',
    },
    {
      numero: 6,
      titulo: 'Rastreabilidade e Auditabilidade',
      descricao: `Cada ação no sistema gera registro com hash SHA-256, timestamp,
identificação do agente humano e versão dos dados utilizados.
Todo o ciclo de vida do documento é rastreável desde a criação até a assinatura.`,
      base_legal: 'PL 2.338/2023, Art. 17 | LINDB Art. 30',
    },
    {
      numero: 7,
      titulo: 'Prevenção Proativa',
      descricao: `O sistema atua preventivamente: alerta sobre riscos, prazos vencendo,
irregularidades potenciais e não conformidades ANTES que se materializem.
Instrui procedimentos preventivos e sugere correções fundamentadas.`,
      base_legal: 'LINDB Art. 22 | Lei 14.133/2021, Art. 169',
    },
    {
      numero: 8,
      titulo: 'Ética e Anti-Fraude',
      descricao: `O sistema detecta e recusa orientar sobre práticas irregulares:
direcionamento de licitação, conluio, fracionamento ilícito, superfaturamento,
falsificação de documentos ou qualquer conduta que viole a lei.
Irregularidades detectadas geram alertas com fundamentação legal.`,
      base_legal: 'Lei 12.846/2013 | Lei 8.429/1992 | CP Art. 337-L | CGU Portaria 226/2025',
    },
    {
      numero: 9,
      titulo: 'Respeito ao Contexto Local',
      descricao: `O sistema considera as dificuldades reais do gestor público:
orçamento disponível, estrutura de pessoal, porte do ente, IDH municipal
e demais fatores que influenciam a capacidade operacional do órgão.
Não se prende a tecnicidades excessivas que ignorem a realidade local.`,
      base_legal: 'LINDB Art. 22 | LINDB Art. 28',
    },
    {
      numero: 10,
      titulo: 'Segurança e Proteção da Propriedade Intelectual',
      descricao: `A arquitetura interna do sistema (modelos, algoritmos, configurações,
pesos, fórmulas) é protegida como segredo industrial. Os artefatos gerados mostram
O QUE foi decidido e COM QUAL FUNDAMENTAÇÃO, nunca COMO o sistema opera internamente.
Isso protege tanto a propriedade intelectual quanto a integridade do sistema.`,
      base_legal: 'Lei 9.279/1996 | Lei 9.609/1998 | LGPD | Marco Civil da Internet',
    },
  ],

  compromissos_pbia: {
    titulo: 'Compromissos com o PBIA 2024-2028',
    itens: [
      'Manutenção de Avaliação de Impacto Algorítmico (AIA) atualizada anualmente',
      'Publicação deste Código de Conduta no site institucional',
      'Canal de explicação e contestação acessível via ouvidoria',
      'Revisão humana obrigatória em todas as decisões assistidas por IA',
      'Registro e auditabilidade de todas as interações com IA',
      'Treinamento contínuo de equipe em ética e governança de IA',
      'Cooperação com órgãos reguladores e de controle',
      'Alinhamento com ODS/ONU (5, 9, 10, 12, 16, 17)',
    ],
  },

  canal_explicacao: {
    titulo: 'Direito à Explicação',
    descricao: `Qualquer pessoa afetada por decisão assistida pelo ATA360 tem direito
a solicitar explicação sobre os critérios e dados utilizados na recomendação.
Solicitações são atendidas via canal de ouvidoria com prazo máximo de 15 dias.`,
    tipo_manifestacao: 'pedido_explicacao',
    prazo_dias: 15,
    base_legal: 'PL 2.338/2023, Art. 7º | LGPD Art. 20',
  },

  vigencia: {
    inicio: '2026-02-10',
    revisao_proxima: '2027-02-10',
    periodicidade: 'anual',
    responsavel: 'Comitê de Ética e Governança ATA360',
  },
}

// ─── Função para gerar versão texto (para inserir em artefatos/PDFs) ────────

export function gerarCodigoCondutaTexto(): string {
  const c = CODIGO_CONDUTA_IA
  const linhas: string[] = []

  linhas.push(`${c.titulo}`)
  linhas.push(`Versão ${c.versao} — ${c.data}`)
  linhas.push('')
  linhas.push(c.preambulo.replace(/\n/g, ' ').trim())
  linhas.push('')

  for (const p of c.principios) {
    linhas.push(`${p.numero}. ${p.titulo}`)
    linhas.push(p.descricao.replace(/\n/g, ' ').trim())
    linhas.push(`Base legal: ${p.base_legal}`)
    linhas.push('')
  }

  linhas.push('COMPROMISSOS COM O PBIA 2024-2028:')
  for (const item of c.compromissos_pbia.itens) {
    linhas.push(`• ${item}`)
  }
  linhas.push('')

  linhas.push(`DIREITO À EXPLICAÇÃO: ${c.canal_explicacao.descricao.replace(/\n/g, ' ').trim()}`)
  linhas.push(`Prazo: ${c.canal_explicacao.prazo_dias} dias | ${c.canal_explicacao.base_legal}`)

  return linhas.join('\n')
}
