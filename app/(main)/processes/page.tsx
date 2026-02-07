"use client"

import dynamic from 'next/dynamic'
import { PageSkeleton } from '@/components/page-skeleton'

const ProcessesPage = dynamic(
  () => import('@/components/processes-page').then(mod => ({ default: mod.ProcessesPage })),
  { loading: () => <PageSkeleton /> }
)

export default function ProcessesRoute() {
  return <ProcessesPage />
}
