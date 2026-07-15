import { Link, createFileRoute } from '@tanstack/react-router'
import { fetchPublishedPosts } from '#/lib/api'
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
  component: BlogIndexPage,
})

function BlogIndexPage() {
  const { posts } = Route.useLoaderData()

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <p className="text-sm font-medium text-blue-600">Blog</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">Articles</h1>
      <p className="mt-4 text-slate-600">
        実装メモ、学び、技術選定の振り返りをまとめています。
      </p>

      {posts.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white/70 p-6 text-slate-500">
          公開中の記事はまだありません。
        </p>
      ) : (
        <ul className="mt-10 space-y-4">
          {posts.map((post) => (
            <li key={post.id}>
              <Link
                to="/blog/$slug"
                params={{ slug: post.slug }}
                className="block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-200 hover:shadow-md"
              >
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  {post.publishedAt ? (
                    <time dateTime={post.publishedAt}>
                      {new Date(post.publishedAt).toLocaleDateString('ja-JP')}
                    </time>
                  ) : null}
                </div>
                <h2 className="mt-2 text-xl font-semibold">{post.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {post.summary}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
