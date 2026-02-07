"use client"

import dynamic from 'next/dynamic'
import { PageSkeleton } from '@/components/page-skeleton'

const ContractsPage = dynamic(
  () => import('@/components/contracts-page').then(mod => ({ default: mod.ContractsPage })),
  { loading: () => <PageSkeleton /> }
)

export default function ContractsRoute() {
  return <ContractsPage />
}
