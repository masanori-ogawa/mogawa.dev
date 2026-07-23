# mogawa.dev

Webエンジニア向けの個人ブログです。トップが記事一覧になります。

## 構成

```text
src/                 TanStack Start — 公開サイト
posts/               MDX 記事
scripts/             sitemap 生成（ビルド時・PUBLIC_SITE_URL 必須）
```

## 技術スタック

- Frontend: TanStack Start / React / TypeScript / Tailwind CSS 4
- Blog: MDX + content-collections
- Deploy: Cloudflare Workers

## セットアップ

```bash
bun install
cp .env.example .env
bun run dev
```

- Site: http://localhost:3000

## 記事の追加

1. `posts/<slug>.mdx` を作成
2. frontmatter に `title` / `summary` / `publishedAt` を書く
3. 下書きにする場合は `draft: true` を付ける
4. push して再デプロイ

## 検証

```bash
bun run typecheck
bun run build
```

## Cloudflare デプロイ

[CLOUDFLARE.md](./CLOUDFLARE.md) を参照してください。

## 便利コマンド

```bash
bun run dev
bun run typecheck
bun run build
bun run deploy
```
