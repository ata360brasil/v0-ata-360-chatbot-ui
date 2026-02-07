"use client"

import dynamic from 'next/dynamic'
import { PageSkeleton } from '@/components/page-skeleton'

const TeamPage = dynamic(
  () => import('@/components/team-page').then(mod => ({ default: mod.TeamPage })),
  { loading: () => <PageSkeleton /> }
)

export default function TeamRoute() {
  return <TeamPage />
}
