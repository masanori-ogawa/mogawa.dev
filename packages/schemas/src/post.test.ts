import { describe, expect, it } from 'vitest'
import * as v from 'valibot'
import { createPostSchema, slugSchema, updatePostSchema } from './post'

describe('slugSchema', () => {
  it('accepts valid slugs', () => {
    expect(v.parse(slugSchema, 'hello-world')).toBe('hello-world')
  })

  it('rejects uppercase and underscores', () => {
    expect(() => v.parse(slugSchema, 'Hello_World')).toThrow()
  })

  it('rejects empty slug', () => {
    expect(() => v.parse(slugSchema, '')).toThrow()
  })
})

describe('createPostSchema', () => {
  it('defaults status to draft', () => {
    const result = v.parse(createPostSchema, {
      slug: 'first-post',
      title: 'First Post',
      summary: 'A short summary',
      body: '# Hello',
    })
    expect(result.status).toBe('draft')
  })

  it('rejects title longer than 200 chars', () => {
    expect(() =>
      v.parse(createPostSchema, {
        slug: 'long-title',
        title: 'a'.repeat(201),
        summary: 'summary',
        body: 'body',
      }),
    ).toThrow()
  })
})

describe('updatePostSchema', () => {
  it('allows partial updates', () => {
    const result = v.parse(updatePostSchema, {
      title: 'Updated',
    })
    expect(result.title).toBe('Updated')
  })
})
