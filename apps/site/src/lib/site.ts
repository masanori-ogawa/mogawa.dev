export const SITE_NAME = 'Masanori Ogawa'
export const SITE_NAME_JA = '小川 雅紀'
export const SITE_TAGLINE = 'Web Engineer Portfolio'
export const SITE_DESCRIPTION =
  'Webエンジニア 小川雅紀のポートフォリオと技術ブログ。フロントエンド・フルスタック開発の実績と学びをまとめています。'

export function getSiteUrl() {
  return (
    import.meta.env.VITE_PUBLIC_SITE_URL ||
    import.meta.env.PUBLIC_SITE_URL ||
    process.env.PUBLIC_SITE_URL ||
    'http://localhost:3000'
  ).replace(/\/$/, '')
}

export function getApiUrl() {
  return (
    import.meta.env.VITE_PUBLIC_API_URL ||
    import.meta.env.PUBLIC_API_URL ||
    process.env.PUBLIC_API_URL ||
    'http://localhost:8787'
  ).replace(/\/$/, '')
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
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — ${SITE_TAGLINE}`
  const desc = description ?? SITE_DESCRIPTION
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
