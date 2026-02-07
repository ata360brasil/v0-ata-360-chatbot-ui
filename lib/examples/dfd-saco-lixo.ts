// Exemplo de DFD gerado pelo chat LLM
// Solicitação: "Gere DFD compra saco de lixo descartável 100l, 100 unidades"

export const dfdSacoLixoData = {
  // Identificação
  docNumero: "DFD-PMLS-2026-0002",
  processoNumero: "PAD 002/2026",
  versao: "1.0",
  data: "04/02/2026",

  // Ente
  enteNome: "PREFEITURA MUNICIPAL DE LAGOA SANTA",
  secretaria: "Secretaria Municipal de Administração",
  departamento: "Departamento de Serviços Gerais",

  // Demandante
  unidadeRequisitante: "Departamento de Serviços Gerais",
  responsavelNome: "Carlos Alberto Ferreira",
  responsavelCargo: "Coordenador de Serviços Gerais",
  responsavelMatricula: "54321",
  responsavelEmail: "servicos.gerais@lagoasanta.mg.gov.br",

  // Objeto
  objetoDescricao: "Aquisição de sacos de lixo descartáveis com capacidade de 100 litros, na cor preta, confeccionados em polietileno de alta densidade (PEAD), para atendimento às necessidades de coleta e acondicionamento de resíduos sólidos nas dependências da Prefeitura Municipal de Lagoa Santa.",
  natureza: "material" as const,
  enquadramento: "comum" as const,

  // Justificativa
  necessidade: "O estoque atual de sacos de lixo descartáveis encontra-se em nível crítico, com previsão de esgotamento em aproximadamente 15 dias. A falta deste material compromete diretamente as atividades de limpeza e higienização das dependências da Prefeitura, impactando as condições sanitárias e de salubridade dos ambientes de trabalho e de atendimento ao público.",
  interessePublico: "A aquisição visa garantir a continuidade dos serviços de limpeza e manutenção da higiene nos prédios públicos municipais, assegurando: ambiente de trabalho salubre para os servidores; condições adequadas de atendimento ao cidadão; cumprimento das normas sanitárias vigentes; e destinação adequada dos resíduos sólidos gerados.",
  consequenciasNaoContratacao: "A não realização desta contratação resultará em: interrupção dos serviços de limpeza; acúmulo de resíduos nas dependências públicas; risco à saúde dos servidores e cidadãos; possível autuação por descumprimento de normas sanitárias; e comprometimento da imagem institucional do município.",

  // Itens
  itens: [
    {
      item: 1,
      descricao: "Saco de lixo descartável 100 litros, cor preta, PEAD, pacote com 100 unidades",
      catmat: "234567",
      unidade: "PCT",
      quantidade: 1,
      valorUnitario: 89.90,
      valorTotal: 89.90,
    },
  ],
  valorTotalEstimado: 89.90,
  fonteEstimativa: "PNCP - Pesquisa de preços praticados",
  metodologiaCalculo: "Levantamento de consumo médio mensal + margem de segurança de 20%",

  // Prazo e Planejamento
  prazoDesejado: "15 dias",
  prioridade: "alto" as const,
  vinculacaoPCA: "Sim (Item nº 015 - PCA 2026)",
  fonteRecursos: "Próprio",
  dotacaoOrcamentaria: "04.122.0001.2001.0000 | Fonte: 1.500.0000 | Natureza: 3.3.90.30",

  // Assinaturas
  elaboracaoNome: "Carlos Alberto Ferreira",
  elaboracaoCargo: "Coordenador de Serviços Gerais",
  elaboracaoMatricula: "54321",
  validacaoNome: "Ana Paula Rodrigues",
  validacaoCargo: "Secretária de Administração",
  validacaoMatricula: "00456",
};
