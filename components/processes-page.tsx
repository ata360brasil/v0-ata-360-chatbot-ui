"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  MoreVertical,
  Plus,
  LayoutGrid,
  List,
  ArrowUpDown,
  Kanban,
  FolderOpen,
  File,
  Upload,
  Eye,
  Download,
  Trash2,
  Edit3,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Phase definitions for public procurement
const phases = [
  { id: "planejamento", label: "Planejamento" },
  { id: "execucao", label: "Execução" },
  { id: "licitacao", label: "Licitação" },
  { id: "contrato", label: "Contrato" },
  { id: "empenho", label: "Empenho" },
  { id: "recebimento", label: "Recebimento" },
  { id: "avaliacao", label: "Avaliação" },
];

interface ProcessFolder {
  phaseId: string;
  files: Array<{ name: string; url: string; uploadDate: string }>;
}

interface Process {
  id: string;
  processNumber: string;
  title: string;
  department: string;
  estimatedValue: number;
  currentPhase: string;
  status: "em_andamento" | "aguardando" | "concluido";
  createdAt: string;
  updatedAt: string;
  folders: ProcessFolder[];
}

const mockProcesses: Process[] = [
  {
    id: "1",
    processNumber: "2025/0001",
    title: "Aquisição de Equipamentos de Informática",
    department: "Secretaria de Administração",
    estimatedValue: 250000,
    currentPhase: "licitacao",
    status: "em_andamento",
    createdAt: "10/01/2025",
    updatedAt: "02/02/2025",
    folders: [
      { phaseId: "planejamento", files: [{ name: "ETP.pdf", url: "#", uploadDate: "10/01/2025" }, { name: "TR.pdf", url: "#", uploadDate: "12/01/2025" }] },
      { phaseId: "execucao", files: [{ name: "Pesquisa_Precos.xlsx", url: "#", uploadDate: "15/01/2025" }] },
      { phaseId: "licitacao", files: [{ name: "Edital.pdf", url: "#", uploadDate: "20/01/2025" }] },
      { phaseId: "contrato", files: [] },
      { phaseId: "empenho", files: [] },
      { phaseId: "recebimento", files: [] },
      { phaseId: "avaliacao", files: [] },
    ],
  },
  {
    id: "2",
    processNumber: "2025/0002",
    title: "Reforma do Prédio da Prefeitura",
    department: "Secretaria de Obras",
    estimatedValue: 1500000,
    currentPhase: "planejamento",
    status: "em_andamento",
    createdAt: "15/01/2025",
    updatedAt: "01/02/2025",
    folders: [
      { phaseId: "planejamento", files: [{ name: "Projeto_Basico.pdf", url: "#", uploadDate: "15/01/2025" }] },
      { phaseId: "execucao", files: [] },
      { phaseId: "licitacao", files: [] },
      { phaseId: "contrato", files: [] },
      { phaseId: "empenho", files: [] },
      { phaseId: "recebimento", files: [] },
      { phaseId: "avaliacao", files: [] },
    ],
  },
  {
    id: "3",
    processNumber: "2024/0198",
    title: "Contratação de Serviços de Limpeza",
    department: "Secretaria de Administração",
    estimatedValue: 480000,
    currentPhase: "contrato",
    status: "em_andamento",
    createdAt: "01/11/2024",
    updatedAt: "30/01/2025",
    folders: [
      { phaseId: "planejamento", files: [{ name: "ETP.pdf", url: "#", uploadDate: "01/11/2024" }, { name: "TR.pdf", url: "#", uploadDate: "05/11/2024" }] },
      { phaseId: "execucao", files: [{ name: "Pesquisa.pdf", url: "#", uploadDate: "10/11/2024" }] },
      { phaseId: "licitacao", files: [{ name: "Edital.pdf", url: "#", uploadDate: "20/11/2024" }, { name: "Ata_Sessao.pdf", url: "#", uploadDate: "10/12/2024" }] },
      { phaseId: "contrato", files: [{ name: "Contrato.pdf", url: "#", uploadDate: "15/01/2025" }] },
      { phaseId: "empenho", files: [] },
      { phaseId: "recebimento", files: [] },
      { phaseId: "avaliacao", files: [] },
    ],
  },
  {
    id: "4",
    processNumber: "2024/0156",
    title: "Aquisição de Veículos para Saúde",
    department: "Secretaria de Saúde",
    estimatedValue: 850000,
    currentPhase: "empenho",
    status: "em_andamento",
    createdAt: "15/09/2024",
    updatedAt: "28/01/2025",
    folders: [
      { phaseId: "planejamento", files: [{ name: "ETP.pdf", url: "#", uploadDate: "15/09/2024" }] },
      { phaseId: "execucao", files: [{ name: "Pesquisa.xlsx", url: "#", uploadDate: "20/09/2024" }] },
      { phaseId: "licitacao", files: [{ name: "Edital.pdf", url: "#", uploadDate: "01/10/2024" }] },
      { phaseId: "contrato", files: [{ name: "Contrato.pdf", url: "#", uploadDate: "15/11/2024" }] },
      { phaseId: "empenho", files: [{ name: "Nota_Empenho.pdf", url: "#", uploadDate: "20/01/2025" }] },
      { phaseId: "recebimento", files: [] },
      { phaseId: "avaliacao", files: [] },
    ],
  },
  {
    id: "5",
    processNumber: "2024/0134",
    title: "Medicamentos e Insumos Hospitalares",
    department: "Secretaria de Saúde",
    estimatedValue: 2200000,
    currentPhase: "recebimento",
    status: "em_andamento",
    createdAt: "01/08/2024",
    updatedAt: "25/01/2025",
    folders: [
      { phaseId: "planejamento", files: [{ name: "ETP.pdf", url: "#", uploadDate: "01/08/2024" }] },
      { phaseId: "execucao", files: [{ name: "Pesquisa.xlsx", url: "#", uploadDate: "10/08/2024" }] },
      { phaseId: "licitacao", files: [{ name: "Edital_SRP.pdf", url: "#", uploadDate: "01/09/2024" }] },
      { phaseId: "contrato", files: [{ name: "Ata_SRP.pdf", url: "#", uploadDate: "01/10/2024" }] },
      { phaseId: "empenho", files: [{ name: "Empenho_01.pdf", url: "#", uploadDate: "15/10/2024" }] },
      { phaseId: "recebimento", files: [{ name: "Nota_Fiscal.pdf", url: "#", uploadDate: "20/01/2025" }] },
      { phaseId: "avaliacao", files: [] },
    ],
  },
  {
    id: "6",
    processNumber: "2024/0089",
    title: "Manutenção de Ar Condicionado",
    department: "Secretaria de Administração",
    estimatedValue: 120000,
    currentPhase: "avaliacao",
    status: "concluido",
    createdAt: "01/06/2024",
    updatedAt: "20/01/2025",
    folders: [
      { phaseId: "planejamento", files: [{ name: "ETP.pdf", url: "#", uploadDate: "01/06/2024" }] },
      { phaseId: "execucao", files: [{ name: "Pesquisa.pdf", url: "#", uploadDate: "10/06/2024" }] },
      { phaseId: "licitacao", files: [{ name: "Edital.pdf", url: "#", uploadDate: "01/07/2024" }] },
      { phaseId: "contrato", files: [{ name: "Contrato.pdf", url: "#", uploadDate: "01/08/2024" }] },
      { phaseId: "empenho", files: [{ name: "Empenho.pdf", url: "#", uploadDate: "15/08/2024" }] },
      { phaseId: "recebimento", files: [{ name: "Termo_Recebimento.pdf", url: "#", uploadDate: "01/12/2024" }] },
      { phaseId: "avaliacao", files: [{ name: "Avaliacao.pdf", url: "#", uploadDate: "15/01/2025" }] },
    ],
  },
  {
    id: "7",
    processNumber: "2025/0003",
    title: "Material de Expediente",
    department: "Secretaria de Educação",
    estimatedValue: 85000,
    currentPhase: "execucao",
    status: "em_andamento",
    createdAt: "20/01/2025",
    updatedAt: "01/02/2025",
    folders: [
      { phaseId: "planejamento", files: [{ name: "ETP.pdf", url: "#", uploadDate: "20/01/2025" }, { name: "TR.pdf", url: "#", uploadDate: "22/01/2025" }] },
      { phaseId: "execucao", files: [{ name: "Pesquisa_Mercado.xlsx", url: "#", uploadDate: "28/01/2025" }] },
      { phaseId: "licitacao", files: [] },
      { phaseId: "contrato", files: [] },
      { phaseId: "empenho", files: [] },
      { phaseId: "recebimento", files: [] },
      { phaseId: "avaliacao", files: [] },
    ],
  },
  {
    id: "8",
    processNumber: "2025/0004",
    title: "Serviços de Segurança Patrimonial",
    department: "Secretaria de Administração",
    estimatedValue: 960000,
    currentPhase: "planejamento",
    status: "aguardando",
    createdAt: "25/01/2025",
    updatedAt: "30/01/2025",
    folders: [
      { phaseId: "planejamento", files: [{ name: "Estudo_Preliminar.docx", url: "#", uploadDate: "25/01/2025" }] },
      { phaseId: "execucao", files: [] },
      { phaseId: "licitacao", files: [] },
      { phaseId: "contrato", files: [] },
      { phaseId: "empenho", files: [] },
      { phaseId: "recebimento", files: [] },
      { phaseId: "avaliacao", files: [] },
    ],
  },
  {
    id: "9",
    processNumber: "2024/0201",
    title: "Uniformes Escolares",
    department: "Secretaria de Educação",
    estimatedValue: 320000,
    currentPhase: "licitacao",
    status: "em_andamento",
    createdAt: "01/12/2024",
    updatedAt: "02/02/2025",
    folders: [
      { phaseId: "planejamento", files: [{ name: "ETP.pdf", url: "#", uploadDate: "01/12/2024" }] },
      { phaseId: "execucao", files: [{ name: "Pesquisa.pdf", url: "#", uploadDate: "10/12/2024" }] },
      { phaseId: "licitacao", files: [{ name: "Edital.pdf", url: "#", uploadDate: "20/12/2024" }, { name: "Impugnacao.pdf", url: "#", uploadDate: "05/01/2025" }] },
      { phaseId: "contrato", files: [] },
      { phaseId: "empenho", files: [] },
      { phaseId: "recebimento", files: [] },
      { phaseId: "avaliacao", files: [] },
    ],
  },
  {
    id: "10",
    processNumber: "2024/0178",
    title: "Combustíveis para Frota Municipal",
    department: "Secretaria de Administração",
    estimatedValue: 1800000,
    currentPhase: "contrato",
    status: "em_andamento",
    createdAt: "01/10/2024",
    updatedAt: "28/01/2025",
    folders: [
      { phaseId: "planejamento", files: [{ name: "ETP.pdf", url: "#", uploadDate: "01/10/2024" }] },
      { phaseId: "execucao", files: [{ name: "Pesquisa_ANP.pdf", url: "#", uploadDate: "10/10/2024" }] },
      { phaseId: "licitacao", files: [{ name: "Edital_SRP.pdf", url: "#", uploadDate: "01/11/2024" }] },
      { phaseId: "contrato", files: [{ name: "Ata_Registro.pdf", url: "#", uploadDate: "20/01/2025" }] },
      { phaseId: "empenho", files: [] },
      { phaseId: "recebimento", files: [] },
      { phaseId: "avaliacao", files: [] },
    ],
  },
  {
    id: "11",
    processNumber: "2025/0005",
    title: "Locação de Impressoras",
    department: "Secretaria de Administração",
    estimatedValue: 180000,
    currentPhase: "planejamento",
    status: "em_andamento",
    createdAt: "28/01/2025",
    updatedAt: "02/02/2025",
    folders: [
      { phaseId: "planejamento", files: [{ name: "DFD.pdf", url: "#", uploadDate: "28/01/2025" }] },
      { phaseId: "execucao", files: [] },
      { phaseId: "licitacao", files: [] },
      { phaseId: "contrato", files: [] },
      { phaseId: "empenho", files: [] },
      { phaseId: "recebimento", files: [] },
      { phaseId: "avaliacao", files: [] },
    ],
  },
  {
    id: "12",
    processNumber: "2024/0145",
    title: "Merenda Escolar - Gêneros Alimentícios",
    department: "Secretaria de Educação",
    estimatedValue: 750000,
    currentPhase: "empenho",
    status: "em_andamento",
    createdAt: "15/08/2024",
    updatedAt: "30/01/2025",
    folders: [
      { phaseId: "planejamento", files: [{ name: "ETP.pdf", url: "#", uploadDate: "15/08/2024" }] },
      { phaseId: "execucao", files: [{ name: "Pesquisa.pdf", url: "#", uploadDate: "25/08/2024" }] },
      { phaseId: "licitacao", files: [{ name: "Chamada_Publica.pdf", url: "#", uploadDate: "01/09/2024" }] },
      { phaseId: "contrato", files: [{ name: "Contrato.pdf", url: "#", uploadDate: "01/11/2024" }] },
      { phaseId: "empenho", files: [{ name: "Empenho_01.pdf", url: "#", uploadDate: "15/01/2025" }, { name: "Empenho_02.pdf", url: "#", uploadDate: "30/01/2025" }] },
      { phaseId: "recebimento", files: [] },
      { phaseId: "avaliacao", files: [] },
    ],
  },
];

