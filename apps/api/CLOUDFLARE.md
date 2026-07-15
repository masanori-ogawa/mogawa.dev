# Cloudflare Workers Builds — API
# Root directory: apps/api
# Build command: bun install && bun run build
# Deploy command: bunx wrangler deploy
# Secrets (via dashboard / wrangler secret put):
#   TURSO_DATABASE_URL
#   TURSO_AUTH_TOKEN
#   CLERK_SECRET_KEY
#   CLERK_PUBLISHABLE_KEY
#   CLERK_JWT_KEY (optional)
#   ADMIN_CLERK_USER_ID
#   SITE_DEPLOY_HOOK_URL
# Vars:
#   CONSOLE_ORIGIN=https://console.example.com
#   SITE_ORIGIN=https://example.com
