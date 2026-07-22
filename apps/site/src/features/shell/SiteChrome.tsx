import { Link } from '@tanstack/react-router'
import { SITE_NAME } from '#/lib/site'

export function SiteHeader() {
  return (
    <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
        <Link to="/" className="text-lg font-semibold tracking-tight">
          {SITE_NAME}
        </Link>
        <nav className="flex flex-wrap gap-4 text-sm text-slate-600">
          <Link to="/" className="hover:text-slate-900">
            Home
          </Link>
          <Link to="/about" className="hover:text-slate-900">
            About
          </Link>
          <Link to="/projects" className="hover:text-slate-900">
            Projects
          </Link>
          <Link to="/blog" className="hover:text-slate-900">
            Blog
          </Link>
        </nav>
      </div>
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200/80">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {SITE_NAME}
        </p>
        <div className="flex gap-4">
          <a href="/rss.xml" className="hover:text-slate-800">
            RSS
          </a>
          <a href="/sitemap.xml" className="hover:text-slate-800">
            Sitemap
          </a>
        </div>
      </div>
    </footer>
  )
}
