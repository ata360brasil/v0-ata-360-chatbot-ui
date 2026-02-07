"use client"

import dynamic from 'next/dynamic'
import { PageSkeleton } from '@/components/page-skeleton'

const FilesPage = dynamic(
  () => import('@/components/files-page').then(mod => ({ default: mod.FilesPage })),
  { loading: () => <PageSkeleton /> }
)

export default function FilesRoute() {
  return <FilesPage />
}
