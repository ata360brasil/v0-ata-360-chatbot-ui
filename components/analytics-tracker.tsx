'use client'

import { useEffect } from 'react'
import { analytics } from '@/lib/analytics'

export function BlogPostTracker({ slug, category }: { slug: string; category: string }) {
  useEffect(() => {
    analytics.blogPostRead(slug, category)
  }, [slug, category])
  return null
}

export function GlossaryTermTracker({ term }: { term: string }) {
  useEffect(() => {
    analytics.glossaryTermViewed(term)
  }, [term])
  return null
}

export function PageTracker({ page }: { page: string }) {
  useEffect(() => {
    analytics.institutionalPageRead(page, 0)

    let maxScroll = 0
    const handler = () => {
      const scrollPct = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      )
      if (scrollPct > maxScroll) maxScroll = scrollPct
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => {
      window.removeEventListener('scroll', handler)
      if (maxScroll > 0) {
        analytics.institutionalPageRead(page, maxScroll)
      }
    }
  }, [page])
  return null
}
