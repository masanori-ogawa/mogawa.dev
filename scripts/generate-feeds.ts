import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const siteUrl = (process.env.PUBLIC_SITE_URL || 'http://localhost:3000').replace(
  /\/$/,
  '',
)

type FeedPost = {
  slug: string
  title: string
  summary: string
  publishedAt: string
  draft?: boolean
}

function parseFrontmatter(raw: string): Record<string, unknown> {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) {
    return {}
  }

  const data: Record<string, unknown> = {}
  for (const line of match[1].split(/\r?\n/)) {
    const separator = line.indexOf(':')
    if (separator === -1) {
      continue
    }
    const key = line.slice(0, separator).trim()
    let value = line.slice(separator + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (value === 'true' || value === 'false') {
      data[key] = value === 'true'
      continue
    }
    data[key] = value
  }
  return data
}

async function loadPosts(): Promise<FeedPost[]> {
  const postsDir = path.resolve(import.meta.dirname, '../posts')
  const files = await readdir(postsDir)
  const posts: FeedPost[] = []

  for (const file of files) {
    if (!file.endsWith('.mdx')) {
      continue
    }
    const raw = await readFile(path.join(postsDir, file), 'utf8')
    const data = parseFrontmatter(raw)
    const title = typeof data.title === 'string' ? data.title : null
    const summary = typeof data.summary === 'string' ? data.summary : null
    const publishedAt =
      typeof data.publishedAt === 'string' ? data.publishedAt : null
    if (!title || !summary || !publishedAt) {
      continue
    }
    posts.push({
      slug: file.replace(/\.mdx$/, ''),
      title,
      summary,
      publishedAt,
      draft: data.draft === true,
    })
  }

  return posts
    .filter((post) => !post.draft)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    )
}

async function main() {
  const posts = await loadPosts()

  const staticPaths = ['/']
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
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
    </item>`
    })
    .join('\n')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Masanori Ogawa Blog</title>
    <link>${siteUrl}/</link>
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
