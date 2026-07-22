import { Link, Outlet } from '@tanstack/react-router'
import { Show } from '@clerk/react'
import {
  AuthControls,
  AuthReady,
  SignedOutGate,
} from '#/features/auth/AuthGate'

export function ConsoleShell() {
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
          <AuthControls />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Show when="signed-out">
          <SignedOutGate />
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
