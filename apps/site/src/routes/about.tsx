import { createFileRoute } from '@tanstack/react-router'
import { AboutPage } from '#/features/profile/components/AboutPage'
import { profile } from '#/features/profile/data'
import { seo } from '#/lib/site'

export const Route = createFileRoute('/about')({
  head: () => ({
    meta: seo({
      title: 'About',
      description: `${profile.nameJa}の自己紹介とスキルセット。`,
      path: '/about',
    }),
  }),
  component: AboutPage,
})
