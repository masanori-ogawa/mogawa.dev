import { createMiddleware } from 'hono/factory'
import { createClerkClient } from '@clerk/backend'
import type { ApiEnv } from '../env'

export type AuthVariables = {
  userId: string
}

export const requireAdmin = createMiddleware<{
  Bindings: ApiEnv
  Variables: AuthVariables
}>(async (c, next) => {
  const clerk = createClerkClient({
    secretKey: c.env.CLERK_SECRET_KEY,
    publishableKey: c.env.CLERK_PUBLISHABLE_KEY,
  })

  const authorizedParties = [c.env.CONSOLE_ORIGIN].filter(Boolean)

  const requestState = await clerk.authenticateRequest(c.req.raw, {
    authorizedParties,
    jwtKey: c.env.CLERK_JWT_KEY || undefined,
  })

  if (!requestState.isAuthenticated) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  const auth = requestState.toAuth()
  const userId = auth.userId

  if (!userId || userId !== c.env.ADMIN_CLERK_USER_ID) {
    return c.json({ error: 'Forbidden' }, 403)
  }

  c.set('userId', userId)
  await next()
})
