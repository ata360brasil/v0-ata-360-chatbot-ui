"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  ChevronDown,
  AlertCircle,
  Download,
  ExternalLink,
  Star,
  MoreVertical,
  RefreshCw,
  XCircle,
  Plus,
  LayoutGrid,
  List,
  ArrowUpDown,
  FileSignature,
  File,
  Eye,
  Lock,
  Edit3,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Contract {
  id: string;
  processNumber: string;
  bidNumber: string;
  mainObject: string;
  purchaseType: string;
  status: "ativo" | "vencimento_proximo" | "vencido";
  supplier: {
    name: string;
    cnpj: string;
  };
  contractStart: string;
  contractEnd: string;
  homologationDate: string;
  totalValue: number;
  itemsCount: number;
  observations: string;
  ratings: {
    supplier: number;
    delivery: number;
    quality: number;
    relationship: number;
  };
  ratingEvaluated?: boolean;
  ratingObservation?: string;
  ratingDate?: string;
  ratingUser?: string;
  attachments: Array<{ name: string; url: string }>;
  pncpLink: string;
}

const mockContracts: Contract[] = [
  {
    id: "1",
    processNumber: "2023/0156",
    bidNumber: "PE/2023/0089",
    mainObject: "Aquisição de Pneus para Frota Municipal",
    purchaseType: "Compra",
    status: "ativo",
    supplier: {
      name: "Pneus Master Distribuidora",
      cnpj: "23.456.789/0001-12",
    },
    contractStart: "15/08/2023",
    contractEnd: "15/08/2025",
    homologationDate: "10/08/2023",
    totalValue: 285000,
    itemsCount: 12,
    observations: "Fornecimento parcelado mensal",
    ratings: {
      supplier: 5,
      delivery: 5,
      quality: 4,
      relationship: 5,
    },
    attachments: [
      { name: "Contrato_Pneus.pdf", url: "#" },
      { name: "Ata_Registro_Precos.pdf", url: "#" },
    ],
    pncpLink: "https://pncp.gov.br",
  },
  {
    id: "2",
    processNumber: "2024/0023",
    bidNumber: "CP/2024/0007",
    mainObject: "Construção de Unidade de Pronto Atendimento - UPA",
    purchaseType: "Serviço",
    status: "ativo",
    supplier: {
      name: "Construtora Vale do Aço S.A.",
      cnpj: "45.678.901/0001-34",
    },
    contractStart: "20/02/2024",
    contractEnd: "20/08/2025",
    homologationDate: "15/02/2024",
    totalValue: 4850000,
    itemsCount: 1,
    observations: "Obra em andamento - fase de fundação",
    ratings: {
      supplier: 4,
      delivery: 4,
      quality: 5,
      relationship: 4,
    },
    attachments: [
      { name: "Contrato_Construcao_UPA.pdf", url: "#" },
      { name: "Projeto_Executivo.pdf", url: "#" },
      { name: "Cronograma_Fisico_Financeiro.xlsx", url: "#" },
    ],
    pncpLink: "https://pncp.gov.br",
  },
  {
    id: "3",
    processNumber: "2024/0087",
    bidNumber: "PE/2024/0041",
    mainObject: "Aquisição de Veículo 4x4 para Secretaria de Saúde",
    purchaseType: "Compra",
    status: "vencimento_proximo",
    supplier: {
      name: "Automotive Solutions Ltda",
      cnpj: "67.890.123/0001-56",
    },
    contractStart: "10/04/2024",
    contractEnd: "10/05/2025",
    homologationDate: "05/04/2024",
    totalValue: 185000,
    itemsCount: 1,
    observations: "Veículo entregue com garantia de fábrica",
    ratings: {
      supplier: 5,
      delivery: 5,
      quality: 5,
      relationship: 5,
    },
    attachments: [
      { name: "Contrato_Veiculo.pdf", url: "#" },
      { name: "Nota_Fiscal.pdf", url: "#" },
    ],
    pncpLink: "https://pncp.gov.br",
  },
  {
    id: "4",
    processNumber: "2024/0112",
    bidNumber: "DI/2024/0029",
    mainObject: "Dispensa - Aquisição de Software de Gestão Pública",
    purchaseType: "Compra",
    status: "ativo",
    supplier: {
      name: "TechGov Sistemas Integrados",
      cnpj: "89.012.345/0001-78",
    },
    contractStart: "05/06/2024",
    contractEnd: "05/06/2025",
    homologationDate: "01/06/2024",
    totalValue: 95000,
    itemsCount: 3,
    observations: "Licenciamento anual com suporte técnico",
    ratings: {
      supplier: 4,
      delivery: 5,
      quality: 4,
      relationship: 4,
    },
    attachments: [
      { name: "Termo_Dispensa.pdf", url: "#" },
      { name: "Contrato_Software.pdf", url: "#" },
    ],
    pncpLink: "https://pncp.gov.br",
  },
  {
    id: "5",
    processNumber: "2023/0198",
    bidNumber: "SRP/2023/0067",
    mainObject: "SRP - Produtos Hospitalares e Medicamentos",
    purchaseType: "Compra",
    status: "ativo",
    supplier: {
      name: "MedSupply Distribuidora Hospitalar",
      cnpj: "12.345.098/0001-90",
    },
    contractStart: "01/11/2023",
    contractEnd: "01/11/2025",
    homologationDate: "25/10/2023",
    totalValue: 1250000,
    itemsCount: 847,
    observations: "Ata de registro de preços vigente",
    ratings: {
      supplier: 5,
      delivery: 4,
      quality: 5,
      relationship: 5,
    },
    attachments: [
      { name: "Ata_SRP.pdf", url: "#" },
      { name: "Catalogo_Produtos.pdf", url: "#" },
    ],
    pncpLink: "https://pncp.gov.br",
  },
];

