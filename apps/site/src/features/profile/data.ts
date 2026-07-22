export const profile = {
  name: 'Masanori Ogawa',
  nameJa: '小川 雅紀',
  role: 'Web Engineer',
  location: 'Japan',
  summary:
    'フロントエンドを中心に、TypeScript / React でのプロダクト開発を行う Web エンジニアです。型安全な設計と、運用しやすい UI 実装を大切にしています。',
  skills: [
    'TypeScript',
    'React',
    'Next.js',
    'TanStack Start',
    'Hono',
    'Cloudflare Workers',
    'Drizzle ORM',
    'Tailwind CSS',
  ],
  links: [
    { label: 'GitHub', href: 'https://github.com/mogawa' },
    { label: 'X', href: 'https://x.com/mogawa' },
  ],
}

export const projects = [
  {
    title: 'Portfolio Platform',
    description:
      'TanStack Start / Hono / Turso で構築した、紹介ページとブログ管理を備えた個人ポートフォリオ基盤。',
    tags: ['TanStack Start', 'Hono', 'Turso', 'Clerk'],
    href: '/',
  },
  {
    title: 'Technical Blog',
    description:
      'HTML PostBody の記事投稿と、公開時の静的サイト再ビルドを組み合わせた学習用ブログ。',
    tags: ['SSG', 'HTML', 'Cloudflare'],
    href: '/blog',
  },
]
