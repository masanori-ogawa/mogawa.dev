import { describe, expect, it } from 'vitest'
import { Hono } from 'hono'
import type { ApiEnv } from '../env'
import { createCorsMiddleware } from '../middleware/cors'

describe('createCorsMiddleware', () => {
  it('allows console origin', async () => {
    const app = new Hono<{ Bindings: ApiEnv }>()
      .use('*', createCorsMiddleware())
      .get('/health', (c) => c.json({ ok: true }))

    const response = await app.request(
      'http://localhost/health',
      {
        headers: {
          Origin: 'http://localhost:3001',
        },
      },
      {
        CONSOLE_ORIGIN: 'http://localhost:3001',
        SITE_ORIGIN: 'http://localhost:3000',
      } as ApiEnv,
    )

    expect(response.headers.get('Access-Control-Allow-Origin')).toBe(
      'http://localhost:3001',
    )
  })

  it('rejects unknown origin', async () => {
    const app = new Hono<{ Bindings: ApiEnv }>()
      .use('*', createCorsMiddleware())
      .get('/health', (c) => c.json({ ok: true }))

    const response = await app.request(
      'http://localhost/health',
      {
        headers: {
          Origin: 'https://evil.example',
        },
      },
      {
        CONSOLE_ORIGIN: 'http://localhost:3001',
        SITE_ORIGIN: 'http://localhost:3000',
      } as ApiEnv,
    )

    expect(response.headers.get('Access-Control-Allow-Origin')).toBeNull()
  })
})
