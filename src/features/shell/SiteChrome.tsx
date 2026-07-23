import { Link } from '@tanstack/react-router'
import { SITE_NAME } from '#/lib/site'

export function SiteHeader() {
  return (
    <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-2xl items-center justify-between gap-4 px-4 py-4">
        <Link to="/" className="text-lg font-semibold tracking-tight">
          {SITE_NAME}
        </Link>
      </div>
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200/80">
      <div className="mx-auto flex max-w-2xl flex-col gap-2 px-4 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {SITE_NAME}
        </p>
        <a href="/rss.xml" className="hover:text-slate-800">
          RSS
        </a>
      </div>
    </footer>
  )
}
