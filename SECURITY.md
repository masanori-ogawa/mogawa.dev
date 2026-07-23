# Security notes for this public repository

This project is designed to be open source. Security depends on secrets management, not on hiding source code.

## Never commit

- `.env`, `.env.local`, `.dev.vars`
- Cloudflare API tokens or deploy credentials
- Private keys or production dumps

## Safe to commit

- Source code
- MDX posts under `posts/`
- `.env.example` without real values

## Required production controls

1. Keep Workers deploy credentials out of the repository
2. Enable GitHub Secret scanning and Dependabot
3. Rotate any leaked secret immediately

## Incident response

If a secret is exposed:

1. Revoke / rotate it in the provider dashboard
2. Update Cloudflare / local env values
3. Review access logs if available
4. Do not rely on rewriting git history alone
