import type { Post, PostListItem } from '@mogawa/schemas'
import type { PostRow } from './schema'

export function normalizeOgImageUrl(
  value: string | null | undefined,
): string | null {
  if (!value || value.trim() === '') {
    return null
  }
  return value
}

export function toPostDto(row: PostRow): Post {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    body: row.body,
    ogImageUrl: row.ogImageUrl,
    status: row.status,
    publishedAt: row.publishedAt ? row.publishedAt.toISOString() : null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }
}

export function toPostListItemDto(row: PostRow): PostListItem {
  const { body: _body, ...rest } = toPostDto(row)
  return rest
}
