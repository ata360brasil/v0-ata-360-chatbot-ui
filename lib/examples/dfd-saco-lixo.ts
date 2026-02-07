// Exemplo de DFD gerado pelo chat LLM
// Solicitacao: "Gere DFD compra saco de lixo descartavel 100l, 100 unidades"

export const dfdSacoLixoData = {
  // Identificacao
  docNumero: "DFD-PMLS-2026-0002",
  processoNumero: "PAD 002/2026",
  versao: "1.0",
  data: "04/02/2026",
  
  // Ente
  enteNome: "PREFEITURA MUNICIPAL DE LAGOA SANTA",
  secretaria: "Secretaria Municipal de Administracao",
  departamento: "Departamento de Servicos Gerais",
  
  // Demandante
  unidadeRequisitante: "Departamento de Servicos Gerais",
  responsavelNome: "Carlos Alberto Ferreira",
  responsavelCargo: "Coordenador de Servicos Gerais",
  responsavelMatricula: "54321",
  responsavelEmail: "servicos.gerais@lagoasanta.mg.gov.br",
  
  // Objeto
  objetoDescricao: "Aquisicao de sacos de lixo descartaveis com capacidade de 100 litros, na cor preta, confeccionados em polietileno de alta densidade (PEAD), para atendimento as necessidades de coleta e acondicionamento de residuos solidos nas dependencias da Prefeitura Municipal de Lagoa Santa.",
  natureza: "material" as const,
  enquadramento: "comum" as const,
  
  // Justificativa
  necessidade: "O estoque atual de sacos de lixo descartaveis encontra-se em nivel critico, com previsao de esgotamento em aproximadamente 15 dias. A falta deste material compromete diretamente as atividades de limpeza e higienizacao das dependencias da Prefeitura, impactando as condicoes sanitarias e de salubridade dos ambientes de trabalho e de atendimento ao publico.",
  interessePublico: "A aquisicao visa garantir a continuidade dos servicos de limpeza e manutencao da higiene nos predios publicos municipais, assegurando: ambiente de trabalho salubre para os servidores; condicoes adequadas de atendimento ao cidadao; cumprimento das normas sanitarias vigentes; e destinacao adequada dos residuos solidos gerados.",
  consequenciasNaoContratacao: "A nao realizacao desta contratacao resultara em: interrupcao dos servicos de limpeza; acumulo de residuos nas dependencias publicas; risco a saude dos servidores e cidadaos; possivel autuacao por descumprimento de normas sanitarias; e comprometimento da imagem institucional do municipio.",
  
  // Itens
  itens: [
    {
      item: 1,
      descricao: "Saco de lixo descartavel 100 litros, cor preta, PEAD, pacote com 100 unidades",
      catmat: "234567",
      unidade: "PCT",
      quantidade: 1,
      valorUnitario: 89.90,
      valorTotal: 89.90,
    },
  ],
  valorTotalEstimado: 89.90,
  fonteEstimativa: "PNCP - Pesquisa de precos praticados",
  metodologiaCalculo: "Levantamento de consumo medio mensal + margem de seguranca de 20%",
  
  // Prazo e Planejamento
  prazoDesejado: "15 dias",
  prioridade: "alto" as const,
  vinculacaoPCA: "Sim (Item n 015 - PCA 2026)",
  fonteRecursos: "Proprio",
  dotacaoOrcamentaria: "04.122.0001.2001.0000 | Fonte: 1.500.0000 | Natureza: 3.3.90.30",
  
  // Assinaturas
  elaboracaoNome: "Carlos Alberto Ferreira",
  elaboracaoCargo: "Coordenador de Servicos Gerais",
  elaboracaoMatricula: "54321",
  validacaoNome: "Ana Paula Rodrigues",
  validacaoCargo: "Secretaria de Administracao",
  validacaoMatricula: "00456",
};
