"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
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
import { Label } from "@/components/ui/label";
import {
  Search,
  MoreVertical,
  Plus,
  LayoutGrid,
  List,
  ArrowUpDown,
  Users,
  UserPlus,
  Mail,
  Link2,
  Shield,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Camera,
  Upload,
  Eye,
  Trash2,
  Edit3,
  Copy,
  FileText,
  Building2,
  BadgeCheck,
  UserCog,
  Phone,
  Cake,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TeamMember {
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
  memberType: "admin" | "member";
  datavalidVerified: boolean;
  status: "active" | "inactive" | "blocked" | "pending";
  approvalMethod: "adm_local" | "adm_global" | "invite" | "request";
  isOnline: boolean;
  permissions: {
    create: boolean;
    modify: boolean;
    sign: boolean;
    include: boolean;
    exclude: boolean;
    evaluate: boolean;
  };
  documents: Array<{ name: string; type: string; url: string }>;
  joinedAt: string;
}

const mockTeamMembers: TeamMember[] = [
  {
    id: "1",
    fullName: "Bernardo Aguiar",
    cpf: "123.456.789-00",
    rg: "MG-12.345.678",
    matricula: "ADM-001",
    professionalCard: "CRA-MG 12345",
    position: "Diretor de Compras",
    role: "Administrador Local",
    sector: "Diretoria de Licitações",
    isCommissioned: true,
    email: "bernardo@orgao.gov.br",
    email2: "bernardo.aguiar@gmail.com",
    phone: "(31) 3333-0001",
    whatsapp: "(31) 99999-0001",
    birthday: "04/02",
    photo: "/images/whatsapp-20image-202025-10-15-20at-2016.jpeg",
    memberType: "admin",
    datavalidVerified: true,
    status: "active",
    approvalMethod: "adm_global",
    isOnline: true,
    permissions: {
      create: true,
      modify: true,
      sign: true,
      include: true,
      exclude: true,
      evaluate: true,
    },
    documents: [
      { name: "RG_Bernardo.pdf", type: "RG", url: "#" },
      { name: "CPF_Bernardo.pdf", type: "CPF", url: "#" },
    ],
    joinedAt: "01/01/2024",
  },
  {
    id: "2",
    fullName: "Maria Clara Santos",
    cpf: "234.567.890-11",
    rg: "MG-23.456.789",
    matricula: "SRV-045",
    position: "Pregoeira",
    role: "Membro",
    sector: "Setor de Licitações",
    isCommissioned: false,
    email: "maria.clara@orgao.gov.br",
    phone: "(31) 3333-0002",
    whatsapp: "(31) 99999-0002",
    birthday: "15/03",
    memberType: "member",
    datavalidVerified: true,
    status: "active",
    approvalMethod: "adm_local",
    isOnline: true,
    permissions: {
      create: true,
      modify: true,
      sign: true,
      include: false,
      exclude: false,
      evaluate: true,
    },
    documents: [
      { name: "RG_Maria.pdf", type: "RG", url: "#" },
    ],
    joinedAt: "15/02/2024",
  },
  {
    id: "3",
    fullName: "João Pedro Oliveira",
    cpf: "345.678.901-22",
    rg: "MG-34.567.890",
    matricula: "SRV-078",
    professionalCard: "OAB-MG 98765",
    position: "Assessor Jurídico",
    role: "Membro",
    sector: "Procuradoria",
    isCommissioned: true,
    email: "joao.pedro@orgao.gov.br",
    email2: "jp.oliveira@adv.com.br",
    phone: "(31) 3333-0003",
    whatsapp: "(31) 99999-0003",
    birthday: "22/07",
    memberType: "member",
    datavalidVerified: true,
    status: "active",
    approvalMethod: "invite",
    isOnline: false,
    permissions: {
      create: false,
      modify: true,
      sign: true,
      include: false,
      exclude: false,
      evaluate: true,
    },
    documents: [],
    joinedAt: "20/03/2024",
  },
  {
    id: "4",
    fullName: "Ana Beatriz Ferreira",
    cpf: "456.789.012-33",
    rg: "MG-45.678.901",
    matricula: "SRV-112",
    position: "Analista de Contratos",
    role: "Membro",
    sector: "Gestão de Contratos",
    isCommissioned: false,
    email: "ana.beatriz@orgao.gov.br",
    phone: "(31) 3333-0004",
    whatsapp: "(31) 99999-0004",
    birthday: "10/11",
    memberType: "member",
    datavalidVerified: false,
    status: "active",
    approvalMethod: "adm_local",
    isOnline: true,
    permissions: {
      create: true,
      modify: true,
      sign: false,
      include: true,
      exclude: false,
      evaluate: true,
    },
    documents: [
      { name: "RG_Ana.pdf", type: "RG", url: "#" },
      { name: "Comprovante_Matricula.pdf", type: "Matrícula", url: "#" },
    ],
    joinedAt: "10/04/2024",
  },
  {
    id: "5",
    fullName: "Carlos Eduardo Lima",
    cpf: "567.890.123-44",
    rg: "MG-56.789.012",
    matricula: "SRV-156",
    position: "Técnico Administrativo",
    role: "Membro",
    sector: "Almoxarifado",
    isCommissioned: false,
    email: "carlos.eduardo@orgao.gov.br",
    phone: "(31) 3333-0005",
    birthday: "28/09",
    memberType: "member",
    datavalidVerified: false,
    status: "pending",
    approvalMethod: "request",
    isOnline: false,
    permissions: {
      create: false,
      modify: false,
      sign: false,
      include: false,
      exclude: false,
      evaluate: true,
    },
    documents: [],
    joinedAt: "25/05/2024",
  },
  {
    id: "6",
    fullName: "Fernanda Costa Silva",
    cpf: "678.901.234-55",
    rg: "MG-67.890.123",
    matricula: "SRV-189",
    professionalCard: "CRC-MG 54321",
    position: "Contadora",
    role: "Membro",
    sector: "Contabilidade",
    isCommissioned: false,
    email: "fernanda.costa@orgao.gov.br",
    email2: "fernanda.crc@contabil.com",
    phone: "(31) 3333-0006",
    whatsapp: "(31) 99999-0006",
    birthday: "05/12",
    memberType: "member",
    datavalidVerified: true,
    status: "active",
    approvalMethod: "invite",
    isOnline: false,
    permissions: {
      create: true,
      modify: true,
      sign: true,
      include: false,
      exclude: false,
      evaluate: true,
    },
    documents: [
      { name: "CRC_Fernanda.pdf", type: "Carteira Profissional", url: "#" },
    ],
    joinedAt: "05/06/2024",
  },
  {
    id: "7",
    fullName: "Ricardo Mendes Alves",
    cpf: "789.012.345-66",
    rg: "MG-78.901.234",
    matricula: "SRV-201",
    position: "Fiscal de Contratos",
    role: "Membro",
    sector: "Fiscalização",
    isCommissioned: false,
    email: "ricardo.mendes@orgao.gov.br",
    phone: "(31) 3333-0007",
    whatsapp: "(31) 99999-0007",
    birthday: "18/04",
    memberType: "member",
    datavalidVerified: false,
    status: "inactive",
    approvalMethod: "adm_local",
    isOnline: false,
    permissions: {
      create: false,
      modify: true,
      sign: false,
      include: false,
      exclude: false,
      evaluate: true,
    },
    documents: [],
    joinedAt: "18/07/2024",
  },
  {
    id: "8",
    fullName: "Patrícia Rocha Nunes",
    cpf: "890.123.456-77",
    rg: "MG-89.012.345",
    matricula: "SRV-234",
    position: "Secretária Executiva",
    role: "Membro",
    sector: "Gabinete",
    isCommissioned: true,
    email: "patricia.rocha@orgao.gov.br",
    phone: "(31) 3333-0008",
    whatsapp: "(31) 99999-0008",
    birthday: "30/06",
    memberType: "member",
    datavalidVerified: true,
    status: "blocked",
    approvalMethod: "adm_local",
    isOnline: false,
    permissions: {
      create: false,
      modify: false,
      sign: false,
      include: false,
      exclude: false,
      evaluate: false,
    },
    documents: [],
    joinedAt: "02/08/2024",
  },
];

type ViewType = "cards" | "list";
type SortType = "name" | "sector" | "role" | "date";

export function TeamPage() {
  const [viewType, setViewType] = useState<ViewType>("cards");
  const [sortBy, setSortBy] = useState<SortType>("name");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [documentsModalOpen, setDocumentsModalOpen] = useState(false);
  const [permissionsModalOpen, setPermissionsModalOpen] = useState(false);
  const [inviteLink, setInviteLink] = useState("https://ata360.gov.br/invite/abc123xyz");
  const [inviteEmail, setInviteEmail] = useState("");

  const filteredMembers = mockTeamMembers.filter((member) => {
    return (
      member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.cpf.includes(searchTerm) ||
      member.matricula.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.sector.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.position.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const sortedMembers = [...filteredMembers].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.fullName.localeCompare(b.fullName);
      case "sector":
        return a.sector.localeCompare(b.sector);
      case "role":
        return a.memberType === "admin" ? -1 : b.memberType === "admin" ? 1 : 0;
      case "date":
        return new Date(b.joinedAt.split('/').reverse().join('-')).getTime() - 
               new Date(a.joinedAt.split('/').reverse().join('-')).getTime();
      default:
        return 0;
    }
  });

  const getStatusBadge = (status: TeamMember["status"]) => {
    switch (status) {
      case "active":
        return <Badge variant="outline" className="text-[10px] h-5 rounded-full border-foreground/20">Ativo</Badge>;
      case "inactive":
        return <Badge variant="outline" className="text-[10px] h-5 rounded-full border-foreground/40">Inativo</Badge>;
      case "blocked":
        return <Badge variant="outline" className="text-[10px] h-5 rounded-full border-red-500 text-red-500">Bloqueado</Badge>;
      case "pending":
        return <Badge variant="outline" className="text-[10px] h-5 rounded-full border-foreground">Pendente</Badge>;
    }
  };

  const getApprovalMethodLabel = (method: TeamMember["approvalMethod"]) => {
    switch (method) {
      case "adm_local":
        return "Via ADM Local";
      case "adm_global":
        return "Via ADM Global";
      case "invite":
        return "Via Convite";
      case "request":
        return "Via Pedido";
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  };

  const isBirthdayToday = (birthday: string) => {
    const today = new Date();
    const [day, month] = birthday.split('/').map(Number);
    return today.getDate() === day && today.getMonth() + 1 === month;
  };

  const birthdayMembers = mockTeamMembers.filter(m => isBirthdayToday(m.birthday));

  const activeCount = mockTeamMembers.filter(m => m.status === "active").length;
  const inactiveCount = mockTeamMembers.filter(m => m.status === "inactive").length;
  const blockedCount = mockTeamMembers.filter(m => m.status === "blocked").length;
  const pendingCount = mockTeamMembers.filter(m => m.status === "pending").length;
  const onlineCount = mockTeamMembers.filter(m => m.isOnline).length;

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b border-border/30 p-4">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Users size={20} />
            Equipe Interna
          </h1>
          <div className="flex items-center gap-2">
            {/* Invite Member Button */}
            <Button
              size="sm"
              onClick={() => setInviteModalOpen(true)}
              className="gap-2 h-9 rounded-full bg-foreground text-background hover:bg-foreground/90"
            >
              <UserPlus size={14} />
              Convidar
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
                <DropdownMenuItem onClick={() => setSortBy("name")}>
                  Por Nome
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("sector")}>
                  Por Setor
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("role")}>
                  Por Funcao
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("date")}>
                  Por Data de Entrada
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
          <span>{mockTeamMembers.length} membros</span>
          <span className="flex items-center gap-1">
            <span className="size-2 bg-green-500 rounded-full" />
            {onlineCount} online
          </span>
          <span>{activeCount} ativos</span>
          {inactiveCount > 0 && <span>{inactiveCount} inativos</span>}
          {blockedCount > 0 && <span className="text-red-500">{blockedCount} bloqueados</span>}
          {pendingCount > 0 && <span className="text-foreground">{pendingCount} pendentes</span>}
          {birthdayMembers.length > 0 && (
            <span className="flex items-center gap-1 text-foreground bg-muted px-2 py-0.5 rounded-full">
              <Cake size={12} />
              {birthdayMembers.length} aniversariante{birthdayMembers.length > 1 ? 's' : ''} hoje
            </span>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar por nome, CPF, matrícula, setor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 rounded-full"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {viewType === "cards" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 auto-rows-fr">
            {sortedMembers.map((member) => (
              <div
                key={member.id}
                className="border border-border rounded-3xl p-3 hover:border-foreground transition-colors bg-background flex flex-col"
              >
                {/* Header with Avatar */}
                <div className="flex items-start justify-between mb-3 gap-2">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="relative">
                      <Avatar className="size-12 shrink-0">
                        <AvatarImage src={member.photo || "/placeholder.svg"} alt={member.fullName} />
                        <AvatarFallback className="bg-muted text-foreground text-sm font-medium">
                          {getInitials(member.fullName)}
                        </AvatarFallback>
                      </Avatar>
                      {/* Online indicator */}
                      {member.isOnline && (
                        <div className="absolute -top-0.5 -right-0.5 size-3 bg-green-500 rounded-full border-2 border-background" />
                      )}
                      {/* DataValid Serpro badge */}
                      {member.datavalidVerified && (
                        <div className="absolute -bottom-1 -right-1 size-5 bg-foreground rounded-full flex items-center justify-center" title="Validado via DataValid Serpro">
                          <BadgeCheck size={12} className="text-background" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground leading-tight truncate">
                        {member.fullName}
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {member.position}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-6 shrink-0 rounded-full hover:bg-muted">
                        <MoreVertical size={14} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => {
                        setSelectedMember(member);
                        setMemberModalOpen(true);
                      }}>
                        <Eye size={12} className="mr-2" />
                        Ver Detalhes
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        setSelectedMember(member);
                        setPermissionsModalOpen(true);
                      }}>
                        <Shield size={12} className="mr-2" />
                        Permissões
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        setSelectedMember(member);
                        setDocumentsModalOpen(true);
                      }}>
                        <FileText size={12} className="mr-2" />
                        Documentos
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-500">
                        <XCircle size={12} className="mr-2" />
                        Suspender
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Role & Status */}
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {member.memberType === "admin" && (
                    <Badge className="text-[10px] h-5 rounded-full gap-1 bg-foreground text-background border-0">
                      <ShieldCheck size={10} />
                      Admin
                    </Badge>
                  )}
                  {getStatusBadge(member.status)}
                  <Badge variant="outline" className="text-[10px] h-5 rounded-full border-foreground/20">
                    {getApprovalMethodLabel(member.approvalMethod)}
                  </Badge>
                  {member.isCommissioned && (
                    <Badge variant="outline" className="text-[10px] h-5 rounded-full border-foreground/20">
                      Comissionado
                    </Badge>
                  )}
                </div>

                {/* Birthday Alert */}
                {isBirthdayToday(member.birthday) && (
                  <div className="mb-2 p-2 bg-muted/50 rounded-2xl flex items-center gap-2">
                    <Cake size={14} className="text-foreground" />
                    <span className="text-xs font-medium text-foreground">Feliz Aniversario!</span>
                  </div>
                )}

                {/* Info */}
                <div className="mb-2 pb-2 border-b border-border/30">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-[10px] text-muted-foreground mb-0.5">Setor</p>
                      <p className="text-xs font-medium text-foreground">{member.sector}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-muted-foreground mb-0.5">Matrícula</p>
                      <p className="text-xs font-medium text-foreground">{member.matricula}</p>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="mb-2 pb-2 border-b border-border/30 space-y-1">
                  <div className="flex items-center gap-2 text-[10px]">
                    <Mail size={10} className="text-muted-foreground shrink-0" />
                    <span className="truncate text-foreground">{member.email}</span>
                  </div>
                  {member.email2 && (
                    <div className="flex items-center gap-2 text-[10px]">
                      <Mail size={10} className="text-muted-foreground shrink-0" />
                      <span className="truncate text-muted-foreground">{member.email2}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-[10px]">
                    <Phone size={10} className="text-muted-foreground shrink-0" />
                    <span className="text-foreground">{member.phone}</span>
                  </div>
                  {member.whatsapp && (
                    <div className="flex items-center gap-2 text-[10px]">
                      <MessageCircle size={10} className="text-muted-foreground shrink-0" />
                      <span className="text-foreground">{member.whatsapp}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-[10px]">
                    <Cake size={10} className="text-muted-foreground shrink-0" />
                    <span className="text-foreground">{member.birthday}</span>
                  </div>
                </div>

                {/* Permissions Preview */}
                <div className="mb-2 pb-2 border-b border-border/30">
                  <p className="text-[10px] text-muted-foreground mb-1.5">Permissões</p>
                  <div className="flex flex-wrap gap-1">
                    {member.permissions.create && <Badge variant="outline" className="text-[8px] h-4 rounded-full border-foreground/20">Criar</Badge>}
                    {member.permissions.modify && <Badge variant="outline" className="text-[8px] h-4 rounded-full border-foreground/20">Modificar</Badge>}
                    {member.permissions.sign && <Badge variant="outline" className="text-[8px] h-4 rounded-full border-foreground/20">Assinar</Badge>}
                    {member.permissions.include && <Badge variant="outline" className="text-[8px] h-4 rounded-full border-foreground/20">Incluir</Badge>}
                    {member.permissions.exclude && <Badge variant="outline" className="text-[8px] h-4 rounded-full border-foreground/20">Excluir</Badge>}
                    {member.permissions.evaluate && <Badge variant="outline" className="text-[8px] h-4 rounded-full border-foreground/20">Avaliar</Badge>}
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-auto text-[10px] text-muted-foreground">
                  <span>Desde {member.joinedAt}</span>
                  <span>{member.documents.length} doc{member.documents.length !== 1 ? 's' : ''}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {sortedMembers.map((member) => (
              <div
                key={member.id}
                className="border border-border rounded-full p-3 px-4 hover:border-foreground transition-colors bg-background flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="relative">
                    <Avatar className="size-10 shrink-0">
                      <AvatarImage src={member.photo || "/placeholder.svg"} alt={member.fullName} />
                      <AvatarFallback className="bg-muted text-foreground text-xs font-medium">
                        {getInitials(member.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    {member.isOnline && (
                      <div className="absolute -top-0.5 -right-0.5 size-2.5 bg-green-500 rounded-full border-2 border-background" />
                    )}
                    {member.datavalidVerified && (
                      <div className="absolute -bottom-0.5 -right-0.5 size-4 bg-foreground rounded-full flex items-center justify-center" title="Validado via DataValid Serpro">
                        <BadgeCheck size={10} className="text-background" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-[150px]">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {member.fullName}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {member.position}
                    </p>
                  </div>
                  <div className="min-w-[120px] hidden md:block">
                    <p className="text-xs text-foreground">{member.sector}</p>
                  </div>
                  <div className="min-w-[80px] hidden lg:block">
                    <p className="text-xs text-muted-foreground">{member.matricula}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {member.memberType === "admin" && (
                      <Badge className="text-[10px] h-5 rounded-full gap-1 bg-foreground text-background border-0">
                        <ShieldCheck size={10} />
                        Admin
                      </Badge>
                    )}
                    {getStatusBadge(member.status)}
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-7 shrink-0 rounded-full hover:bg-muted">
                      <MoreVertical size={14} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => {
                      setSelectedMember(member);
                      setMemberModalOpen(true);
                    }}>
                      <Eye size={12} className="mr-2" />
                      Ver Detalhes
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                      setSelectedMember(member);
                      setPermissionsModalOpen(true);
                    }}>
                      <Shield size={12} className="mr-2" />
                      Permissões
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                      setSelectedMember(member);
                      setDocumentsModalOpen(true);
                    }}>
                      <FileText size={12} className="mr-2" />
                      Documentos
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-500">
                      <XCircle size={12} className="mr-2" />
                      Suspender
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Member Details Modal */}
      <Dialog open={memberModalOpen} onOpenChange={setMemberModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <UserCog size={16} />
              Detalhes do Membro
            </DialogTitle>
          </DialogHeader>
          {selectedMember && (
            <div className="space-y-4 mt-2">
              {/* Profile Header */}
              <div className="flex items-center gap-4 pb-3 border-b border-border/30">
                <div className="relative">
                  <Avatar className="size-16">
                    <AvatarImage src={selectedMember.photo || "/placeholder.svg"} alt={selectedMember.fullName} />
                    <AvatarFallback className="bg-muted text-foreground text-lg font-medium">
                      {getInitials(selectedMember.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  {selectedMember.isOnline && (
                    <div className="absolute -top-0.5 -right-0.5 size-3 bg-green-500 rounded-full border-2 border-background" />
                  )}
                  {selectedMember.datavalidVerified && (
                    <div className="absolute -bottom-1 -right-1 size-6 bg-foreground rounded-full flex items-center justify-center" title="Validado via DataValid Serpro">
                      <BadgeCheck size={14} className="text-background" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-foreground">{selectedMember.fullName}</p>
                  <p className="text-xs text-muted-foreground">{selectedMember.position}</p>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1">
                    {selectedMember.memberType === "admin" && (
                      <Badge className="text-[10px] h-5 rounded-full gap-1 bg-foreground text-background border-0">
                        <ShieldCheck size={10} />
                        Admin
                      </Badge>
                    )}
                    {getStatusBadge(selectedMember.status)}
                    <Badge variant="outline" className="text-[10px] h-5 rounded-full border-foreground/20">
                      {getApprovalMethodLabel(selectedMember.approvalMethod)}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-muted-foreground mb-0.5">CPF</p>
                  <p className="font-medium">{selectedMember.cpf}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-0.5">RG</p>
                  <p className="font-medium">{selectedMember.rg}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-0.5">Matrícula</p>
                  <p className="font-medium">{selectedMember.matricula}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-0.5">Setor</p>
                  <p className="font-medium">{selectedMember.sector}</p>
                </div>
                {selectedMember.professionalCard && (
                  <div className="col-span-2">
                    <p className="text-muted-foreground mb-0.5">Carteira Profissional</p>
                    <p className="font-medium">{selectedMember.professionalCard}</p>
                  </div>
                )}
                <div>
                  <p className="text-muted-foreground mb-0.5">Email Principal</p>
                  <p className="font-medium">{selectedMember.email}</p>
                </div>
                {selectedMember.email2 && (
                  <div>
                    <p className="text-muted-foreground mb-0.5">Email Secundario</p>
                    <p className="font-medium">{selectedMember.email2}</p>
                  </div>
                )}
                <div>
                  <p className="text-muted-foreground mb-0.5">Telefone</p>
                  <p className="font-medium">{selectedMember.phone}</p>
                </div>
                {selectedMember.whatsapp && (
                  <div>
                    <p className="text-muted-foreground mb-0.5">WhatsApp</p>
                    <p className="font-medium">{selectedMember.whatsapp}</p>
                  </div>
                )}
                <div>
                  <p className="text-muted-foreground mb-0.5">Aniversario</p>
                  <p className="font-medium flex items-center gap-1">
                    <Cake size={12} />
                    {selectedMember.birthday}
                    {isBirthdayToday(selectedMember.birthday) && (
                      <Badge variant="outline" className="text-[8px] h-4 rounded-full border-foreground ml-1">Hoje!</Badge>
                    )}
                  </p>
                </div>
              </div>

              {/* Verification Status */}
              <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-2xl">
                {selectedMember.datavalidVerified ? (
                  <>
                    <CheckCircle2 size={14} className="text-foreground" />
                    <span className="text-xs">Validado via DataValid Serpro (cadastral, facial, biometria)</span>
                  </>
                ) : (
                  <>
                    <XCircle size={14} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Validação DataValid Serpro pendente</span>
                  </>
                )}
              </div>
            </div>
          )}
          <DialogFooter className="gap-3 mt-4 sm:justify-center">
            <Button
              variant="outline"
              onClick={() => setMemberModalOpen(false)}
              className="rounded-full text-xs h-9 px-6"
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Permissions Modal */}
      <Dialog open={permissionsModalOpen} onOpenChange={setPermissionsModalOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Shield size={16} />
              Permissões de Artefatos
            </DialogTitle>
            {selectedMember && (
              <p className="text-xs text-muted-foreground">{selectedMember.fullName}</p>
            )}
          </DialogHeader>
          {selectedMember && (
            <div className="space-y-3 mt-3">
              {[
                { key: "create", label: "Criar", desc: "Criar novos artefatos" },
                { key: "modify", label: "Modificar", desc: "Editar artefatos existentes" },
                { key: "sign", label: "Assinar", desc: "Assinar documentos" },
                { key: "include", label: "Incluir", desc: "Adicionar itens a processos" },
                { key: "exclude", label: "Excluir", desc: "Remover itens de processos" },
                { key: "evaluate", label: "Avaliar", desc: "Avaliar fornecedores" },
              ].map((perm) => (
                <div key={perm.key} className="flex items-center justify-between p-2 border border-border/30 rounded-2xl">
                  <div>
                    <p className="text-xs font-medium">{perm.label}</p>
                    <p className="text-[10px] text-muted-foreground">{perm.desc}</p>
                  </div>
                  <Checkbox 
                    checked={selectedMember.permissions[perm.key as keyof typeof selectedMember.permissions]} 
                    disabled
                  />
                </div>
              ))}
            </div>
          )}
          <DialogFooter className="gap-3 mt-4 sm:justify-center">
            <Button
              variant="outline"
              onClick={() => setPermissionsModalOpen(false)}
              className="rounded-full text-xs h-9 px-6"
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Documents Modal */}
      <Dialog open={documentsModalOpen} onOpenChange={setDocumentsModalOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <FileText size={16} />
              Documentos
            </DialogTitle>
            {selectedMember && (
              <p className="text-xs text-muted-foreground">{selectedMember.fullName}</p>
            )}
          </DialogHeader>
          {selectedMember && (
            <div className="space-y-2 mt-3">
              {selectedMember.documents.length > 0 ? (
                selectedMember.documents.map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 border border-border rounded-2xl hover:border-foreground transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="size-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                        <FileText size={16} className="text-muted-foreground" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">{doc.name}</p>
                        <p className="text-[10px] text-muted-foreground">{doc.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 rounded-full hover:bg-muted"
                        onClick={() => window.open(doc.url, '_blank')}
                      >
                        <Eye size={16} />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-xs text-muted-foreground">
                  Nenhum documento anexado
                </div>
              )}

              {/* Upload Button */}
              <Button
                variant="outline"
                className="w-full rounded-2xl gap-2 h-10 mt-2 bg-transparent"
              >
                <Upload size={14} />
                Anexar Documento
              </Button>
            </div>
          )}
          <DialogFooter className="gap-3 mt-4 sm:justify-center">
            <Button
              variant="outline"
              onClick={() => setDocumentsModalOpen(false)}
              className="rounded-full text-xs h-9 px-6"
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invite Modal */}
      <Dialog open={inviteModalOpen} onOpenChange={setInviteModalOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <UserPlus size={16} />
              Convidar Novo Membro
            </DialogTitle>
            <DialogDescription className="text-xs">
              Convide pessoas da sua equipe para usar o ATA360. Apenas membros com vínculo comprovado ao órgão serão aprovados.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-3">
            {/* Email Invite */}
            <div className="space-y-2">
              <Label className="text-xs font-medium">Enviar convite por e-mail</Label>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="email@orgao.gov.br"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="rounded-full text-xs"
                />
                <Button
                  size="sm"
                  className="rounded-full h-9 px-4 bg-foreground text-background hover:bg-foreground/90"
                >
                  <Mail size={14} />
                </Button>
              </div>
            </div>

            {/* Link Invite */}
            <div className="space-y-2">
              <Label className="text-xs font-medium">Ou compartilhe o link de convite</Label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={inviteLink}
                  readOnly
                  className="rounded-full text-xs bg-muted"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigator.clipboard.writeText(inviteLink)}
                  className="rounded-full h-9 px-4"
                >
                  <Copy size={14} />
                </Button>
              </div>
            </div>

            {/* Info */}
            <div className="bg-muted/50 p-3 rounded-2xl">
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                O novo membro precisará preencher um formulário com seus dados e documentos. 
                A solicitação será enviada para aprovação do Administrador Local.
                Acesse também ata360.gov.br/suporte para mais informações.
              </p>
            </div>
          </div>
          <DialogFooter className="gap-3 mt-4 sm:justify-center">
            <Button
              variant="outline"
              onClick={() => setInviteModalOpen(false)}
              className="rounded-full text-xs h-9 px-6"
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
