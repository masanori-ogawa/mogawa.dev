export function getSiteUrl() {
  const siteUrl = (
    import.meta.env.VITE_PUBLIC_SITE_URL ||
    process.env.VITE_PUBLIC_SITE_URL ||
    ''
  ).replace(/\/$/, '')

  if (!siteUrl) {
    throw new Error(
      'VITE_PUBLIC_SITE_URL is required. Copy .env.example to .env.local for local development.',
    )
  }

  return siteUrl
}

export function seo({
  title,
  description,
  path = '/',
  image,
  type = 'website',
}: {
  title?: string
  description?: string
  path?: string
  image?: string | null
  type?: 'website' | 'article'
}) {
  const siteUrl = getSiteUrl()
  const fullTitle = title
    ? `${title} | Masanori Ogawa`
    : 'Masanori Ogawa — Web Engineer Portfolio'
  const desc =
    description ??
    'Webエンジニア 小川匡教のポートフォリオと技術ブログ。フロントエンド・フルスタック開発の実績と学びをまとめています。'
  const url = `${siteUrl}${path}`
  const ogImage = image || `${siteUrl}/og-default.svg`

  return [
    { title: fullTitle },
    { name: 'description', content: desc },
    { property: 'og:title', content: fullTitle },
    { property: 'og:description', content: desc },
    { property: 'og:url', content: url },
    { property: 'og:type', content: type },
    { property: 'og:image', content: ogImage },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: fullTitle },
    { name: 'twitter:description', content: desc },
    { name: 'twitter:image', content: ogImage },
  ]
}