type ViewType = "cards" | "list";
type SortType = "process" | "title" | "date" | "value" | "phase";

export function ProcessesPage() {
  const [viewType, setViewType] = useState<ViewType>("cards");
  const [sortBy, setSortBy] = useState<SortType>("process");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null);
  const [foldersModalOpen, setFoldersModalOpen] = useState(false);
  const [newProcessModalOpen, setNewProcessModalOpen] = useState(false);
  const [newProcessTitle, setNewProcessTitle] = useState("");
  const [newProcessDepartment, setNewProcessDepartment] = useState("");
  const [newProcessValue, setNewProcessValue] = useState("");

  const filteredProcesses = mockProcesses.filter((process) => {
    return (
      process.processNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      process.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      process.department.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const sortedProcesses = [...filteredProcesses].sort((a, b) => {
    switch (sortBy) {
      case "title":
        return a.title.localeCompare(b.title);
      case "date":
        return b.updatedAt.localeCompare(a.updatedAt);
      case "value":
        return b.estimatedValue - a.estimatedValue;
      case "phase":
        const phaseA = phases.findIndex(p => p.id === a.currentPhase);
        const phaseB = phases.findIndex(p => p.id === b.currentPhase);
        return phaseA - phaseB;
      case "process":
      default:
        return b.processNumber.localeCompare(a.processNumber);
    }
  });

  const getPhaseLabel = (phaseId: string) => {
    return phases.find(p => p.id === phaseId)?.label || phaseId;
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "aguardando":
        return "Aguardando";
      case "concluido":
        return "Concluído";
      case "em_andamento":
      default:
        return "Em andamento";
    }
  };

  const getTotalFiles = (process: Process) => {
    return process.folders.reduce((acc, folder) => acc + folder.files.length, 0);
  };

  const getCompletedPhases = (process: Process) => {
    const currentPhaseIndex = phases.findIndex(p => p.id === process.currentPhase);
    return currentPhaseIndex + 1;
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b border-border/30 p-4">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Kanban size={20} />
            Processos em Andamento
          </h1>
          <div className="flex items-center gap-2">
            {/* New Process Button */}
            <Button
              onClick={() => setNewProcessModalOpen(true)}
              className="gap-2 h-9 rounded-full bg-foreground text-background hover:bg-foreground/90"
            >
              <Plus size={14} />
              Nova Pasta
            </Button>

            {/* View Type Icons */}
            <div className="flex items-center gap-1 border border-border rounded-full p-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewType("cards")}
                className={cn(
                  "size-7 rounded-full hover:bg-muted",
                  viewType === "cards" && "bg-foreground text-background hover:bg-foreground/90"
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
                  viewType === "list" && "bg-foreground text-background hover:bg-foreground/90"
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
                  Nº Processo
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("title")}>
                  Título
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("date")}>
                  Atualização
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("value")}>
                  Valor
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("phase")}>
                  Fase
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
            placeholder="Buscar por número, título ou departamento..."
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
            {sortedProcesses.map((process) => (
              <div
                key={process.id}
                className="border border-border rounded-3xl p-3 hover:border-foreground transition-colors bg-background flex flex-col cursor-pointer"
                onClick={() => {
                  setSelectedProcess(process);
                  setFoldersModalOpen(true);
                }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-2 gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground leading-tight mb-0.5">
                      {process.title}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {process.processNumber}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="size-6 shrink-0 rounded-full hover:bg-muted"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical size={14} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit3 size={12} className="mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Upload size={12} className="mr-2" />
                        Adicionar arquivo
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-500">
                        <Trash2 size={12} className="mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Value */}
                <div className="mb-2 pb-2 border-b border-border/30">
                  <p className="text-xl font-bold text-foreground">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(process.estimatedValue)}
                  </p>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-1.5 mb-2">
                  <Badge variant="outline" className="text-[10px] h-5 rounded-full border-foreground/20">
                    {getPhaseLabel(process.currentPhase)}
                  </Badge>
                  <Badge variant="outline" className="text-[10px] h-5 rounded-full border-foreground/20">
                    {getStatusLabel(process.status)}
                  </Badge>
                </div>

                {/* Department */}
                <div className="mb-2 pb-2 border-b border-border/30">
                  <p className="text-[10px] text-muted-foreground mb-0.5">Departamento</p>
                  <p className="text-xs font-medium text-foreground leading-tight">
                    {process.department}
                  </p>
                </div>

                {/* Phase Progress and Files */}
                <div className="mb-2 pb-2 border-b border-border/30">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-[10px] text-muted-foreground mb-0.5">Progresso</p>
                      <p className="text-xs font-medium text-foreground">{getCompletedPhases(process)}/7 fases</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-muted-foreground mb-0.5">Arquivos</p>
                      <p className="text-xs font-medium text-foreground">{getTotalFiles(process)}</p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Calendar size={10} />
                    {process.updatedAt}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProcess(process);
                      setFoldersModalOpen(true);
                    }}
                    className="h-auto p-0 text-[10px] text-foreground hover:text-foreground/70 flex items-center gap-1"
                  >
                    <FolderOpen size={10} />
                    Pastas
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {sortedProcesses.map((process) => (
              <div
                key={process.id}
                className="border border-border rounded-full p-3 px-4 hover:border-foreground transition-colors bg-background flex items-center justify-between gap-4 cursor-pointer"
                onClick={() => {
                  setSelectedProcess(process);
                  setFoldersModalOpen(true);
                }}
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="min-w-[80px]">
                    <p className="text-xs font-semibold text-foreground">
                      {process.processNumber}
                    </p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {process.title}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {process.department}
                    </p>
                  </div>
                  <div className="min-w-[120px]">
                    <p className="text-lg font-bold text-foreground text-right">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }).format(process.estimatedValue)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] h-5 rounded-full border-foreground/20">
                      {getPhaseLabel(process.currentPhase)}
                    </Badge>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="size-7 shrink-0 rounded-full hover:bg-muted"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical size={14} />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Folders Modal */}
      <Dialog open={foldersModalOpen} onOpenChange={setFoldersModalOpen}>
        <DialogContent className="sm:max-w-[550px] max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <FolderOpen size={16} />
              Pastas do Processo
            </DialogTitle>
            {selectedProcess && (
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground leading-tight">
                  {selectedProcess.title}
                </p>
                <p className="text-xs font-medium text-foreground">
                  {selectedProcess.department}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {selectedProcess.processNumber}
                </p>
              </div>
            )}
          </DialogHeader>
          <div className="flex-1 overflow-auto space-y-2 mt-3">
            {phases.map((phase, index) => {
              const folder = selectedProcess?.folders.find(f => f.phaseId === phase.id);
              const isCurrentPhase = selectedProcess?.currentPhase === phase.id;
              const currentPhaseIndex = phases.findIndex(p => p.id === selectedProcess?.currentPhase);
              const isCompleted = index < currentPhaseIndex;
              
              return (
                <div
                  key={phase.id}
                  className={cn(
                    "border rounded-2xl p-3 transition-colors",
                    isCurrentPhase ? "border-foreground bg-muted/30" : "border-border hover:border-foreground/50"
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "size-6 rounded-full flex items-center justify-center text-[10px] font-bold",
                        isCompleted || isCurrentPhase ? "bg-foreground text-background" : "bg-muted text-muted-foreground"
                      )}>
                        {index + 1}
                      </div>
                      <span className="text-sm font-medium text-foreground">{phase.label}</span>
                      {isCurrentPhase && (
                        <Badge variant="outline" className="text-[9px] h-4 rounded-full border-foreground">
                          Atual
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 rounded-full hover:bg-muted"
                    >
                      <Upload size={14} />
                    </Button>
                  </div>
                  
                  {folder && folder.files.length > 0 ? (
                    <div className="space-y-1.5">
                      {folder.files.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 bg-background border border-border/50 rounded-xl"
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <File size={14} className="text-muted-foreground shrink-0" />
                            <span className="text-xs text-foreground truncate">{file.name}</span>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <span className="text-[9px] text-muted-foreground mr-2">{file.uploadDate}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-6 rounded-full hover:bg-muted"
                            >
                              <Eye size={12} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-6 rounded-full hover:bg-muted"
                            >
                              <Download size={12} />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[10px] text-muted-foreground italic">Nenhum arquivo nesta fase</p>
                  )}
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* New Process Modal */}
      <Dialog open={newProcessModalOpen} onOpenChange={setNewProcessModalOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Plus size={16} />
              Nova Pasta de Processo
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Crie uma nova pasta para organizar os documentos do processo.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Título do Processo
              </label>
              <Input
                placeholder="Ex: Aquisição de Equipamentos..."
                value={newProcessTitle}
                onChange={(e) => setNewProcessTitle(e.target.value)}
                className="rounded-full text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Departamento
              </label>
              <Input
                placeholder="Ex: Secretaria de Administração"
                value={newProcessDepartment}
                onChange={(e) => setNewProcessDepartment(e.target.value)}
                className="rounded-full text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Valor Estimado
              </label>
              <Input
                placeholder="Ex: 250000"
                type="number"
                value={newProcessValue}
                onChange={(e) => setNewProcessValue(e.target.value)}
                className="rounded-full text-sm"
              />
            </div>
          </div>
          <DialogFooter className="gap-3 mt-4 sm:justify-center">
            <Button
              variant="outline"
              onClick={() => setNewProcessModalOpen(false)}
              className="rounded-full text-xs h-9 px-6"
            >
              Cancelar
            </Button>
            <Button
              onClick={() => {
                setNewProcessModalOpen(false);
                setNewProcessTitle("");
                setNewProcessDepartment("");
                setNewProcessValue("");
              }}
              disabled={!newProcessTitle || !newProcessDepartment}
              className="rounded-full bg-foreground text-background hover:bg-foreground/90 text-xs h-9 px-6"
            >
              Criar Pasta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
