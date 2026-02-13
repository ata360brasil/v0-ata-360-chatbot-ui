"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { ArtifactData } from "@/components/artifacts-panel";
import type { Notification } from "@/components/notifications-modal";
import { initObservability, logger } from "@/lib/observability";
import { useAuth, type AuthUser } from "@/hooks/use-auth";
import { useProcess } from "@/hooks/use-process";
import type { CurrentProcess, UserDecision } from "@/lib/schemas/process";

// Notifications start empty — loaded dynamically from the API when user authenticates.
// No hardcoded fake data. Real notifications come from:
// - Contratos vencendo (API: /api/contratos/alertas)
// - Tarefas pendentes (API: /api/processos?status=AGUARDANDO_DECISAO)
// - Novidades do sistema (API: /api/sistema/novidades)
const initialNotifications: Notification[] = [];

const DEFAULT_ARTIFACTS_WIDTH = 480;
const MIN_ARTIFACTS_WIDTH = 300;
const MAX_ARTIFACTS_WIDTH = 800;

type Theme = 'light' | 'dark';

interface AppContextType {
  // Auth (Supabase + Gov.br)
  authUser: AuthUser | null;
  authLoading: boolean;
  signOut: () => Promise<void>;

  // Process (fluxo cíclico)
  currentProcess: CurrentProcess | null;
  processLoading: boolean;
  processError: string | null;
  criarProcesso: (objeto: string, tipo?: string) => Promise<void>;
  carregarProcesso: (id: string) => Promise<void>;
  decidirProcesso: (acao: UserDecision) => Promise<void>;
  limparProcesso: () => void;

  // Theme
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;

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
  // Auth hook — Supabase + Gov.br
  const { user: authUser, loading: authLoading, signOut } = useAuth();

  // Process hook — fluxo cíclico (Part 20.3)
  const {
    process: currentProcess,
    loading: processLoading,
    error: processError,
    criar: criarProcesso,
    carregar: carregarProcesso,
    decidir: decidirProcesso,
    limpar: limparProcesso,
  } = useProcess();

  const [theme, setThemeState] = useState<Theme>('light');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [artifactsPanelOpen, setArtifactsPanelOpen] = useState(false);
  const [currentArtifact, setCurrentArtifact] = useState<ArtifactData | null>(null);
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [notificationsModalOpen, setNotificationsModalOpen] = useState(false);
  const [artifactsWidth, setArtifactsWidth] = useState(DEFAULT_ARTIFACTS_WIDTH);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Theme: read preference from localStorage on mount and apply
  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme | null;
    const prefersDark = typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const resolved = stored ?? (prefersDark ? 'dark' : 'light');
    setThemeState(resolved);
    document.documentElement.classList.toggle('dark', resolved === 'dark');
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    localStorage.setItem('theme', t);
    document.documentElement.classList.toggle('dark', t === 'dark');
    logger.info('Theme changed', { theme: t });
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', next);
      document.documentElement.classList.toggle('dark', next === 'dark');
      logger.info('Theme toggled', { theme: next });
      return next;
    });
  }, []);

  // Observability: initialize once on mount
  useEffect(() => {
    initObservability();
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => {
      const opening = !prev;
      // Auto-close artifacts panel when opening sidebar
      if (opening) {
        setArtifactsPanelOpen(false);
        setArtifactsWidth(DEFAULT_ARTIFACTS_WIDTH);
      }
      return opening;
    });
  }, []);

  const openArtifact = useCallback((artifact: ArtifactData) => {
    setCurrentArtifact(artifact);
    setArtifactsPanelOpen(true);
    // Auto-close sidebar to make room for artifacts panel
    setSidebarOpen(false);
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
    limparProcesso();
  }, [limparProcesso]);

  return (
    <AppContext.Provider
      value={{
        // Auth
        authUser,
        authLoading,
        signOut,
        // Process
        currentProcess,
        processLoading,
        processError,
        criarProcesso,
        carregarProcesso,
        decidirProcesso,
        limparProcesso,
        // Theme
        theme,
        setTheme,
        toggleTheme,
        // Sidebar
        sidebarOpen,
        setSidebarOpen,
        toggleSidebar,
        // Artifacts
        artifactsPanelOpen,
        setArtifactsPanelOpen,
        currentArtifact,
        openArtifact,
        closeArtifactsPanel,
        artifactsWidth,
        handleResize,
        handleResizeEnd,
        // Chat
        hasStartedChat,
        setHasStartedChat,
        resetChat,
        // Notifications
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
