"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Plus, Bell, PanelRight } from "lucide-react";
import { ATA360Icon } from "@/components/ata360-icon";
import { SidebarMenu } from "@/components/sidebar-menu";
import { ChatArea } from "@/components/chat-area";
import { ContractsPage } from "@/components/contracts-page";
import { ProcessesPage } from "@/components/processes-page";
import { TeamPage } from "@/components/team-page";
import { FilesPage } from "@/components/files-page";
import { HistoryPage } from "@/components/history-page";
import { AssistantsPage } from "@/components/assistants-page";
import { DashboardSuperADMPage } from "@/components/dashboard-superadm-page";
import { ArtifactsPanel, type ArtifactData } from "@/components/artifacts-panel";
import { ResizableDivider } from "@/components/resizable-divider";
import { NotificationsModal, type Notification } from "@/components/notifications-modal";
import { cn } from "@/lib/utils";

// Initial notifications data
const initialNotifications: Notification[] = [
  {
    id: "1",
    type: "alert",
    title: "Contrato vencendo em 30 dias",
    description: "O contrato #2024/0045 com a empresa ABC Serviços Ltda vence em 30 dias. Providencie a renovação ou novo processo licitatório.",
    date: "Hoje, 14:30",
    read: false,
    requiresAction: true,
    details: "Contrato: #2024/0045\nFornecedor: ABC Serviços Ltda\nVigência: 04/03/2026\nValor total: R$ 150.000,00\n\nAções necessárias:\n- Verificar necessidade de renovação\n- Iniciar novo processo licitatório se necessário\n- Comunicar área demandante",
    actionLabel: "Confirmar ciência",
    actionType: "confirm",
  },
  {
    id: "2",
    type: "task",
    title: "Tarefa pendente: Análise de ETP",
    description: "Você possui uma tarefa pendente de análise do Estudo Técnico Preliminar do processo 2024/0123.",
    date: "Hoje, 10:15",
    read: false,
    requiresAction: true,
    details: "Processo: 2024/0123\nObjeto: Aquisição de equipamentos de TI\nSolicitante: Departamento de Tecnologia\nPrazo: 10/02/2026\n\nO ETP aguarda sua análise e parecer técnico antes de prosseguir para elaboração do Termo de Referência.",
    actionLabel: "Concluir análise",
    actionType: "complete",
  },
  {
    id: "3",
    type: "news",
    title: "Nova funcionalidade: Publicação PNCP",
    description: "Agora você pode publicar diretamente no PNCP através da plataforma ATA360. Confira como utilizar.",
    date: "Ontem, 18:00",
    read: false,
    requiresAction: false,
    details: "A integração com o Portal Nacional de Contratações Públicas (PNCP) permite publicar editais, contratos e atas diretamente pela plataforma ATA360.\n\nBenefícios:\n- Publicação automatizada\n- Sincronização de dados\n- Conformidade com a Lei 14.133/2021",
  },
  {
    id: "4",
    type: "message",
    title: "Mensagem do suporte",
    description: "Sua solicitação de suporte #4521 foi respondida. Clique para visualizar a resposta da equipe.",
    date: "02/02/2026",
    read: true,
    requiresAction: false,
    details: "Chamado #4521 - Dúvida sobre preenchimento de ETP\n\nResposta da equipe:\nPara preencher o campo de análise de riscos no ETP, você deve considerar os riscos técnicos, operacionais e de mercado relacionados à contratação. Utilize o assistente de IA para obter sugestões personalizadas.",
  },
  {
    id: "5",
    type: "system",
    title: "Manutenção programada",
    description: "O sistema passará por manutenção no dia 10/02/2026 das 00:00 às 06:00. Salve seus trabalhos antes desse horário.",
    date: "01/02/2026",
    read: true,
    requiresAction: false,
    details: "Manutenção programada para atualização de segurança e melhorias de performance.\n\nData: 10/02/2026\nHorário: 00:00 às 06:00\n\nDurante este período o sistema ficará indisponível. Recomendamos salvar todos os trabalhos em andamento antes do início da manutenção.",
  },
];

