import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { createApiClient } from '@mogawa/api-client'

const siteUrl = (process.env.PUBLIC_SITE_URL || 'http://localhost:3000').replace(
  /\/$/,
  '',
)
const apiUrl = (process.env.PUBLIC_API_URL || 'http://localhost:8787').replace(
  /\/$/,
  '',
)

async function main() {
  const client = createApiClient(apiUrl)
  let posts: Array<{
    slug: string
    title: string
    summary: string
    publishedAt: string | null
    updatedAt: string
  }> = []

  try {
    const response = await client.posts.$get()
    if (response.ok) {
      const data = await response.json()
      if ('posts' in data) {
        posts = data.posts
      }
    }
  } catch {
    console.warn('[generate-feeds] API unavailable; writing empty feeds')
  }

  const staticPaths = ['/', '/about', '/projects', '/blog']
  const postPaths = posts.map((post) => `/blog/${post.slug}`)
  const urls = [...staticPaths, ...postPaths]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (loc) => `  <url>
    <loc>${siteUrl}${loc}</loc>
  </url>`,
  )
  .join('\n')}
</urlset>
`

  const rssItems = posts
    .map((post) => {
      const link = `${siteUrl}/blog/${post.slug}`
      return `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${link}</link>
      <guid>${link}</guid>
      <description><![CDATA[${post.summary}]]></description>
      ${post.publishedAt ? `<pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>` : ''}
    </item>`
    })
    .join('\n')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Masanori Ogawa Blog</title>
    <link>${siteUrl}/blog</link>
    <description>Technical notes and learning logs by Masanori Ogawa.</description>
${rssItems}
  </channel>
</rss>
`

  const robots = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`

  const publicDir = path.resolve(import.meta.dirname, '../public')
  await mkdir(publicDir, { recursive: true })
  await writeFile(path.join(publicDir, 'sitemap.xml'), sitemap)
  await writeFile(path.join(publicDir, 'rss.xml'), rss)
  await writeFile(path.join(publicDir, 'robots.txt'), robots)
  console.log(`[generate-feeds] wrote ${urls.length} sitemap URLs`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
