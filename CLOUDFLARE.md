# Cloudflare Workers Builds — Site

- Root directory: repository root
- Build command: `bun install && bun run build`
- Deploy command: `bunx wrangler deploy`
- Build environment variables:
  - `PUBLIC_SITE_URL=https://mogawa.dev`（本番オリジン。sitemap の絶対 URL に使う）

記事を追加・更新したら、Workers Builds で再デプロイすれば公開されます。
