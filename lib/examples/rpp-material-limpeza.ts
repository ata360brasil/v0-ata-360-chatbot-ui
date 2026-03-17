// Exemplo de RPP gerado pelo ATA360
// Solicitação: "Gere RPP para materiais de limpeza diversos"

import type { RPPData } from "@/components/artifacts/rpp-document";

export const rppMaterialLimpezaData: RPPData = {
  // Identificação
  docNumero: "RPP-PMLS-2026-0001",
  processoReferencia: "REF. PCA 2026 — Item 015",
  versao: "1.0",
  data: "17/03/2026",

  // Ente
  enteNome: "PREFEITURA MUNICIPAL DE LAGOA SANTA",
  secretaria: "Secretaria Municipal de Administração",
  departamento: "Departamento de Compras e Licitações",

  // Objeto
  objetoDescricao:
    "Levantamento referencial de preços para aquisição de materiais de limpeza e higienização destinados às unidades administrativas da Prefeitura Municipal de Lagoa Santa, incluindo detergentes, desinfetantes, sacos de lixo, papel toalha e álcool em gel.",
  finalidade:
    "Subsidiar a elaboração do Plano de Contratações Anual (PCA) 2026 e fornecer estimativa de valores para instrução de futuro processo licitatório de aquisição de materiais de limpeza.",
  tipoObjeto: "material" as const,
  areaDemandante: "Departamento de Serviços Gerais",

  // Itens
  itens: [
    {
      numero: 1,
      catmat: "234567",
      pdm: "BR0467890",
      descricao: "Detergente líquido neutro, 500ml, biodegradável, registro ANVISA",
      fonteNome: "PNCP — PE 023/2025 Pref. Belo Horizonte",
      fonteLink: "https://pncp.gov.br/app/editais/12345678",
      embalagem: "CX c/ 24 un",
      precoUnitario: 3.49,
      quantidade: 200,
    },
    {
      numero: 2,
      catmat: "345678",
      pdm: "BR0467891",
      descricao: "Desinfetante líquido, lavanda, 2 litros, registro ANVISA",
      fonteNome: "PNCP — PE 045/2025 Pref. Contagem",
      fonteLink: "https://pncp.gov.br/app/editais/23456789",
      embalagem: "CX c/ 6 un",
      precoUnitario: 8.75,
      quantidade: 100,
    },
    {
      numero: 3,
      catmat: "234568",
      pdm: "BR0467892",
      descricao: "Saco de lixo descartável 100L, cor preta, PEAD, pacote c/ 100 unidades",
      fonteNome: "Compras.gov.br — ARP 012/2025",
      fonteLink: "https://compras.gov.br/ata/registro/012-2025",
      embalagem: "PCT c/ 100",
      precoUnitario: 89.9,
      quantidade: 50,
    },
    {
      numero: 4,
      catmat: "456789",
      pdm: "BR0467893",
      descricao: "Papel toalha interfolhado, folha simples, 23x21cm, branco, pacote c/ 1000 folhas",
      fonteNome: "PNCP — PE 067/2025 Pref. Santa Luzia",
      fonteLink: "https://pncp.gov.br/app/editais/34567890",
      embalagem: "FD c/ 2000",
      precoUnitario: 6.2,
      quantidade: 300,
    },
    {
      numero: 5,
      catmat: "567890",
      pdm: "BR0467894",
      descricao: "Álcool em gel 70%, 500ml, com registro ANVISA, pump",
      fonteNome: "Banco de Preços — Média Nacional 2025",
      fonteLink: "https://www.bancodeprecos.com.br/consulta/567890",
      embalagem: "CX c/ 12 un",
      precoUnitario: 12.5,
      quantidade: 150,
    },
  ],

  // Metodologia
  metodologia:
    "Consulta direta às bases oficiais PNCP e Compras.gov.br, priorizando contratações realizadas nos últimos 180 dias, em âmbito municipal e estadual. Preços foram coletados de atas de registro de preços vigentes e resultados de pregões eletrônicos homologados. Utilizou-se a média aritmética simples dos preços encontrados, desconsiderados os valores discrepantes (outliers) conforme critério de ±2 desvios-padrão da média.",
  periodoReferencia: "Setembro/2025 a Março/2026 (180 dias)",

  // Observação
  observacaoFinal:
    "Os preços apresentados refletem valores praticados no mercado público brasileiro no período de referência indicado. Recomenda-se atualização dos valores no momento da instrução processual formal, considerando possíveis variações de mercado. Os itens 1 e 2 (detergente e desinfetante) apresentam alta disponibilidade de fornecedores e baixa variação de preço. O item 3 (saco de lixo 100L) apresentou maior variação entre fontes, recomendando-se atenção especial na especificação técnica para garantir qualidade do material (espessura mínima de 8 micras). Todos os itens possuem código CATMAT válido e podem ser vinculados diretamente ao PCA 2026.",

  // Elaborador
  elaboradorNome: "Carlos Alberto Ferreira",
  elaboradorSetor: "Departamento de Compras e Licitações",

  // Rastreabilidade
  rastreabilidadeId: "RPP-2026-0001-A3F8",
  hashDocumento: "sha256:7b4e2f...a9c1d3",
  dataGeracao: "17/03/2026",
  horaGeracao: "14:32:18 (UTC-3)",
};
