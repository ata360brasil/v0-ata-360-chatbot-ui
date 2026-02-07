"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import type { ArtifactData } from "@/components/artifacts-panel";
import type { Notification } from "@/components/notifications-modal";

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

const DEFAULT_ARTIFACTS_WIDTH = 480;
const MIN_ARTIFACTS_WIDTH = 300;
const MAX_ARTIFACTS_WIDTH = 800;

interface AppContextType {
  // Sidebar
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  // Artifacts panel
  artifactsPanelOpen: boolean;
  setArtifactsPanelOpen: (open: boolean) => void;
  currentArtifact: ArtifactData | null;
  openArtifact: (artifact: ArtifactData) => void;
  closeArtifactsPanel: () => void;
  artifactsWidth: number;
  handleResize: (delta: number) => void;
  handleResizeEnd: () => void;

  // Chat
  hasStartedChat: boolean;
  setHasStartedChat: (started: boolean) => void;
  resetChat: () => void;

  // Notifications
  notifications: Notification[];
  setNotifications: (notifications: Notification[]) => void;
  notificationsModalOpen: boolean;
  setNotificationsModalOpen: (open: boolean) => void;
  unreadCount: number;
}

const AppContext = createContext<AppContextType | null>(null);

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [artifactsPanelOpen, setArtifactsPanelOpen] = useState(false);
  const [currentArtifact, setCurrentArtifact] = useState<ArtifactData | null>(null);
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [notificationsModalOpen, setNotificationsModalOpen] = useState(false);
  const [artifactsWidth, setArtifactsWidth] = useState(DEFAULT_ARTIFACTS_WIDTH);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const openArtifact = useCallback((artifact: ArtifactData) => {
    setCurrentArtifact(artifact);
    setArtifactsPanelOpen(true);
  }, []);

  const closeArtifactsPanel = useCallback(() => {
    setArtifactsPanelOpen(false);
    setArtifactsWidth(DEFAULT_ARTIFACTS_WIDTH);
  }, []);

  const handleResize = useCallback((delta: number) => {
    setArtifactsWidth((prevWidth) => {
      const newWidth = prevWidth - delta;
      return Math.min(MAX_ARTIFACTS_WIDTH, Math.max(MIN_ARTIFACTS_WIDTH, newWidth));
    });
  }, []);

  const handleResizeEnd = useCallback(() => {}, []);

  const resetChat = useCallback(() => {
    setHasStartedChat(false);
    setCurrentArtifact(null);
    setArtifactsPanelOpen(false);
  }, []);

  return (
    <AppContext.Provider
      value={{
        sidebarOpen,
        setSidebarOpen,
        toggleSidebar,
        artifactsPanelOpen,
        setArtifactsPanelOpen,
        currentArtifact,
        openArtifact,
        closeArtifactsPanel,
        artifactsWidth,
        handleResize,
        handleResizeEnd,
        hasStartedChat,
        setHasStartedChat,
        resetChat,
        notifications,
        setNotifications,
        notificationsModalOpen,
        setNotificationsModalOpen,
        unreadCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
