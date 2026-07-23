import { Link } from '@tanstack/react-router'
import type { BlogPost } from '#/features/blog/posts'
import { profile } from '#/features/profile/data'

export function BlogIndex({ posts }: { posts: BlogPost[] }) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">{profile.name}</h1>
        <p className="mt-1 text-slate-500">
          {profile.nameJa} / {profile.role}
        </p>
        <p className="mt-6 leading-relaxed text-slate-700">{profile.summary}</p>
        <ul className="mt-4 flex flex-wrap gap-4 text-sm">
          {profile.links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="text-slate-600 underline decoration-slate-300 underline-offset-4 hover:text-slate-900"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </header>

      <section className="mt-16">
        <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
          Writing
        </h2>

        {posts.length === 0 ? (
          <p className="mt-8 text-slate-500">公開中の記事はまだありません。</p>
        ) : (
          <ul className="mt-8 divide-y divide-slate-200 border-y border-slate-200">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  to="/blog/$slug"
                  params={{ slug: post.slug }}
                  className="group flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                >
                  <div className="min-w-0">
                    <h3 className="text-lg font-medium text-slate-900 group-hover:underline">
                      {post.title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">{post.summary}</p>
                  </div>
                  <time
                    dateTime={post.publishedAt}
                    className="shrink-0 text-sm text-slate-500"
                  >
                    {new Date(post.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </time>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
