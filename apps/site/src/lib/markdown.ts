import { marked } from 'marked'
import DOMPurify from 'isomorphic-dompurify'

marked.use({ gfm: true, breaks: true })

export function markdownToHtml(markdown: string): string {
  const raw = marked.parse(markdown, { async: false }) as string
  return DOMPurify.sanitize(raw, {
    USE_PROFILES: { html: true },
  })
}
