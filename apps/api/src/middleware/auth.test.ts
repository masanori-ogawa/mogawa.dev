import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Hono } from 'hono'
import type { ApiEnv } from '../env'
import { requireAdmin } from './auth'

const authenticateRequest = vi.fn()

vi.mock('@clerk/backend', () => ({
  createClerkClient: () => ({
    authenticateRequest,
  }),
}))

function createApp() {
  return new Hono<{ Bindings: ApiEnv; Variables: { userId: string } }>().get(
    '/admin/ping',
    requireAdmin,
    (c) => c.json({ userId: c.get('userId') }),
  )
}

const env = {
  CLERK_SECRET_KEY: 'sk_test',
  CLERK_PUBLISHABLE_KEY: 'pk_test',
  ADMIN_CLERK_USER_ID: 'user_admin',
  CONSOLE_ORIGIN: 'http://localhost:3001',
  SITE_ORIGIN: 'http://localhost:3000',
} as ApiEnv

describe('requireAdmin', () => {
  beforeEach(() => {
    authenticateRequest.mockReset()
  })

  it('returns 401 when unauthenticated', async () => {
    authenticateRequest.mockResolvedValue({ isAuthenticated: false })
    const app = createApp()
    const response = await app.request('http://localhost/admin/ping', {}, env)
    expect(response.status).toBe(401)
  })

  it('returns 403 when authenticated but not admin', async () => {
    authenticateRequest.mockResolvedValue({
      isAuthenticated: true,
      toAuth: () => ({ userId: 'user_other' }),
    })
    const app = createApp()
    const response = await app.request('http://localhost/admin/ping', {}, env)
    expect(response.status).toBe(403)
  })

  it('allows admin user', async () => {
    authenticateRequest.mockResolvedValue({
      isAuthenticated: true,
      toAuth: () => ({ userId: 'user_admin' }),
    })
    const app = createApp()
    const response = await app.request('http://localhost/admin/ping', {}, env)
    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ userId: 'user_admin' })
  })
})
