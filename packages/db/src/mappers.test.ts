import type { PostRow } from './schema'
import { normalizeOgImageUrl, toPostDto, toPostListItemDto } from './mappers'
import { describe, expect, it } from 'vitest'

const baseRow: PostRow = {
  id: '1',
  slug: 'hello',
  title: 'Hello',
  summary: 'Summary',
  body: '# Body',
  ogImageUrl: null,
  status: 'published',
  publishedAt: new Date('2026-01-01T00:00:00.000Z'),
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-02T00:00:00.000Z'),
}

describe('mappers', () => {
  it('normalizes empty og image urls to null', () => {
    expect(normalizeOgImageUrl('')).toBeNull()
    expect(normalizeOgImageUrl('  ')).toBeNull()
    expect(normalizeOgImageUrl('https://example.com/og.png')).toBe(
      'https://example.com/og.png',
    )
  })

  it('maps post dto timestamps to ISO strings', () => {
    const dto = toPostDto(baseRow)
    expect(dto.publishedAt).toBe('2026-01-01T00:00:00.000Z')
    expect(dto.createdAt).toBe('2026-01-01T00:00:00.000Z')
  })

  it('omits body from list item dto', () => {
    const item = toPostListItemDto(baseRow)
    expect(item).not.toHaveProperty('body')
    expect(item.slug).toBe('hello')
  })
})
