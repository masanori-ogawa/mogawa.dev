import { Show, SignInButton, UserButton, useAuth } from '@clerk/react'
import { Button } from '@heroui/react'
import type { ReactNode } from 'react'

export function AuthControls() {
  return (
    <div>
      <Show when="signed-in">
        <UserButton />
      </Show>
      <Show when="signed-out">
        <SignInButton mode="modal">
          <Button variant="primary" size="sm">
            Sign in
          </Button>
        </SignInButton>
      </Show>
    </div>
  )
}

export function SignedOutGate() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <h1 className="text-2xl font-semibold">管理コンソール</h1>
      <p className="mt-3 text-slate-600">
        ブログ記事の作成・公開にはサインインが必要です。
      </p>
      <div className="mt-6">
        <SignInButton mode="modal">
          <Button variant="primary">Sign in with Clerk</Button>
        </SignInButton>
      </div>
    </div>
  )
}

export function AuthReady({ children }: { children: ReactNode }) {
  const { isLoaded } = useAuth()
  if (!isLoaded) {
    return <p className="text-slate-500">認証状態を確認しています…</p>
  }
  return children
}