type ViewType = "cards" | "list";
type SortType = "process" | "object" | "endDate" | "homologation" | "value";

export function ContractsPage() {
  const [viewType, setViewType] = useState<ViewType>("cards");
  const [sortBy, setSortBy] = useState<SortType>("process");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [attachmentsModalOpen, setAttachmentsModalOpen] = useState(false);
  const [ratingsModalOpen, setRatingsModalOpen] = useState(false);
  const [tempRatings, setTempRatings] = useState({
    supplier: 0,
    delivery: 0,
    quality: 0,
    relationship: 0,
  });
  const [ratingObservation, setRatingObservation] = useState("");
  const [newContractModalOpen, setNewContractModalOpen] = useState(false);
  const [newContract, setNewContract] = useState({
    processNumber: "",
    bidNumber: "",
    mainObject: "",
    purchaseType: "",
    supplierName: "",
    supplierCnpj: "",
    contractStart: "",
    contractEnd: "",
    totalValue: "",
    observations: "",
  });

  const filteredContracts = mockContracts.filter(contract =>
    contract.mainObject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.processNumber.includes(searchTerm)
  );

  const sortedContracts = [...filteredContracts].sort((a, b) => {
    switch (sortBy) {
      case "object":
        return a.mainObject.localeCompare(b.mainObject);
      case "endDate":
        return new Date(a.contractEnd.split("/").reverse().join("-")).getTime() -
               new Date(b.contractEnd.split("/").reverse().join("-")).getTime();
      case "homologation":
        return new Date(b.homologationDate.split("/").reverse().join("-")).getTime() -
               new Date(a.homologationDate.split("/").reverse().join("-")).getTime();
      case "value":
        return b.totalValue - a.totalValue;
      case "process":
      default:
        return a.processNumber.localeCompare(b.processNumber);
    }
  });

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "vencimento_proximo":
        return "Vence em breve";
      case "vencido":
        return "Vencido";
      case "ativo":
      default:
        return "Ativo";
    }
  };

  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={12}
          className={cn(
            i < rating ? "fill-foreground text-foreground" : "text-muted-foreground/30"
          )}
        />
      ))}
    </div>
  );

  const InteractiveStarRating = ({ 
    rating, 
    onRatingChange 
  }: { 
    rating: number; 
    onRatingChange: (rating: number) => void;
  }) => {
    const [hover, setHover] = useState(0);
    
    return (
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onRatingChange(i + 1)}
            onMouseEnter={() => setHover(i + 1)}
            onMouseLeave={() => setHover(0)}
            className="cursor-pointer transition-colors"
          >
            <Star
              size={18}
              className={cn(
                "transition-colors",
                (hover ? i < hover : i < rating)
                  ? "fill-foreground text-foreground"
                  : "text-muted-foreground/30 hover:text-muted-foreground/50"
              )}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b border-border/30 p-4">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <FileSignature size={20} />
            Contratos Vigentes
          </h1>
          <div className="flex items-center gap-2">
            {/* New Contract Button */}
            <Button
              className="gap-2 h-9 rounded-full bg-foreground text-white hover:bg-foreground/90"
              onClick={() => setNewContractModalOpen(true)}
            >
              <Plus size={14} />
              Novo Contrato
            </Button>

            {/* View Type Icons */}
            <div className="flex items-center gap-1 border border-border rounded-full p-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewType("cards")}
                className={cn(
                  "size-7 rounded-full hover:bg-muted",
                  viewType === "cards" && "bg-foreground text-white hover:bg-foreground/90"
                )}
              >
                <LayoutGrid size={16} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewType("list")}
                className={cn(
                  "size-7 rounded-full hover:bg-muted",
                  viewType === "list" && "bg-foreground text-white hover:bg-foreground/90"
                )}
              >
                <List size={16} />
              </Button>
            </div>

            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent h-9 rounded-full hover:bg-muted">
                  <ArrowUpDown size={14} />
                  Ordenar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortBy("process")}>
                  N Processo
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("object")}>
                  Objeto
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("endDate")}>
                  Vencimento
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("value")}>
                  Valor
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar por produto, serviço, contrato ou fornecedor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 rounded-full"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {viewType === "cards" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 auto-rows-fr">
            {sortedContracts.map((contract) => (
              <div
                key={contract.id}
                className="border border-border rounded-3xl p-3 hover:border-foreground transition-colors bg-background flex flex-col"
              >
                {/* Header with Value */}
                <div className="flex items-start justify-between mb-2 gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground leading-tight mb-0.5">
                      {contract.mainObject}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {contract.processNumber}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-6 shrink-0 rounded-full hover:bg-muted">
                        <MoreVertical size={14} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <RefreshCw size={12} className="mr-2" />
                        Renovar
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <XCircle size={12} className="mr-2" />
                        Encerrar
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Plus size={12} className="mr-2" />
                        Nova Licitação
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Value - Highlighted */}
                <div className="mb-2 pb-2 border-b border-border/30">
                  <p className="text-xl font-bold text-foreground">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(contract.totalValue)}
                  </p>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-1.5 mb-2">
                  <Badge variant="outline" className="text-[10px] h-5 rounded-full border-foreground/20">
                    {contract.purchaseType}
                  </Badge>
                  <Badge variant="outline" className="text-[10px] h-5 rounded-full border-foreground/20">
                    {getStatusLabel(contract.status)}
                  </Badge>
                  {contract.status === "vencimento_proximo" && (
                    <Badge variant="outline" className="text-[10px] h-5 rounded-full gap-1 border-foreground">
                      <AlertCircle size={10} />
                      Alerta
                    </Badge>
                  )}
                </div>

                {/* Supplier */}
                <div className="mb-2 pb-2 border-b border-border/30">
                  <p className="text-[10px] text-muted-foreground mb-0.5">Fornecedor</p>
                  <p className="text-xs font-medium text-foreground leading-tight">
                    {contract.supplier.name}
                  </p>
                </div>

                {/* Contract Info - Vigência and Items */}
                <div className="mb-2 pb-2 border-b border-border/30">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-[10px] text-muted-foreground mb-0.5">Vigência</p>
                      <p className="text-xs font-medium text-foreground">{contract.contractEnd}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-muted-foreground mb-0.5">Itens</p>
                      <p className="text-xs font-medium text-foreground">{contract.itemsCount}</p>
                    </div>
                  </div>
                </div>

                {/* Ratings - Compact */}
                <div className="mb-2 pb-2 border-b border-border/30">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-[10px] text-muted-foreground">Avaliações</p>
                    {contract.ratingEvaluated ? (
                      <Lock size={10} className="text-muted-foreground" />
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedContract(contract);
                          setTempRatings(contract.ratings);
                          setRatingObservation(contract.ratingObservation || "");
                          setRatingsModalOpen(true);
                        }}
                        className="h-auto p-0 text-[10px] text-foreground hover:text-foreground/70 flex items-center gap-1"
                      >
                        <Edit3 size={10} />
                        Avaliar
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-[10px]">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Forn.</span>
                      <StarRating rating={contract.ratings.supplier} />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Entr.</span>
                      <StarRating rating={contract.ratings.delivery} />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Qual.</span>
                      <StarRating rating={contract.ratings.quality} />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Relac.</span>
                      <StarRating rating={contract.ratings.relationship} />
                    </div>
                  </div>
                  {contract.ratingEvaluated && contract.ratingObservation && (
                    <p className="text-[10px] text-muted-foreground mt-1.5 italic">
                      "{contract.ratingObservation}"
                    </p>
                  )}
                </div>

                {/* Links - Push to bottom with mt-auto */}
                <div className="flex items-center justify-between mt-auto">
                  <a
                    href={contract.pncpLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-foreground hover:underline flex items-center gap-1"
                  >
                    <ExternalLink size={10} />
                    PNCP
                  </a>
                  {contract.attachments.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedContract(contract);
                        setAttachmentsModalOpen(true);
                      }}
                      className="h-auto p-0 text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1"
                    >
                      <Download size={10} />
                      {contract.attachments.length} anexo{contract.attachments.length > 1 ? 's' : ''}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {sortedContracts.map((contract) => (
              <div
                key={contract.id}
                className="border border-border rounded-full p-3 px-4 hover:border-foreground transition-colors bg-background flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="min-w-[100px]">
                    <p className="text-xs font-semibold text-foreground">
                      {contract.processNumber}
                    </p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {contract.mainObject}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {contract.supplier.name}
                    </p>
                  </div>
                  <div className="min-w-[120px]">
                    <p className="text-lg font-bold text-foreground text-right">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }).format(contract.totalValue)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] h-5 rounded-full border-foreground/20">
                      {getStatusLabel(contract.status)}
                    </Badge>
                    {contract.status === "vencimento_proximo" && (
                      <AlertCircle size={14} className="text-foreground" />
                    )}
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-7 shrink-0 rounded-full hover:bg-muted">
                      <MoreVertical size={14} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <RefreshCw size={12} className="mr-2" />
                      Renovar
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <XCircle size={12} className="mr-2" />
                      Encerrar
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Plus size={12} className="mr-2" />
                      Nova Licitação
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Ratings Evaluation Modal */}
      <Dialog open={ratingsModalOpen} onOpenChange={setRatingsModalOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Star size={16} />
              Avaliar Contrato
            </DialogTitle>
            {selectedContract && (
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground leading-tight">
                  {selectedContract.mainObject}
                </p>
                <p className="text-xs font-medium text-foreground">
                  {selectedContract.supplier.name}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {selectedContract.processNumber}
                </p>
              </div>
            )}
          </DialogHeader>
          <div className="space-y-3 mt-3">
            {/* Ratings Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">
                  Fornecedor
                </label>
                <InteractiveStarRating
                  rating={tempRatings.supplier}
                  onRatingChange={(rating) =>
                    setTempRatings({ ...tempRatings, supplier: rating })
                  }
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">
                  Entrega
                </label>
                <InteractiveStarRating
                  rating={tempRatings.delivery}
                  onRatingChange={(rating) =>
                    setTempRatings({ ...tempRatings, delivery: rating })
                  }
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">
                  Qualidade
                </label>
                <InteractiveStarRating
                  rating={tempRatings.quality}
                  onRatingChange={(rating) =>
                    setTempRatings({ ...tempRatings, quality: rating })
                  }
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">
                  Relacionamento
                </label>
                <InteractiveStarRating
                  rating={tempRatings.relationship}
                  onRatingChange={(rating) =>
                    setTempRatings({ ...tempRatings, relationship: rating })
                  }
                />
              </div>
            </div>

            {/* Observation Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Observações (opcional)
              </label>
              <Textarea
                placeholder="Digite suas observações..."
                value={ratingObservation}
                onChange={(e) => setRatingObservation(e.target.value)}
                className="min-h-[60px] rounded-2xl text-xs"
              />
            </div>
          </div>

          <DialogFooter className="gap-3 mt-4 sm:justify-center">
            <Button
              variant="outline"
              onClick={() => setRatingsModalOpen(false)}
              className="rounded-full text-xs h-9 px-6"
            >
              Cancelar
            </Button>
            <Button
              onClick={() => {
                if (selectedContract) {
                  // In a real app, this would update the contract in the database
                  selectedContract.ratings = tempRatings;
                  selectedContract.ratingEvaluated = true;
                  selectedContract.ratingObservation = ratingObservation;
                  selectedContract.ratingDate = new Date().toLocaleDateString('pt-BR');
                  selectedContract.ratingUser = "Bernardo Aguiar";
                }
                setRatingsModalOpen(false);
              }}
              disabled={
                tempRatings.supplier === 0 ||
                tempRatings.delivery === 0 ||
                tempRatings.quality === 0 ||
                tempRatings.relationship === 0
              }
              className="rounded-full bg-foreground text-white hover:bg-foreground/90 text-xs h-9 px-6"
            >
              Confirmar Avaliação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Attachments Modal */}
      <Dialog open={attachmentsModalOpen} onOpenChange={setAttachmentsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <File size={20} />
              Anexos do Processo
            </DialogTitle>
            <DialogDescription>
              {selectedContract && (
                <div className="mt-2">
                  <p className="font-medium text-foreground">{selectedContract.processNumber}</p>
                  <p className="text-xs text-muted-foreground">{selectedContract.mainObject}</p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 mt-4">
            {selectedContract?.attachments.map((attachment, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 border border-border rounded-2xl hover:border-foreground transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="size-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <File size={16} className="text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-foreground truncate">
                    {attachment.name}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 rounded-full hover:bg-muted"
                    onClick={() => window.open(attachment.url, '_blank')}
                  >
                    <Eye size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 rounded-full hover:bg-muted"
                    asChild
                  >
                    <a href={attachment.url} download={attachment.name}>
                      <Download size={16} />
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* New Contract Modal */}
      <Dialog open={newContractModalOpen} onOpenChange={setNewContractModalOpen}>
        <DialogContent className="max-w-2xl rounded-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Novo Contrato</DialogTitle>
            <DialogDescription>
              Preencha os dados do contrato para cadastro
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">N do Processo</label>
              <Input
                placeholder="Ex: 2025/0001"
                value={newContract.processNumber}
                onChange={(e) => setNewContract({ ...newContract, processNumber: e.target.value })}
                className="rounded-full"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">N da Licitacao</label>
              <Input
                placeholder="Ex: PE/2025/0001"
                value={newContract.bidNumber}
                onChange={(e) => setNewContract({ ...newContract, bidNumber: e.target.value })}
                className="rounded-full"
              />
            </div>
            <div className="col-span-2 space-y-2">
              <label className="text-xs text-muted-foreground">Objeto Principal</label>
              <Textarea
                placeholder="Descreva o objeto do contrato..."
                value={newContract.mainObject}
                onChange={(e) => setNewContract({ ...newContract, mainObject: e.target.value })}
                className="rounded-2xl min-h-[80px]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Tipo de Compra</label>
              <Input
                placeholder="Ex: Pregao Eletronico"
                value={newContract.purchaseType}
                onChange={(e) => setNewContract({ ...newContract, purchaseType: e.target.value })}
                className="rounded-full"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Valor Total</label>
              <Input
                placeholder="Ex: 150000.00"
                type="number"
                value={newContract.totalValue}
                onChange={(e) => setNewContract({ ...newContract, totalValue: e.target.value })}
                className="rounded-full"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Fornecedor</label>
              <Input
                placeholder="Razao Social"
                value={newContract.supplierName}
                onChange={(e) => setNewContract({ ...newContract, supplierName: e.target.value })}
                className="rounded-full"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">CNPJ do Fornecedor</label>
              <Input
                placeholder="00.000.000/0001-00"
                value={newContract.supplierCnpj}
                onChange={(e) => setNewContract({ ...newContract, supplierCnpj: e.target.value })}
                className="rounded-full"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Inicio do Contrato</label>
              <Input
                type="date"
                value={newContract.contractStart}
                onChange={(e) => setNewContract({ ...newContract, contractStart: e.target.value })}
                className="rounded-full"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Fim do Contrato</label>
              <Input
                type="date"
                value={newContract.contractEnd}
                onChange={(e) => setNewContract({ ...newContract, contractEnd: e.target.value })}
                className="rounded-full"
              />
            </div>
            <div className="col-span-2 space-y-2">
              <label className="text-xs text-muted-foreground">Observacoes</label>
              <Textarea
                placeholder="Observacoes adicionais..."
                value={newContract.observations}
                onChange={(e) => setNewContract({ ...newContract, observations: e.target.value })}
                className="rounded-2xl min-h-[60px]"
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setNewContractModalOpen(false)}
              className="rounded-full"
            >
              Cancelar
            </Button>
            <Button
              onClick={() => {
                // TODO: Integrate with backend
                setNewContractModalOpen(false);
                setNewContract({
                  processNumber: "",
                  bidNumber: "",
                  mainObject: "",
                  purchaseType: "",
                  supplierName: "",
                  supplierCnpj: "",
                  contractStart: "",
                  contractEnd: "",
                  totalValue: "",
                  observations: "",
                });
              }}
              className="rounded-full bg-foreground text-white hover:bg-foreground/90"
            >
              Cadastrar Contrato
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
