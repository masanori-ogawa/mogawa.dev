# Cloudflare Workers Builds — Console
# Root directory: apps/console
# Build command: bun install && bun run build
# Deploy command: bunx wrangler deploy
# Build / runtime environment variables:
#   VITE_CLERK_PUBLISHABLE_KEY=pk_...
#   VITE_API_URL=https://api.example.com
#
# In Clerk Dashboard:
# - Add console production URL to allowed origins
# - Restrict sign-up if this console is owner-only
# - Enable MFA / passkeys for the admin account
