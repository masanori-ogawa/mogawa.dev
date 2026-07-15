export type ApiEnv = {
  TURSO_DATABASE_URL: string
  TURSO_AUTH_TOKEN: string
  CLERK_SECRET_KEY: string
  CLERK_PUBLISHABLE_KEY: string
  CLERK_JWT_KEY?: string
  ADMIN_CLERK_USER_ID: string
  SITE_DEPLOY_HOOK_URL?: string
  CONSOLE_ORIGIN: string
  SITE_ORIGIN: string
}
