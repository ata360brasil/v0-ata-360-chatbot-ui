"use client";

import React from "react"

import { useState, useEffect } from "react";
import { X, SlidersHorizontal, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface FiltersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export interface FilterState {
  palavraChave: string;
  complemento: string;
  produtoCatmat: string;
  servicoCatser: string;
  valorMinimo: string;
  valorMaximo: string;
  periodoInicio: string;
  periodoFim: string;
  instrumentoConvocatorio: string;
  modalidade: string;
  status: string;
  cnpj: string;
  porte: string;
  naturezaJuridica: string;
  cnae: string;
  segmento: string;
  orgao: string;
  unidadeAdm: string;
  esfera: string;
  poder: string;
  empresaFornecedora: string;
  regiao: string;
  uf: string;
  municipio: string;
  modeloArtefato: string;
  dotacaoOrcamentaria: string;
  programa: string;
  tipoEmenda: string;
  convenio: string;
  conteudoNacional: string;
  margemPreferencia: string;
}

export const initialFilters: FilterState = {
  palavraChave: "",
  complemento: "",
  produtoCatmat: "",
  servicoCatser: "",
  valorMinimo: "",
  valorMaximo: "",
  periodoInicio: "",
  periodoFim: "",
  instrumentoConvocatorio: "",
  modalidade: "",
  status: "",
  cnpj: "",
  porte: "",
  naturezaJuridica: "",
  cnae: "",
  segmento: "",
  orgao: "",
  unidadeAdm: "",
  esfera: "",
  poder: "",
  empresaFornecedora: "",
  regiao: "",
  uf: "",
  municipio: "",
  modeloArtefato: "",
  dotacaoOrcamentaria: "",
  programa: "",
  tipoEmenda: "",
  convenio: "",
  conteudoNacional: "",
  margemPreferencia: "",
};

export function hasActiveFilters(filters: FilterState): boolean {
  return Object.values(filters).some((value) => value !== "");
}

const instrumentosOptions = [
  "Todos",
  "Edital de Licitação",
  "Aviso de Contratação Direta",
  "Aviso de Dispensa Eletrônica",
  "Ata de Registro de Preços",
  "Pré-qualificação",
  "Credenciamento",
];

const modalidades = [
  "Todas",
  "Pregão Eletrônico",
  "Concorrência Eletrônica",
  "Concorrência",
  "Leilão Eletrônico",
  "Diálogo Competitivo",
  "Dispensa de Licitação",
  "Inexigibilidade",
  "Manifestação de Interesse",
  "Pré-qualificação",
  "Credenciamento",
];

const statusOptions = [
  "Todos Tipos",
  "Todos editais",
  "Todos contratos",
  "Todas atas",
  "Vigentes",
  "Não vigentes",
  "Renovados",
  "Suspensos",
  "Sujeito a análise ou penalidades",
  "Compras / Contratos / Atas com Vencimento em ≤90 dias",
  "Compras / Contratos / Atas com Vencimento em ≤60 dias",
  "Compras / Contratos / Atas com Vencimento em ≤30 dias",
  "Licitação recebendo propostas",
  "Licitação em julgamento",
  "Licitação encerrada",
  "Processo aguardando publicação",
  "Em planejamento interno",
];

const porteOptions = [
  "Todos",
  "MEI - Microempreendedor Individual",
  "Autônomo PF",
  "Optante pelo SIMPLES",
  "Inova Simples",
  "Ltda",
  "EIRELI",
  "S/A - Sociedade Anônima",
  "EPP - Empresa de Pequeno Porte",
  "ME - Microempresa",
  "Empresa de Médio Porte",
  "Empresa de Grande Porte",
];

const segmentoOptions = [
  "Todos",
  "Agricultura, Pecuária e Pesca",
  "Indústrias Extrativas",
  "Indústrias de Transformação",
  "Eletricidade, Gás e Energia",
  "Água, Esgoto e Saneamento",
  "Construção e Engenharia",
  "Comércio e Reparação de Veículos",
  "Transporte e Armazenagem",
  "Alojamento e Alimentação",
  "Informação e Comunicação",
  "Tecnologia da Informação",
  "Atividades Financeiras e Seguros",
  "Atividades Imobiliárias",
  "Atividades Profissionais e Técnicas",
  "Atividades Administrativas",
  "Administração Pública e Defesa",
  "Educação",
  "Saúde e Serviços Sociais",
  "Artes, Cultura e Esporte",
  "Outras Atividades de Serviços",
];

const naturezaJuridicaOptions = [
  "Todas",
  "Administração Pública Federal",
  "Administração Pública Estadual",
  "Administração Pública Municipal",
  "Autarquia Federal",
  "Autarquia Estadual",
  "Autarquia Municipal",
  "Fundação Pública",
  "Empresa Pública",
  "Sociedade de Economia Mista",
  "Consórcio Público",
  "Organização Social",
  "OSCIP",
  "Universidade",
  "Instituto Federal",
  "Empresa Privada",
  "Cooperativa",
  "Associação",
  "Fundação Privada",
  "Entidade Sindical",
];

const esferaOptions = [
  "Todas",
  "Federal",
  "Estadual",
  "Municipal",
];

const poderOptions = [
  "Todos",
  "Executivo",
  "Legislativo",
  "Judiciario",
];

const regiaoOptions = [
  "Todas",
  "Norte",
  "Nordeste",
  "Centro-Oeste",
  "Sudeste",
  "Sul",
];

const ufOptions = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO",
];

