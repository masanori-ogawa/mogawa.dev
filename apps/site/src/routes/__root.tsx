import {
  HeadContent,
  Link,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import { SITE_NAME } from '#/lib/site'
import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      { title: SITE_NAME },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/favicon.svg' },
    ],
  }),
  notFoundComponent: NotFound,
  shellComponent: RootDocument,
})

function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <p className="text-sm font-medium text-blue-600">404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        ページが見つかりません
      </h1>
      <p className="mt-3 text-slate-600">
        お探しのページは移動したか、まだ公開されていない可能性があります。
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-700"
      >
        トップへ戻る
      </Link>
    </div>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen antialiased">
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
        <main>{children}</main>
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
        <Scripts />
      </body>
    </html>
  )
}