// Default width for artifacts panel (60% when open, following 20/60/20 ratio for sidebar/chat/artifacts)
const DEFAULT_ARTIFACTS_WIDTH = 480;
const MIN_ARTIFACTS_WIDTH = 300;
const MAX_ARTIFACTS_WIDTH = 800;

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [artifactsPanelOpen, setArtifactsPanelOpen] = useState(false);
  const [currentArtifact, setCurrentArtifact] = useState<ArtifactData | null>(null);
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [notificationsModalOpen, setNotificationsModalOpen] = useState(false);
  const [artifactsWidth, setArtifactsWidth] = useState(DEFAULT_ARTIFACTS_WIDTH);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Count unread notifications
  const unreadCount = notifications.filter((n) => !n.read).length;
  const notificationCount = unreadCount; // Declare notificationCount variable

  const handleOpenArtifact = (artifact: ArtifactData) => {
    setCurrentArtifact(artifact);
    setArtifactsPanelOpen(true);
  };

  const handleNewConversation = () => {
    setHasStartedChat(false);
    setCurrentArtifact(null);
    setArtifactsPanelOpen(false);
    setActiveSection(null);
  };

  const handleCloseArtifactsPanel = () => {
    setArtifactsPanelOpen(false);
    // Reset width to default when closing
    setArtifactsWidth(DEFAULT_ARTIFACTS_WIDTH);
  };

  const handleResize = useCallback((delta: number) => {
    setArtifactsWidth((prevWidth) => {
      const newWidth = prevWidth - delta;
      return Math.min(MAX_ARTIFACTS_WIDTH, Math.max(MIN_ARTIFACTS_WIDTH, newWidth));
    });
  }, []);

  const handleResizeEnd = useCallback(() => {
    // Optional: can add logic here when resize ends
  }, []);

  return (
    <TooltipProvider>
      <div className="h-screen flex flex-col bg-background overflow-hidden">
        {/* Header */}
        <header className="h-14 border-b border-border/30 flex items-center justify-between px-4 shrink-0">
          {/* Left side */}
          <div className="flex items-center gap-2">
            {/* Menu Toggle */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="size-10 rounded-full bg-background hover:bg-muted cursor-pointer"
                >
                  <ATA360Icon className="size-6" color="black" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{sidebarOpen ? "Fechar menu" : "Abrir menu"}</TooltipContent>
            </Tooltip>

            {/* New Conversation */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleNewConversation}
                  className="size-10 rounded-full bg-background hover:bg-muted cursor-pointer"
                >
                  <Plus className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Nova conversa</TooltipContent>
            </Tooltip>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setNotificationsModalOpen(true)}
                  className="size-10 rounded-full bg-background hover:bg-muted cursor-pointer relative"
                >
                  <Bell className="size-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 size-5 rounded-full bg-foreground text-background text-xs font-medium flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Alertas</TooltipContent>
            </Tooltip>

            {/* Artifacts Panel Toggle */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setArtifactsPanelOpen(!artifactsPanelOpen)}
                  className={cn(
                    "size-10 rounded-full bg-background hover:bg-muted cursor-pointer",
                    artifactsPanelOpen && "bg-muted"
                  )}
                >
                  <PanelRight className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {artifactsPanelOpen ? "Fechar artefatos" : "Abrir artefatos"}
              </TooltipContent>
            </Tooltip>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar */}
          <SidebarMenu 
            isOpen={sidebarOpen} 
            onClose={() => setSidebarOpen(false)}
            onMenuItemClick={(itemId) => {
              if (itemId === "dashboard") {
                setActiveSection("dashboard");
              } else if (itemId === "contracts") {
                setActiveSection("contracts");
              } else if (itemId === "processes") {
                setActiveSection("processes");
              } else if (itemId === "team") {
                setActiveSection("team");
              } else if (itemId === "files") {
                setActiveSection("files");
              } else if (itemId === "history") {
                setActiveSection("history");
              } else if (itemId === "assistants") {
                setActiveSection("assistants");
              } else {
                setActiveSection(null);
              }
            }}
          />

          {/* Main Chat/Content Area */}
          <div className="flex-1 min-w-0 flex flex-col">
            {activeSection === "dashboard" ? (
              <DashboardSuperADMPage />
            ) : activeSection === "contracts" ? (
              <ContractsPage />
            ) : activeSection === "processes" ? (
              <ProcessesPage />
            ) : activeSection === "team" ? (
              <TeamPage />
            ) : activeSection === "files" ? (
              <FilesPage />
            ) : activeSection === "history" ? (
              <HistoryPage onNewConversation={handleNewConversation} />
            ) : activeSection === "assistants" ? (
              <AssistantsPage
                onSendQuestion={(question) => {
                  setActiveSection(null);
                  setHasStartedChat(true);
                }}
                onNavigate={(section) => {
                  setActiveSection(section);
                }}
              />
            ) : (
              <ChatArea
                hasStartedChat={hasStartedChat}
                onStartChat={() => setHasStartedChat(true)}
                onOpenArtifact={handleOpenArtifact}
              />
            )}
          </div>

          {/* Resizable Divider */}
          <ResizableDivider
            isVisible={artifactsPanelOpen}
            onResize={handleResize}
            onResizeEnd={handleResizeEnd}
          />

          {/* Right Artifacts Panel */}
          <ArtifactsPanel
            isOpen={artifactsPanelOpen}
            onClose={handleCloseArtifactsPanel}
            artifact={currentArtifact}
            width={artifactsWidth}
          />
        </div>

        {/* Notifications Modal */}
        <NotificationsModal
          open={notificationsModalOpen}
          onOpenChange={setNotificationsModalOpen}
          notifications={notifications}
          onNotificationsChange={setNotifications}
        />
      </div>
    </TooltipProvider>
  );
}
