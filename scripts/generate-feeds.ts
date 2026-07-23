import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { compareDesc, parseISO } from 'date-fns'

const siteUrl = process.env.PUBLIC_SITE_URL?.replace(/\/$/, '')
if (!siteUrl) {
  throw new Error(
    'PUBLIC_SITE_URL is required. Copy .env.example to .env.local for local builds.',
  )
}

type FeedPost = {
  slug: string
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
    const publishedAt =
      typeof data.publishedAt === 'string' ? data.publishedAt : null
    if (!publishedAt) {
      continue
    }
    posts.push({
      slug: file.replace(/\.mdx$/, ''),
      publishedAt,
      draft: data.draft === true,
    })
  }

  return posts
    .filter((post) => !post.draft)
    .sort((a, b) =>
      compareDesc(parseISO(a.publishedAt), parseISO(b.publishedAt)),
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

  const robots = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`

  const publicDir = path.resolve(import.meta.dirname, '../public')
  await mkdir(publicDir, { recursive: true })
  await writeFile(path.join(publicDir, 'sitemap.xml'), sitemap)
  await writeFile(path.join(publicDir, 'robots.txt'), robots)
  console.log(`[generate-feeds] wrote ${urls.length} sitemap URLs`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
