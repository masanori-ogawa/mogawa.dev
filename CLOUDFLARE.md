# Cloudflare Workers Builds — Site

- Root directory: repository root
- Build command: `bun install && bun run build`
- Deploy command: `bunx wrangler deploy`
- Build environment variables:
  - `PUBLIC_SITE_URL=https://example.com`

記事を追加・更新したら、Workers Builds で再デプロイすれば公開されます。
