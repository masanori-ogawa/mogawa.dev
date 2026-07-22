import { Link } from '@tanstack/react-router'
import type { PostListItem } from '@mogawa/schemas'
import { profile, projects } from '#/features/profile/data'

export function HomePage({ posts }: { posts: PostListItem[] }) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-600">
          Portfolio
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          {profile.nameJa}
          <span className="mt-2 block text-2xl font-normal text-slate-500 sm:text-3xl">
            {profile.name} / {profile.role}
          </span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
          {profile.summary}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/about"
            className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-700"
          >
            自己紹介を見る
          </Link>
          <Link
            to="/blog"
            className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            ブログへ
          </Link>
        </div>
      </section>

      <section className="mt-16">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-tight">Projects</h2>
          <Link to="/projects" className="text-sm text-blue-600 hover:text-blue-800">
            すべて見る
          </Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {projects.slice(0, 2).map((project) => (
            <article
              key={project.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold">{project.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {project.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-tight">Latest Posts</h2>
          <Link to="/blog" className="text-sm text-blue-600 hover:text-blue-800">
            ブログ一覧
          </Link>
        </div>
        {posts.length === 0 ? (
          <p className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white/70 p-6 text-slate-500">
            まだ公開記事がありません。管理画面から最初の記事を公開できます。
          </p>
        ) : (
          <ul className="mt-6 space-y-4">
            {posts.map((post) => (
              <li key={post.id}>
                <Link
                  to="/blog/$slug"
                  params={{ slug: post.slug }}
                  className="block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-200 hover:shadow-md"
                >
                  <h3 className="text-lg font-semibold">{post.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{post.summary}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
