import { and, desc, eq } from 'drizzle-orm'
import {
  createDb,
  normalizeOgImageUrl,
  posts,
  toPostDto,
  toPostListItemDto,
  type Database,
} from '@mogawa/db'
import type { CreatePostInput, UpdatePostInput } from '@mogawa/schemas'
import type { ApiEnv } from '../env'

export function getDb(env: ApiEnv): Database {
  return createDb(env.TURSO_DATABASE_URL, env.TURSO_AUTH_TOKEN)
}

export async function listPublishedPosts(db: Database) {
  const rows = await db
    .select()
    .from(posts)
    .where(eq(posts.status, 'published'))
    .orderBy(desc(posts.publishedAt))
  return rows.map(toPostListItemDto)
}

export async function getPublishedPostBySlug(db: Database, slug: string) {
  const rows = await db
    .select()
    .from(posts)
    .where(and(eq(posts.slug, slug), eq(posts.status, 'published')))
    .limit(1)
  return rows[0] ? toPostDto(rows[0]) : null
}

export async function listAllPosts(db: Database) {
  const rows = await db.select().from(posts).orderBy(desc(posts.updatedAt))
  return rows.map(toPostListItemDto)
}

export async function getPostById(db: Database, id: string) {
  const rows = await db.select().from(posts).where(eq(posts.id, id)).limit(1)
  return rows[0] ? toPostDto(rows[0]) : null
}

export async function createPost(db: Database, input: CreatePostInput) {
  const now = new Date()
  const status = input.status ?? 'draft'
  const id = crypto.randomUUID()

  await db.insert(posts).values({
    id,
    slug: input.slug,
    title: input.title,
    summary: input.summary,
    body: input.body,
    ogImageUrl: normalizeOgImageUrl(input.ogImageUrl),
    status,
    publishedAt: status === 'published' ? now : null,
    createdAt: now,
    updatedAt: now,
  })

  return getPostById(db, id)
}

export async function updatePost(
  db: Database,
  id: string,
  input: UpdatePostInput,
) {
  const existing = await db.select().from(posts).where(eq(posts.id, id)).limit(1)
  if (!existing[0]) {
    return null
  }

  const now = new Date()
  const nextStatus = input.status ?? existing[0].status
  let publishedAt = existing[0].publishedAt

  if (nextStatus === 'published' && existing[0].status !== 'published') {
    publishedAt = now
  }
  if (nextStatus === 'draft') {
    publishedAt = null
  }

  await db
    .update(posts)
    .set({
      ...(input.slug !== undefined ? { slug: input.slug } : {}),
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.summary !== undefined ? { summary: input.summary } : {}),
      ...(input.body !== undefined ? { body: input.body } : {}),
      ...(input.ogImageUrl !== undefined
        ? { ogImageUrl: normalizeOgImageUrl(input.ogImageUrl) }
        : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
      publishedAt,
      updatedAt: now,
    })
    .where(eq(posts.id, id))

  return getPostById(db, id)
}

export async function deletePost(db: Database, id: string) {
  const existing = await getPostById(db, id)
  if (!existing) {
    return null
  }
  await db.delete(posts).where(eq(posts.id, id))
  return existing
}

export async function publishPost(db: Database, id: string) {
  return updatePost(db, id, { status: 'published' })
}

export async function unpublishPost(db: Database, id: string) {
  return updatePost(db, id, { status: 'draft' })
}
