"use client"

import dynamic from 'next/dynamic'
import { PageSkeleton } from '@/components/page-skeleton'

const DashboardSuperADMPage = dynamic(
  () => import('@/components/dashboard-superadm-page').then(mod => ({ default: mod.DashboardSuperADMPage })),
  { loading: () => <PageSkeleton /> }
)

export default function DashboardRoute() {
  return <DashboardSuperADMPage />
}
