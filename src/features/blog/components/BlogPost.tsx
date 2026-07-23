import { Link } from '@tanstack/react-router'
import type { BlogPost as BlogPostData } from '#/features/blog/posts'

export function BlogPost({ post }: { post: BlogPostData }) {
  return (
    <article className="mx-auto max-w-2xl px-4 py-16">
      <Link to="/" className="text-sm text-slate-600 hover:text-slate-900">
        ← Writing
      </Link>
      <header className="mt-6">
        <time dateTime={post.publishedAt} className="text-sm text-slate-500">
          {new Date(post.publishedAt).toLocaleDateString('ja-JP')}
        </time>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">
          {post.title}
        </h1>
        <p className="mt-4 text-lg text-slate-600">{post.summary}</p>
      </header>
      <div
        className="prose prose-slate mt-10 max-w-none"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />
    </article>
  )
}
