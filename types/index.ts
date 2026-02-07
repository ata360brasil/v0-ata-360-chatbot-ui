import React from "react"
// Shared types for ATA360 application

// Common types
export type ViewType = "grid" | "list" | "cards" | "kanban";
export type SortDirection = "asc" | "desc";

// Permissions interface used across the app
export interface Permissions {
  create: boolean;
  modify: boolean;
  sign: boolean;
  include: boolean;
  exclude: boolean;
  evaluate: boolean;
}

// Document/Attachment interface
export interface Document {
  name: string;
  type: string;
  url: string;
  uploadDate?: string;
}

// ===== Contracts Types =====
export type ContractStatus = "ativo" | "vencimento_proximo" | "vencido";

export interface ContractSupplier {
  name: string;
  cnpj: string;
}

export interface ContractRatings {
  supplier: number;
  delivery: number;
  quality: number;
  relationship: number;
}

export interface Contract {
  id: string;
  processNumber: string;
  bidNumber: string;
  mainObject: string;
  purchaseType: string;
  status: ContractStatus;
  supplier: ContractSupplier;
  contractStart: string;
  contractEnd: string;
  homologationDate: string;
  totalValue: number;
  itemsCount: number;
  observations: string;
  ratings: ContractRatings;
  ratingEvaluated?: boolean;
  ratingObservation?: string;
  ratingDate?: string;
  ratingUser?: string;
  attachments: Array<{ name: string; url: string }>;
  pncpLink: string;
}

// ===== Processes Types =====
export type ProcessStatus = "em_andamento" | "aguardando" | "concluido";
export type ProcessPhaseId = "planejamento" | "execucao" | "licitacao" | "contrato" | "empenho" | "recebimento" | "avaliacao";

export interface ProcessPhase {
  id: ProcessPhaseId;
  label: string;
}

export interface ProcessFolder {
  phaseId: string;
  files: Array<{ name: string; url: string; uploadDate: string }>;
}

export interface Process {
  id: string;
  processNumber: string;
  title: string;
  department: string;
  estimatedValue: number;
  currentPhase: ProcessPhaseId;
  status: ProcessStatus;
  createdAt: string;
  updatedAt: string;
  folders: ProcessFolder[];
}

// ===== Team Members Types =====
export type MemberType = "admin" | "member";
export type MemberStatus = "active" | "inactive" | "blocked" | "pending";
export type ApprovalMethod = "adm_local" | "adm_global" | "invite" | "request";

export interface TeamMember {
  id: string;
  fullName: string;
  cpf: string;
  rg: string;
  matricula: string;
  professionalCard?: string;
  position: string;
  role: string;
  sector: string;
  isCommissioned: boolean;
  email: string;
  email2?: string;
  phone: string;
  whatsapp?: string;
  birthday: string;
  photo?: string;
  memberType: MemberType;
  datavalidVerified: boolean;
  status: MemberStatus;
  approvalMethod: ApprovalMethod;
  isOnline: boolean;
  permissions: Permissions;
  documents: Document[];
  joinedAt: string;
}

// ===== Files Types =====
export type FileType = "folder" | "document" | "image" | "spreadsheet" | "archive" | "other";
export type FileSortType = "name" | "date" | "size" | "type";

export interface FileItem {
  id: string;
  name: string;
  type: FileType;
  size?: string;
  description: string;
  createdAt: string;
  modifiedAt: string;
  owner: string;
  shared: boolean;
  sharedWith?: string[];
  parentFolder?: string;
  itemCount?: number;
}

// ===== Page Header Types =====
export interface PageHeaderAction {
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  onClick: () => void;
  variant?: "default" | "outline";
}

export interface PageHeaderSortOption {
  value: string;
  label: string;
}

export interface PageHeaderProps {
  title: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  viewType: ViewType;
  onViewTypeChange: (type: ViewType) => void;
  sortOptions: PageHeaderSortOption[];
  currentSort: string;
  onSortChange: (sort: string) => void;
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  primaryAction?: PageHeaderAction;
  statsContent?: React.ReactNode;
  viewTypes?: ViewType[];
}
