import { Link } from '@tanstack/react-router'
import type { Post } from '@mogawa/schemas'
import { sanitizePostBody } from '@mogawa/html'

export function BlogPost({ post }: { post: Post }) {
  const html = sanitizePostBody(post.body)

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
