import { createFileRoute } from '@tanstack/react-router'
import { projects } from '#/data/profile'
import { seo } from '#/lib/site'

export const Route = createFileRoute('/projects')({
  head: () => ({
    meta: seo({
      title: 'Projects',
      description: '公開できる範囲の個人・学習プロジェクト一覧。',
      path: '/projects',
    }),
  }),
  component: ProjectsPage,
})

function ProjectsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <p className="text-sm font-medium text-blue-600">Projects</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">Selected Work</h1>
      <p className="mt-4 max-w-2xl text-slate-600">
        学習と実践のために公開しているプロジェクトです。詳細は随時更新します。
      </p>
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {projects.map((project) => (
          <article
            key={project.title}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold">{project.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
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
            <a
              href={project.href}
              className="mt-5 inline-block text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              詳細を見る
            </a>
          </article>
        ))}
      </div>
    </div>
  )
}
