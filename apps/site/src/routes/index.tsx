import { createFileRoute } from '@tanstack/react-router'
import { fetchPublishedPosts } from '#/features/blog/api'
import { HomePage } from '#/features/profile/components/HomePage'
import { seo } from '#/lib/site'

export const Route = createFileRoute('/')({
  loader: async () => {
    const posts = await fetchPublishedPosts()
    return { posts: posts.slice(0, 3) }
  },
  head: () => ({
    meta: seo({ path: '/' }),
    links: [{ rel: 'canonical', href: '/' }],
  }),
  component: HomeRoute,
})

function HomeRoute() {
  const { posts } = Route.useLoaderData()
  return <HomePage posts={posts} />
}
