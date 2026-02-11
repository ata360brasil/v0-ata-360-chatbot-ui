'use client'

import Script from 'next/script'
import { getGA4Script, getGA4ScriptSrc } from '@/lib/analytics'

/**
 * Google Analytics 4 Provider
 *
 * Renderiza os scripts GA4 com consent mode padrao (LGPD).
 * So carrega se NEXT_PUBLIC_GA_MEASUREMENT_ID estiver configurado.
 */
export function AnalyticsProvider() {
  const scriptSrc = getGA4ScriptSrc()
  const inlineScript = getGA4Script()

  if (!scriptSrc) return null

  return (
    <>
      {/* Consent Mode padrao (LGPD) — analytics negado ate consentimento */}
      <Script id="ga4-consent" strategy="beforeInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            analytics_storage: 'denied',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            wait_for_update: 500
          });
        `}
      </Script>
      <Script src={scriptSrc} strategy="afterInteractive" />
      <Script id="ga4-config" strategy="afterInteractive">
        {inlineScript}
      </Script>
    </>
  )
}
