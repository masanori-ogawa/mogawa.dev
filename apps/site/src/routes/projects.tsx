import { createFileRoute } from '@tanstack/react-router'
import { ProjectsPage } from '#/features/profile/components/ProjectsPage'
import { seo } from '#/lib/site'

export const Route = createFileRoute('/projects')({
  head: () => ({
    meta: seo({
      title: 'Projects',
      description: '公開できる範囲の個人・学習プロジェクト一覧。',
      path: '/projects',
    }),
  }),
  component: ProjectsPage,
})
