import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import {
  ClerkProvider,
  Show,
  SignInButton,
  UserButton,
  useAuth,
} from '@clerk/react'
import { QueryClientProvider } from '@tanstack/react-query'
import type { QueryClient } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import appCss from '../styles.css?url'

export type RouterContext = {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  ssr: false,
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      { title: 'Console | mogawa.dev' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  component: RootComponent,
  shellComponent: RootDocument,
  notFoundComponent: () => (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="text-2xl font-semibold">ページが見つかりません</h1>
      <Link to="/" className="mt-6 inline-block text-blue-600">
        ダッシュボードへ
      </Link>
    </div>
  ),
})

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  )
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext()
  const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

  if (!publishableKey) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24">
        <h1 className="text-2xl font-semibold">Clerk の設定が必要です</h1>
        <p className="mt-3 text-slate-600">
          `VITE_CLERK_PUBLISHABLE_KEY` を `.env.local` または環境変数に設定してください。
        </p>
      </div>
    )
  }

  return (
    <ClerkProvider publishableKey={publishableKey} afterSignOutUrl="/">
      <QueryClientProvider client={queryClient}>
        <AppShell />
      </QueryClientProvider>
    </ClerkProvider>
  )
}

function AppShell() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <div className="flex items-center gap-6">
            <Link to="/" className="font-semibold tracking-tight">
              mogawa console
            </Link>
            <Show when="signed-in">
              <nav className="flex gap-4 text-sm text-slate-600">
                <Link to="/" className="hover:text-slate-900">
                  Posts
                </Link>
                <Link to="/posts/new" className="hover:text-slate-900">
                  New Post
                </Link>
              </nav>
            </Show>
          </div>
          <div>
            <Show when="signed-in">
              <UserButton />
            </Show>
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button
                  type="button"
                  className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white"
                >
                  Sign in
                </button>
              </SignInButton>
            </Show>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Show when="signed-out">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <h1 className="text-2xl font-semibold">管理コンソール</h1>
            <p className="mt-3 text-slate-600">
              ブログ記事の作成・公開にはサインインが必要です。
            </p>
            <div className="mt-6">
              <SignInButton mode="modal">
                <button
                  type="button"
                  className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white"
                >
                  Sign in with Clerk
                </button>
              </SignInButton>
            </div>
          </div>
        </Show>
        <Show when="signed-in">
          <AuthReady>
            <Outlet />
          </AuthReady>
        </Show>
      </main>
    </div>
  )
}

function AuthReady({ children }: { children: ReactNode }) {
  const { isLoaded } = useAuth()
  if (!isLoaded) {
    return <p className="text-slate-500">認証状態を確認しています…</p>
  }
  return children
}
