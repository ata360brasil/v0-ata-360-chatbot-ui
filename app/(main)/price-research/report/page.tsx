"use client"

import dynamic from 'next/dynamic'
import { PageSkeleton } from '@/components/page-skeleton'

const PriceResearchReport = dynamic(
  () => import('@/components/price-research-report').then(mod => ({ default: mod.PriceResearchReport })),
  { loading: () => <PageSkeleton /> }
)

export default function PriceResearchReportRoute() {
  return <PriceResearchReport />
}
