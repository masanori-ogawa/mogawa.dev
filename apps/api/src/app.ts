import { Hono } from 'hono'
import { sValidator } from '@hono/standard-validator'
import { createPostSchema, updatePostSchema } from '@mogawa/schemas'
import type { ApiEnv } from './env'
import { createCorsMiddleware } from './middleware/cors'
import { requireAdmin, type AuthVariables } from './middleware/auth'
import { triggerSiteDeploy } from './services/deploy-site'
import {
  createPost,
  deletePost,
  getDb,
  getPostById,
  getPublishedPostBySlug,
  listAllPosts,
  listPublishedPosts,
  publishPost,
  unpublishPost,
  updatePost,
} from './services/posts'
import { isUniqueConstraintError } from './services/errors'

const app = new Hono<{ Bindings: ApiEnv; Variables: AuthVariables }>()
  .use('*', createCorsMiddleware())
  .get('/health', (c) => c.json({ ok: true as const }))
  .get('/posts', async (c) => {
    const db = getDb(c.env)
    const posts = await listPublishedPosts(db)
    return c.json({ posts })
  })
  .get('/posts/:slug', async (c) => {
    const db = getDb(c.env)
    const post = await getPublishedPostBySlug(db, c.req.param('slug'))
    if (!post) {
      return c.json({ error: 'Not found' }, 404)
    }
    return c.json({ post })
  })
  .get('/admin/posts', requireAdmin, async (c) => {
    const db = getDb(c.env)
    const posts = await listAllPosts(db)
    return c.json({ posts })
  })
  .get('/admin/posts/:id', requireAdmin, async (c) => {
    const db = getDb(c.env)
    const post = await getPostById(db, c.req.param('id'))
    if (!post) {
      return c.json({ error: 'Not found' }, 404)
    }
    return c.json({ post })
  })
  .post(
    '/admin/posts',
    requireAdmin,
    sValidator('json', createPostSchema),
    async (c) => {
      const db = getDb(c.env)
      const input = c.req.valid('json')
      try {
        const post = await createPost(db, input)
        if (post?.status === 'published') {
          c.executionCtx.waitUntil(
            triggerSiteDeploy(c.env.SITE_DEPLOY_HOOK_URL).then(() => undefined),
          )
        }
        return c.json({ post }, 201)
      } catch (error) {
        if (isUniqueConstraintError(error)) {
          return c.json({ error: 'Slug already exists' }, 409)
        }
        throw error
      }
    },
  )
  .patch(
    '/admin/posts/:id',
    requireAdmin,
    sValidator('json', updatePostSchema),
    async (c) => {
      const db = getDb(c.env)
      const input = c.req.valid('json')
      try {
        const before = await getPostById(db, c.req.param('id'))
        if (!before) {
          return c.json({ error: 'Not found' }, 404)
        }
        const post = await updatePost(db, c.req.param('id'), input)
        if (!post) {
          return c.json({ error: 'Not found' }, 404)
        }
        const shouldRebuild =
          post.status === 'published' || before.status === 'published'
        if (shouldRebuild) {
          c.executionCtx.waitUntil(
            triggerSiteDeploy(c.env.SITE_DEPLOY_HOOK_URL).then(() => undefined),
          )
        }
        return c.json({ post })
      } catch (error) {
        if (isUniqueConstraintError(error)) {
          return c.json({ error: 'Slug already exists' }, 409)
        }
        throw error
      }
    },
  )
  .delete('/admin/posts/:id', requireAdmin, async (c) => {
    const db = getDb(c.env)
    const post = await deletePost(db, c.req.param('id'))
    if (!post) {
      return c.json({ error: 'Not found' }, 404)
    }
    if (post.status === 'published') {
      c.executionCtx.waitUntil(
        triggerSiteDeploy(c.env.SITE_DEPLOY_HOOK_URL).then(() => undefined),
      )
    }
    return c.json({ post })
  })
  .post('/admin/posts/:id/publish', requireAdmin, async (c) => {
    const db = getDb(c.env)
    const post = await publishPost(db, c.req.param('id'))
    if (!post) {
      return c.json({ error: 'Not found' }, 404)
    }
    c.executionCtx.waitUntil(
      triggerSiteDeploy(c.env.SITE_DEPLOY_HOOK_URL).then(() => undefined),
    )
    return c.json({ post })
  })
  .post('/admin/posts/:id/unpublish', requireAdmin, async (c) => {
    const db = getDb(c.env)
    const before = await getPostById(db, c.req.param('id'))
    if (!before) {
      return c.json({ error: 'Not found' }, 404)
    }
    const post = await unpublishPost(db, c.req.param('id'))
    if (!post) {
      return c.json({ error: 'Not found' }, 404)
    }
    if (before.status === 'published') {
      c.executionCtx.waitUntil(
        triggerSiteDeploy(c.env.SITE_DEPLOY_HOOK_URL).then(() => undefined),
      )
    }
    return c.json({ post })
  })
  .post('/admin/site/rebuild', requireAdmin, async (c) => {
    const result = await triggerSiteDeploy(c.env.SITE_DEPLOY_HOOK_URL)
    if (!result.ok) {
      return c.json({ error: result.message }, 502)
    }
    return c.json({ ok: true as const, message: result.message })
  })

export type AppType = typeof app
export { app }
