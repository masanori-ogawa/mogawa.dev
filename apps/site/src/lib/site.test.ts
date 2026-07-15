import { describe, expect, it } from 'vitest'
import { SITE_NAME, seo } from './site'

describe('seo', () => {
  it('includes title and description meta', () => {
    const tags = seo({
      title: 'About',
      description: 'Self introduction',
      path: '/about',
    })

    expect(tags.some((tag) => 'title' in tag && tag.title?.includes(SITE_NAME))).toBe(
      true,
    )
    expect(
      tags.some(
        (tag) =>
          'name' in tag &&
          tag.name === 'description' &&
          tag.content === 'Self introduction',
      ),
    ).toBe(true)
  })
})
