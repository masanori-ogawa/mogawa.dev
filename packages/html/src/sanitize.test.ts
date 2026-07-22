import { describe, expect, it } from 'vitest'
import { sanitizePostBody } from './sanitize'

describe('sanitizePostBody', () => {
  it('keeps allowed formatting tags', () => {
    const html = sanitizePostBody(
      '<h1>Title</h1><p>Hello <strong>world</strong></p><pre><code>const x = 1</code></pre>',
    )
    expect(html).toContain('<h1>')
    expect(html).toContain('<strong>')
    expect(html).toContain('<code>')
  })

  it('removes script tags', () => {
    const html = sanitizePostBody(
      '<p>Safe</p><script>alert(1)</script><img src=x onerror=alert(1)>',
    )
    expect(html).not.toContain('<script>')
    expect(html).not.toContain('onerror')
    expect(html).toContain('<p>Safe</p>')
  })

  it('keeps safe links and images', () => {
    const html = sanitizePostBody(
      '<p><a href="https://example.com" target="_blank" rel="noopener">link</a></p><img src="https://example.com/a.png" alt="a">',
    )
    expect(html).toContain('href="https://example.com"')
    expect(html).toContain('src="https://example.com/a.png"')
  })
})