const artefatosOptions = [
  "Todos",
  // Fase de Planejamento
  "PPA - Plano Plurianual",
  "LDO - Lei de Diretrizes Orçamentárias",
  "LOA - Lei Orçamentária Anual",
  "PCA - Plano de Contratações Anual",
  "DFD - Documento de Formalização de Demanda",
  "ETP - Estudo Técnico Preliminar",
  "Análise de Riscos",
  "TR - Termo de Referência",
  "Projeto Básico",
  "Projeto Executivo",
  "Anteprojeto",
  // Fase de Pesquisa e Orçamento
  "Pesquisa de Preços",
  "MAP - Mapa de Análise de Preços",
  "Orçamento Estimativo",
  "Quadro de Quantitativos",
  "Planilha de Custos e Formação de Preços",
  // Fase de Instrução Processual
  "Minuta de Edital",
  "Parecer Jurídico",
  "Parecer Técnico",
  "Nota Técnica",
  "Despacho Decisório",
  "Portaria de Designação",
  "Portaria de Nomeação de Comissão",
  // Fase de Publicação e Divulgação
  "Edital",
  "Aviso de Licitação",
  "Aviso de Contratação Direta",
  "Aviso de Dispensa Eletrônica",
  "Comunicado",
  "Ofício",
  "Ofício Circular",
  "Memorando",
  "Notificação",
  "Intimação",
  // Fase de Sessão e Julgamento
  "Ata de Sessão Pública",
  "Ata de Reunião",
  "Mapa Comparativo de Propostas",
  "Relatório de Julgamento",
  "Declaração de Habilitação",
  "Diligência",
  "Pedido de Esclarecimento",
  "Impugnação ao Edital",
  "Recurso Administrativo",
  "Contrarrazões",
  "Decisão de Recurso",
  // Fase de Resultado
  "Ato de Adjudicação",
  "Ato de Homologação",
  "Resultado de Licitação",
  "Ato de Revogação",
  "Ato de Anulação",
  "Declaração de Licitação Deserta",
  "Declaração de Licitação Fracassada",
  // Fase Contratual
  "Minuta de Contrato",
  "Contrato",
  "Ata de Registro de Preços",
  "Adesão à Ata de Registro de Preços",
  "Autorização para Adesão (Carona)",
  "Termo de Adesão",
  "Convênio",
  "Acordo de Cooperação Técnica",
  "Termo de Colaboração",
  "Termo de Fomento",
  // Fase de Execução
  "Ordem de Serviço",
  "Ordem de Fornecimento",
  "Autorização de Início",
  "Cronograma Físico-Financeiro",
  "Medição de Serviços",
  "Boletim de Medição",
  "Atesto de Nota Fiscal",
  "Termo de Recebimento Provisório",
  "Termo de Recebimento Definitivo",
  "Relatório de Fiscalização",
  // Fase de Alterações Contratuais
  "Termo Aditivo",
  "Apostilamento",
  "Reajuste Contratual",
  "Repactuação",
  "Reequilíbrio Econômico-Financeiro",
  // Fase de Encerramento
  "Termo de Rescisão",
  "Termo de Distrato",
  "Termo de Encerramento",
  "Quitação Contratual",
  // Sanções e Penalidades
  "Notificação de Inadimplência",
  "Advertência",
  "Multa",
  "Suspensão Temporária",
  "Declaração de Inidoneidade",
  "Impedimento de Licitar",
  // Outros Documentos
  "Certidão",
  "Atestado de Capacidade Técnica",
  "Declarações Diversas",
  "Comprovante de Publicação",
  "Extrato de Contrato",
  "Extrato de Aditivo",
];

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function FilterSection({ title, children, defaultOpen = false }: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-border/30 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-3 px-1 text-left hover:bg-muted/30 transition-colors cursor-pointer"
      >
        <span className="text-sm font-medium text-foreground">{title}</span>
        <ChevronDown
          className={cn(
            "size-4 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>
      {isOpen && (
        <div className="pb-4 px-1">
          {children}
        </div>
      )}
    </div>
  );
}

export function FiltersModal({
  open,
  onOpenChange,
  filters,
  onFiltersChange,
}: FiltersModalProps) {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);

  useEffect(() => {
    if (open) {
      setLocalFilters(filters);
    }
  }, [open, filters]);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
    onOpenChange(false);
  };

  const handleClear = () => {
    setLocalFilters(initialFilters);
    onFiltersChange(initialFilters);
  };

  const inputClassName = "h-9 bg-background border border-border/50 rounded-full text-sm px-4 shadow-none focus:ring-0 focus:border-border placeholder:text-muted-foreground";
  const selectTriggerClassName = "h-9 bg-background border border-border/50 rounded-full text-sm px-4 shadow-none";
  const labelClassName = "block text-xs text-muted-foreground mb-1.5";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-3xl w-[90vw] h-[75vh] p-0 bg-background border border-border/40 rounded-2xl overflow-hidden flex flex-col"
        showCloseButton={false}
      >
        {/* Header */}
        <DialogHeader className="px-5 py-4 border-b border-border/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="size-4 text-foreground" />
              <DialogTitle className="text-sm font-semibold text-foreground uppercase tracking-wide">
                Filtros
              </DialogTitle>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="size-8 rounded-full flex items-center justify-center hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <X className="size-4 text-muted-foreground" />
            </button>
          </div>
        </DialogHeader>

        {/* Content */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="px-5 py-2">
            
            {/* Buscas por palavras-chave */}
            <FilterSection title="Buscas por palavras-chave">
              <Input
                placeholder="Digite sua busca com complementos"
                value={localFilters.palavraChave}
                onChange={(e) => handleFilterChange("palavraChave", e.target.value)}
                className={inputClassName}
              />
            </FilterSection>

            {/* Códigos CatMAT / CatSERV */}
            <FilterSection title="Códigos CatMAT / CatSERV">
              <div className="flex flex-col gap-3">
                <Select
                  value={localFilters.produtoCatmat}
                  onValueChange={(value) => handleFilterChange("produtoCatmat", value)}
                >
                  <SelectTrigger className={cn(selectTriggerClassName, "w-full")}>
                    <SelectValue placeholder="Selecione o CatMAT" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="150450">150450 - Papel A4</SelectItem>
                    <SelectItem value="234567">234567 - Caneta esferografica</SelectItem>
                    <SelectItem value="345678">345678 - Toner impressora</SelectItem>
                    <SelectItem value="456789">456789 - Notebook</SelectItem>
                    <SelectItem value="567890">567890 - Monitor LED</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={localFilters.servicoCatser}
                  onValueChange={(value) => handleFilterChange("servicoCatser", value)}
                >
                  <SelectTrigger className={cn(selectTriggerClassName, "w-full")}>
                    <SelectValue placeholder="Selecione o CatSERV" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="20001">20001 - Servicos de limpeza</SelectItem>
                    <SelectItem value="20045">20045 - Manutencao predial</SelectItem>
                    <SelectItem value="20123">20123 - Seguranca patrimonial</SelectItem>
                    <SelectItem value="20456">20456 - Suporte de TI</SelectItem>
                    <SelectItem value="20789">20789 - Consultoria tecnica</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </FilterSection>

            {/* Valores Mín. / Máx. */}
            <FilterSection title="Valores Mín. / Máx.">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  placeholder="0,00"
                  type="text"
                  value={localFilters.valorMinimo}
                  onChange={(e) => handleFilterChange("valorMinimo", e.target.value)}
                  className={inputClassName}
                />
                <Input
                  placeholder="999.999.999.999,00"
                  type="text"
                  value={localFilters.valorMaximo}
                  onChange={(e) => handleFilterChange("valorMaximo", e.target.value)}
                  className={inputClassName}
                />
              </div>
            </FilterSection>

            {/* Período Inicial / Final */}
            <FilterSection title="Período Inicial / Final">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="date"
                  value={localFilters.periodoInicio}
                  onChange={(e) => handleFilterChange("periodoInicio", e.target.value)}
                  className={inputClassName}
                />
                <Input
                  type="date"
                  value={localFilters.periodoFim}
                  onChange={(e) => handleFilterChange("periodoFim", e.target.value)}
                  className={inputClassName}
                />
              </div>
            </FilterSection>

            {/* Tipos de Compra / Licitação */}
            <FilterSection title="Tipos de Compra / Licitação">
              <div className="flex flex-col gap-3">
                <Select
                  value={localFilters.instrumentoConvocatorio}
                  onValueChange={(value) => handleFilterChange("instrumentoConvocatorio", value)}
                >
                  <SelectTrigger className={cn(selectTriggerClassName, "w-full")}>
                    <SelectValue placeholder="Selecione Instrumento convocatório" />
                  </SelectTrigger>
                  <SelectContent>
                    {instrumentosOptions.map((item) => (
                      <SelectItem key={item} value={item} className="text-sm">
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={localFilters.modalidade}
                  onValueChange={(value) => handleFilterChange("modalidade", value)}
                >
                  <SelectTrigger className={cn(selectTriggerClassName, "w-full")}>
                    <SelectValue placeholder="Selecione a modalidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {modalidades.map((item) => (
                      <SelectItem key={item} value={item} className="text-sm">
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </FilterSection>

            {/* Status dos Processos */}
            <FilterSection title="Status dos Processos">
              <Select
                value={localFilters.status}
                onValueChange={(value) => handleFilterChange("status", value)}
              >
                <SelectTrigger className={cn(selectTriggerClassName, "w-full")}>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((item) => (
                    <SelectItem key={item} value={item} className="text-sm">
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FilterSection>

            {/* CNPJ | Dados Cadastrais */}
            <FilterSection title="CNPJ | Dados Cadastrais">
              <div className="flex flex-col gap-3">
                <Input
                  placeholder="Digite o CNPJ 00.000.000/0000-00"
                  value={localFilters.cnpj}
                  onChange={(e) => handleFilterChange("cnpj", e.target.value)}
                  className={inputClassName}
                />
                <Select
                  value={localFilters.porte}
                  onValueChange={(value) => handleFilterChange("porte", value)}
                >
                  <SelectTrigger className={cn(selectTriggerClassName, "w-full")}>
                    <SelectValue placeholder="Selecione o porte" />
                  </SelectTrigger>
                  <SelectContent>
                    {porteOptions.map((item) => (
                      <SelectItem key={item} value={item} className="text-sm">
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={localFilters.naturezaJuridica}
                  onValueChange={(value) => handleFilterChange("naturezaJuridica", value)}
                >
                  <SelectTrigger className={cn(selectTriggerClassName, "w-full")}>
                    <SelectValue placeholder="Selecione a Natureza Jurídica" />
                  </SelectTrigger>
                  <SelectContent>
                    {naturezaJuridicaOptions.map((item) => (
                      <SelectItem key={item} value={item} className="text-sm">
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Digite o CNAE 0000-0/00"
                  value={localFilters.cnae}
                  onChange={(e) => handleFilterChange("cnae", e.target.value)}
                  className={inputClassName}
                />
                <Select
                  value={localFilters.segmento}
                  onValueChange={(value) => handleFilterChange("segmento", value)}
                >
                  <SelectTrigger className={cn(selectTriggerClassName, "w-full")}>
                    <SelectValue placeholder="Selecione o segmento" />
                  </SelectTrigger>
                  <SelectContent>
                    {segmentoOptions.map((item) => (
                      <SelectItem key={item} value={item} className="text-sm">
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </FilterSection>

            {/* Orgao */}
            <FilterSection title="Órgão Público">
              <div className="flex flex-col gap-3">
                <Select
                  value={localFilters.orgao}
                  onValueChange={(value) => handleFilterChange("orgao", value)}
                >
                  <SelectTrigger className={cn(selectTriggerClassName, "w-full")}>
                    <SelectValue placeholder="Selecione o órgão público A/Z" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mec">MEC - Ministério da Educação</SelectItem>
                    <SelectItem value="ms">MS - Ministério da Saúde</SelectItem>
                    <SelectItem value="mf">MF - Ministério da Fazenda</SelectItem>
                    <SelectItem value="mpog">MPOG - Ministério do Planejamento</SelectItem>
                    <SelectItem value="outros">Outros órgãos...</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={localFilters.unidadeAdm}
                  onValueChange={(value) => handleFilterChange("unidadeAdm", value)}
                >
                  <SelectTrigger className={cn(selectTriggerClassName, "w-full")}>
                    <SelectValue placeholder="Selecione a unidade administrativa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sede">Sede</SelectItem>
                    <SelectItem value="regional">Regional</SelectItem>
                    <SelectItem value="superintendencia">Superintendência</SelectItem>
                    <SelectItem value="diretoria">Diretoria</SelectItem>
                    <SelectItem value="coordenacao">Coordenação</SelectItem>
                  </SelectContent>
                </Select>
                <div className="grid grid-cols-2 gap-3">
                  <Select
                    value={localFilters.esfera}
                    onValueChange={(value) => handleFilterChange("esfera", value)}
                  >
                    <SelectTrigger className={cn(selectTriggerClassName, "w-full")}>
                      <SelectValue placeholder="Selecione a esfera" />
                    </SelectTrigger>
                    <SelectContent>
                      {esferaOptions.map((item) => (
                        <SelectItem key={item} value={item} className="text-sm">
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={localFilters.poder}
                    onValueChange={(value) => handleFilterChange("poder", value)}
                  >
                    <SelectTrigger className={cn(selectTriggerClassName, "w-full")}>
                      <SelectValue placeholder="Selecione o poder público" />
                    </SelectTrigger>
                    <SelectContent>
                      {poderOptions.map((item) => (
                        <SelectItem key={item} value={item} className="text-sm">
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </FilterSection>

            {/* Empresa / Fornecedor */}
            <FilterSection title="Empresa / Fornecedor">
              <Select
                value={localFilters.empresaFornecedora}
                onValueChange={(value) => handleFilterChange("empresaFornecedora", value)}
              >
                <SelectTrigger className={cn(selectTriggerClassName, "w-full")}>
                  <SelectValue placeholder="Selecione a razão social A/Z" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="empresa1">ABC Comercio e Servicos Ltda</SelectItem>
                  <SelectItem value="empresa2">Brasil Tech Solutions S/A</SelectItem>
                  <SelectItem value="empresa3">Central de Suprimentos ME</SelectItem>
                  <SelectItem value="empresa4">Delta Engenharia EPP</SelectItem>
                  <SelectItem value="empresa5">Fornecimentos Gerais Ltda</SelectItem>
                </SelectContent>
              </Select>
            </FilterSection>

            {/* Localização */}
            <FilterSection title="Localização">
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <Select
                    value={localFilters.regiao}
                    onValueChange={(value) => handleFilterChange("regiao", value)}
                  >
                    <SelectTrigger className={cn(selectTriggerClassName, "w-full")}>
                      <SelectValue placeholder="Selecione a região" />
                    </SelectTrigger>
                    <SelectContent>
                      {regiaoOptions.map((item) => (
                        <SelectItem key={item} value={item} className="text-sm">
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={localFilters.uf}
                    onValueChange={(value) => handleFilterChange("uf", value)}
                  >
                    <SelectTrigger className={cn(selectTriggerClassName, "w-full")}>
                      <SelectValue placeholder="Selecione a UF" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas" className="text-sm">Todas</SelectItem>
                      {ufOptions.map((item) => (
                        <SelectItem key={item} value={item} className="text-sm">
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Select
                  value={localFilters.municipio}
                  onValueChange={(value) => handleFilterChange("municipio", value)}
                >
                  <SelectTrigger className={cn(selectTriggerClassName, "w-full")}>
                    <SelectValue placeholder="Selecione o município" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="sao_paulo">São Paulo</SelectItem>
                    <SelectItem value="rio_janeiro">Rio de Janeiro</SelectItem>
                    <SelectItem value="brasilia">Brasília</SelectItem>
                    <SelectItem value="belo_horizonte">Belo Horizonte</SelectItem>
                    <SelectItem value="outros">Outros municípios...</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </FilterSection>

            {/* Artefatos (+100 opções)* */}
            <FilterSection title="Artefatos (+100 opções)*">
              <Select
                value={localFilters.modeloArtefato}
                onValueChange={(value) => handleFilterChange("modeloArtefato", value)}
              >
                <SelectTrigger className={cn(selectTriggerClassName, "w-full")}>
                  <SelectValue placeholder="Selecione modelo de artefato" />
                </SelectTrigger>
                <SelectContent>
                  {artefatosOptions.map((item) => (
                    <SelectItem key={item} value={item} className="text-sm">
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FilterSection>

            {/* Fonte recursos e outros */}
            <FilterSection title="Fonte recursos e outros">
              <div className="flex flex-col gap-3">
                <Input
                  placeholder="Inserir dotação orçamentária"
                  value={localFilters.dotacaoOrcamentaria}
                  onChange={(e) => handleFilterChange("dotacaoOrcamentaria", e.target.value)}
                  className={inputClassName}
                />
                <Select
                  value={localFilters.programa}
                  onValueChange={(value) => handleFilterChange("programa", value)}
                >
                  <SelectTrigger className={cn(selectTriggerClassName, "w-full")}>
                    <SelectValue placeholder="Selecione o programa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="pac">PAC - Programa de Aceleração do Crescimento</SelectItem>
                    <SelectItem value="bolsa_familia">Bolsa Família</SelectItem>
                    <SelectItem value="minha_casa">Minha Casa Minha Vida</SelectItem>
                    <SelectItem value="saude_familia">Estratégia Saúde da Família</SelectItem>
                    <SelectItem value="educacao_basica">Educação Básica</SelectItem>
                    <SelectItem value="outros">Outros programas...</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={localFilters.tipoEmenda}
                  onValueChange={(value) => handleFilterChange("tipoEmenda", value)}
                >
                  <SelectTrigger className={cn(selectTriggerClassName, "w-full")}>
                    <SelectValue placeholder="Selecione tipo emenda" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="individual">Emenda Individual</SelectItem>
                    <SelectItem value="bancada">Emenda de Bancada</SelectItem>
                    <SelectItem value="comissao">Emenda de Comissão</SelectItem>
                    <SelectItem value="relator">Emenda de Relator</SelectItem>
                    <SelectItem value="pix">Emenda PIX</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={localFilters.convenio}
                  onValueChange={(value) => handleFilterChange("convenio", value)}
                >
                  <SelectTrigger className={cn(selectTriggerClassName, "w-full")}>
                    <SelectValue placeholder="Selecione o convênio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="siconv">SICONV / Plataforma +Brasil</SelectItem>
                    <SelectItem value="transferegov">TransfereGov</SelectItem>
                    <SelectItem value="fns">FNS - Fundo Nacional de Saúde</SelectItem>
                    <SelectItem value="fnde">FNDE - Fundo Nacional de Educação</SelectItem>
                    <SelectItem value="outros">Outros convênios...</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={localFilters.conteudoNacional}
                  onValueChange={(value) => handleFilterChange("conteudoNacional", value)}
                >
                  <SelectTrigger className={cn(selectTriggerClassName, "w-full")}>
                    <SelectValue placeholder="Selecione conteúdo nacional" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="sim">Sim - Exige conteúdo nacional</SelectItem>
                    <SelectItem value="nao">Não - Sem exigência</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={localFilters.margemPreferencia}
                  onValueChange={(value) => handleFilterChange("margemPreferencia", value)}
                >
                  <SelectTrigger className={cn(selectTriggerClassName, "w-full")}>
                    <SelectValue placeholder="Selecione a margem de preferência" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="sim">Sim - Aplica margem de preferência</SelectItem>
                    <SelectItem value="nao">Não - Sem margem de preferência</SelectItem>
                    <SelectItem value="me_epp">ME/EPP - Margem para micro e pequenas</SelectItem>
                    <SelectItem value="nacional">Produtos nacionais</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </FilterSection>

          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-border/30 flex items-center justify-center gap-4 shrink-0">
          <Button
            variant="outline"
            onClick={handleClear}
            className="h-10 flex-1 max-w-[200px] rounded-full border-border/60 text-sm font-medium bg-transparent hover:bg-muted/50 cursor-pointer"
          >
            Limpar
          </Button>
          <Button
            onClick={handleApply}
            className="h-10 flex-1 max-w-[200px] rounded-full bg-foreground text-background hover:bg-foreground/90 text-sm font-medium cursor-pointer"
          >
            Filtrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
