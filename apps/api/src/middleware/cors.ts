import { cors } from 'hono/cors'
import type { MiddlewareHandler } from 'hono'
import type { ApiEnv } from '../env'

export function createCorsMiddleware(): MiddlewareHandler<{
  Bindings: ApiEnv
}> {
  return cors({
    origin: (origin, c) => {
      const allowed = new Set(
        [c.env.CONSOLE_ORIGIN, c.env.SITE_ORIGIN].filter(Boolean),
      )
      if (origin && allowed.has(origin)) {
        return origin
      }
      return null
    },
    allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Authorization', 'Content-Type'],
    maxAge: 86400,
  })
}
