/**
 * Google Analytics 4 + AI-Native Analytics
 *
 * Integracao GA4 com eventos customizados para:
 * - Funnel de contratacoes publicas
 * - Interacoes com IA (chat, sugestoes, auditoria)
 * - Web Vitals (LCP, INP, CLS)
 * - Engagement com conteudo institucional
 * - Programmatic SEO performance
 *
 * @see GA4 Measurement Protocol 2026
 * @see Google Analytics Enhanced Measurement
 */

// ─── GA4 Configuration ──────────────────────────────────────────────────────

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''

/** Inicializa gtag (chamado uma vez no layout) */
export function getGA4Script(): string {
  if (!GA_MEASUREMENT_ID) return ''
  return `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA_MEASUREMENT_ID}', {
      page_title: document.title,
      send_page_view: true,
      cookie_flags: 'SameSite=None;Secure',
      anonymize_ip: true,
      custom_map: {
        dimension1: 'user_role',
        dimension2: 'orgao_tipo',
        dimension3: 'ai_tier',
        dimension4: 'document_type',
        metric1: 'ai_tokens_used',
        metric2: 'process_completion_rate'
      }
    });
  `
}

export function getGA4ScriptSrc(): string {
  if (!GA_MEASUREMENT_ID) return ''
  return `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
}

// ─── Type-safe Event Tracking ────────────────────────────────────────────────

type GAEventParams = Record<string, string | number | boolean>

function trackEvent(eventName: string, params?: GAEventParams) {
  if (typeof window === 'undefined') return
  const w = window as typeof window & { gtag?: (...args: unknown[]) => void }
  if (!w.gtag) return
  w.gtag('event', eventName, params)
}

// ─── AI-Native Events ────────────────────────────────────────────────────────

export const analytics = {
  // Navegacao e engajamento
  pageView: (path: string, title: string) =>
    trackEvent('page_view', { page_path: path, page_title: title }),

  // Chat IA
  chatMessageSent: (processoId: string) =>
    trackEvent('chat_message_sent', { processo_id: processoId }),

  chatResponseReceived: (processoId: string, latencyMs: number) =>
    trackEvent('chat_response_received', { processo_id: processoId, latency_ms: latencyMs }),

  // Pipeline de documentos
  pipelineStarted: (documentType: string, tier: string) =>
    trackEvent('pipeline_started', { document_type: documentType, ai_tier: tier }),

  pipelineCompleted: (documentType: string, durationMs: number) =>
    trackEvent('pipeline_completed', { document_type: documentType, duration_ms: durationMs }),

  documentGenerated: (documentType: string) =>
    trackEvent('document_generated', { document_type: documentType }),

  documentApproved: (documentType: string) =>
    trackEvent('document_approved', { document_type: documentType }),

  documentRejected: (documentType: string, reason: string) =>
    trackEvent('document_rejected', { document_type: documentType, rejection_reason: reason }),

  // Auditoria
  auditCompleted: (score: number, itemCount: number) =>
    trackEvent('audit_completed', { compliance_score: score, audit_items: itemCount }),

  auditItemFailed: (checkType: string) =>
    trackEvent('audit_item_failed', { check_type: checkType }),

  // Pesquisa de precos
  priceResearchStarted: (source: string) =>
    trackEvent('price_research_started', { data_source: source }),

  priceResearchCompleted: (itemCount: number) =>
    trackEvent('price_research_completed', { items_found: itemCount }),

  // Conversao e funnel
  signupStarted: (method: string) =>
    trackEvent('signup_started', { signup_method: method }),

  loginCompleted: (method: string) =>
    trackEvent('login_completed', { login_method: method }),

  contactFormSubmitted: (subject: string) =>
    trackEvent('contact_form_submitted', { subject_category: subject }),

  demoRequested: () =>
    trackEvent('demo_requested'),

  // Engajamento institucional
  institutionalPageRead: (page: string, scrollDepth: number) =>
    trackEvent('institutional_page_read', { page_name: page, scroll_depth: scrollDepth }),

  faqExpanded: (question: string) =>
    trackEvent('faq_expanded', { question_title: question }),

  // Blog e conteudo
  blogPostRead: (slug: string, category: string) =>
    trackEvent('blog_post_read', { post_slug: slug, post_category: category }),

  glossaryTermViewed: (term: string) =>
    trackEvent('glossary_term_viewed', { term }),

  // SEO e performance
  searchImpression: (query: string, position: number) =>
    trackEvent('search_impression', { search_query: query, search_position: position }),

  // Acessibilidade
  accessibilityFeatureUsed: (feature: string) =>
    trackEvent('accessibility_feature_used', { feature_name: feature }),

  // Web Vitals (enviados ao GA4)
  webVital: (name: string, value: number, rating: string) =>
    trackEvent('web_vital', { metric_name: name, metric_value: value, metric_rating: rating }),
}

// ─── Consent Management (LGPD) ──────────────────────────────────────────────

export function updateConsent(analyticsConsent: boolean) {
  if (typeof window === 'undefined') return
  const w = window as typeof window & { gtag?: (...args: unknown[]) => void }
  if (!w.gtag) return
  w.gtag('consent', 'update', {
    analytics_storage: analyticsConsent ? 'granted' : 'denied',
    ad_storage: 'denied', // ATA360 nao usa ads
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  })
}
