import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { fetchPublishedPost } from '#/lib/api'
import { markdownToHtml } from '#/lib/markdown'
import { getSiteUrl, seo } from '#/lib/site'

export const Route = createFileRoute('/blog/$slug')({
  loader: async ({ params }) => {
    const post = await fetchPublishedPost(params.slug)
    if (!post) {
      throw notFound()
    }
    return {
      post,
      html: markdownToHtml(post.body),
    }
  },
  head: ({ loaderData }) => {
    const post = loaderData?.post
    if (!post) {
      return {}
    }
    const siteUrl = getSiteUrl()
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.summary,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt,
      image: post.ogImageUrl || undefined,
      author: {
        '@type': 'Person',
        name: 'Masanori Ogawa',
      },
      mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
    }

    return {
      meta: seo({
        title: post.title,
        description: post.summary,
        path: `/blog/${post.slug}`,
        image: post.ogImageUrl,
        type: 'article',
      }),
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify(jsonLd),
        },
      ],
    }
  },
  component: BlogPostPage,
})

function BlogPostPage() {
  const { post, html } = Route.useLoaderData()

  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <Link to="/blog" className="text-sm text-blue-600 hover:text-blue-800">
        ← ブログ一覧
      </Link>
      <header className="mt-6">
        {post.publishedAt ? (
          <time
            dateTime={post.publishedAt}
            className="text-sm text-slate-500"
          >
            {new Date(post.publishedAt).toLocaleDateString('ja-JP')}
          </time>
        ) : null}
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">
          {post.title}
        </h1>
        <p className="mt-4 text-lg text-slate-600">{post.summary}</p>
      </header>
      <div
        className="prose prose-slate mt-10 max-w-none"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </article>
  )
}
