import { createFileRoute } from '@tanstack/react-router'
import { BlogIndex } from '#/features/blog/components/BlogIndex'
import { getPublishedPosts } from '#/features/blog/posts'
import { seo } from '#/lib/site'

export const Route = createFileRoute('/')({
  loader: () => {
    const posts = getPublishedPosts()
    return { posts }
  },
  head: () => ({
    meta: seo({ path: '/' }),
    links: [{ rel: 'canonical', href: '/' }],
  }),
  component: HomeRoute,
})

function HomeRoute() {
  const { posts } = Route.useLoaderData()
  return <BlogIndex posts={posts} />
}
