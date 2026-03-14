"use client"

import dynamic from 'next/dynamic'
import { PageSkeleton } from '@/components/page-skeleton'

const PriceResearchPage = dynamic(
  () => import('@/components/price-research-page').then(mod => ({ default: mod.PriceResearchPage })),
  { loading: () => <PageSkeleton /> }
)

export default function PriceResearchRoute() {
  return <PriceResearchPage />
}
