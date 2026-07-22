import { createFileRoute } from '@tanstack/react-router'
import { fetchPublishedPosts } from '#/features/blog/api'
import { BlogIndex } from '#/features/blog/components/BlogIndex'
import { seo } from '#/lib/site'

export const Route = createFileRoute('/blog/')({
  loader: async () => {
    const posts = await fetchPublishedPosts()
    return { posts }
  },
  head: () => ({
    meta: seo({
      title: 'Blog',
      description: '技術メモと学習ログのブログ一覧。',
      path: '/blog',
    }),
  }),
  component: BlogIndexRoute,
})

function BlogIndexRoute() {
  const { posts } = Route.useLoaderData()
  return <BlogIndex posts={posts} />
}
