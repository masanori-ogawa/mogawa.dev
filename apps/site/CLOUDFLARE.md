# Cloudflare Workers Builds — Site
# Root directory: apps/site
# Build command: bun install && bun run build
# Deploy command: bunx wrangler deploy
# Build environment variables:
#   PUBLIC_API_URL=https://api.example.com
#   PUBLIC_SITE_URL=https://example.com
#
# Create a Deploy Hook in Workers Builds settings and set it as
# SITE_DEPLOY_HOOK_URL on the API Worker. Publishing a post will POST this hook.
