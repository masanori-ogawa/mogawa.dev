# Security notes for this public repository

This project is designed to be open source. Security depends on secrets management and authorization, not on hiding source code.

## Never commit

- `.env`, `.env.local`, `.dev.vars`
- Turso auth tokens
- Clerk secret keys / JWT keys
- Deploy hook URLs
- Database dumps or production content exports

## Safe to commit

- Source code
- Drizzle schema and SQL migrations
- `.env.example` / `.dev.vars.example` without real values
- Clerk publishable keys only if you accept them as public client identifiers

## Required production controls

1. Store API secrets with `wrangler secret put` or the Cloudflare dashboard
2. Restrict CORS to the exact console origin
3. Enforce admin authorization in the API (`ADMIN_CLERK_USER_ID`)
4. Enable MFA / passkeys for the admin Clerk user
5. Disable or tightly control public sign-up for the console
6. Enable GitHub Secret scanning and Dependabot
7. Rotate any leaked secret immediately

## Incident response

If a secret is exposed:

1. Revoke / rotate it in the provider dashboard
2. Update Cloudflare / local env values
3. Review access logs if available
4. Do not rely on rewriting git history alone
