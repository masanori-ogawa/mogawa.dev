import { createFileRoute } from '@tanstack/react-router'
import { profile } from '#/data/profile'
import { seo } from '#/lib/site'

export const Route = createFileRoute('/about')({
  head: () => ({
    meta: seo({
      title: 'About',
      description: `${profile.nameJa}の自己紹介とスキルセット。`,
      path: '/about',
    }),
  }),
  component: AboutPage,
})

function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <p className="text-sm font-medium text-blue-600">About</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">
        {profile.nameJa}
      </h1>
      <p className="mt-2 text-slate-500">
        {profile.name} / {profile.role} / {profile.location}
      </p>
      <p className="mt-8 text-lg leading-relaxed text-slate-700">
        {profile.summary}
      </p>

      <section className="mt-12">
        <h2 className="text-xl font-semibold">Skills</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {profile.skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold">Links</h2>
        <ul className="mt-4 space-y-2">
          {profile.links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
