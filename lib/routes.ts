/**
 * Type-safe route definitions.
 *
 * Single source of truth para todas as rotas da aplicação.
 * Elimina strings duplicadas espalhadas pelo código.
 *
 * Padrão recomendado pela equipe Vercel para Next.js App Router:
 * centralizar definições de rotas como `const` assertions.
 */

export const ROUTES = {
  chat: '/',
  dashboard: '/dashboard',
  contracts: '/contracts',
  processes: '/processes',
  team: '/team',
  files: '/files',
  history: '/history',
  assistants: '/assistants',
  login: '/login',
} as const

export type RouteKey = keyof typeof ROUTES
export type RoutePath = (typeof ROUTES)[RouteKey]

/**
 * Mapa de sidebar item ID → rota.
 * Usado pelo layout para converter cliques do SidebarMenu em navegação.
 */
export const SIDEBAR_ROUTE_MAP: Record<string, RoutePath> = {
  dashboard: ROUTES.dashboard,
  contracts: ROUTES.contracts,
  processes: ROUTES.processes,
  team: ROUTES.team,
  files: ROUTES.files,
  history: ROUTES.history,
  assistants: ROUTES.assistants,
}

/**
 * Metadados de rota para SEO e breadcrumbs.
 */
export const ROUTE_META: Record<RoutePath, { title: string; description: string }> = {
  '/': {
    title: 'Chat IA',
    description: 'Assistente inteligente especialista em contratações públicas e Lei 14.133/2021.',
  },
  '/dashboard': {
    title: 'Dashboard',
    description: 'Painel administrativo com métricas, consumo e gestão de organizações.',
  },
  '/contracts': {
    title: 'Contratos',
    description: 'Gestão de contratos e atas de registro de preços conforme Lei 14.133/2021.',
  },
  '/processes': {
    title: 'Processos',
    description: 'Acompanhamento de processos licitatórios e contratações diretas.',
  },
  '/team': {
    title: 'Equipe',
    description: 'Gestão de membros da equipe e permissões de acesso.',
  },
  '/files': {
    title: 'Documentos',
    description: 'Biblioteca de documentos, minutas e modelos de contratação pública.',
  },
  '/history': {
    title: 'Histórico',
    description: 'Histórico de conversas e pesquisas realizadas no assistente IA.',
  },
  '/assistants': {
    title: 'Assistentes',
    description: 'Assistentes IA especializados em diferentes áreas de contratação pública.',
  },
  '/login': {
    title: 'Entrar',
    description: 'Acesse sua conta ATA360 para gerenciar contratações públicas.',
  },
}
