/**
 * Type-safe route definitions.
 *
 * Single source of truth para todas as rotas da aplicacao.
 * Elimina strings duplicadas espalhadas pelo codigo.
 *
 * Padrao recomendado pela equipe Vercel para Next.js App Router:
 * centralizar definicoes de rotas como `const` assertions.
 */

export const ROUTES = {
  // App (autenticado)
  chat: '/',
  dashboard: '/dashboard',
  contracts: '/contracts',
  processes: '/processes',
  team: '/team',
  files: '/files',
  history: '/history',
  assistants: '/assistants',
  login: '/login',
  // Institucional (publico)
  blog: '/blog',
  glossario: '/glossario',
  manifesto: '/manifesto',
  quemSomos: '/quem-somos',
  contato: '/contato',
  seguranca: '/seguranca',
  compliance: '/compliance',
} as const

export type RouteKey = keyof typeof ROUTES
export type RoutePath = (typeof ROUTES)[RouteKey]

/**
 * Mapa de sidebar item ID -> rota.
 * Usado pelo layout para converter cliques do SidebarMenu em navegacao.
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
export const ROUTE_META: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'Chat IA',
    description: 'Assistente inteligente especialista em contratacoes publicas e Lei 14.133/2021.',
  },
  '/dashboard': {
    title: 'Dashboard',
    description: 'Painel administrativo com metricas, consumo e gestao de organizacoes.',
  },
  '/contracts': {
    title: 'Contratos',
    description: 'Gestao de contratos e atas de registro de precos conforme Lei 14.133/2021.',
  },
  '/processes': {
    title: 'Processos',
    description: 'Acompanhamento de processos licitatorios e contratacoes diretas.',
  },
  '/team': {
    title: 'Equipe',
    description: 'Gestao de membros da equipe e permissoes de acesso.',
  },
  '/files': {
    title: 'Documentos',
    description: 'Biblioteca de documentos, minutas e modelos de contratacao publica.',
  },
  '/history': {
    title: 'Historico',
    description: 'Historico de conversas e pesquisas realizadas no assistente IA.',
  },
  '/assistants': {
    title: 'Assistentes',
    description: 'Assistentes IA especializados em diferentes areas de contratacao publica.',
  },
  '/login': {
    title: 'Entrar',
    description: 'Acesse sua conta ATA360 para gerenciar contratacoes publicas.',
  },
  '/blog': {
    title: 'Blog',
    description: 'Artigos e guias sobre contratacoes publicas, Lei 14.133/2021 e IA.',
  },
  '/glossario': {
    title: 'Glossario',
    description: 'Termos e definicoes de contratacoes publicas conforme Lei 14.133/2021.',
  },
  '/contato': {
    title: 'Contato',
    description: 'Entre em contato com a equipe ATA360.',
  },
}
