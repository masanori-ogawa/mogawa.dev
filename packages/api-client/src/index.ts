import { hc } from 'hono/client'
import type { AppType } from '@mogawa/api/app-type'

export type ApiClient = ReturnType<typeof createApiClient>

type HeaderFactory = () =>
  | Record<string, string>
  | Promise<Record<string, string>>

export function createApiClient(
  baseUrl: string,
  options?: {
    headers?: Record<string, string> | HeaderFactory
    fetch?: typeof fetch
  },
) {
  return hc<AppType>(baseUrl.replace(/\/$/, ''), {
    headers: options?.headers,
    fetch: options?.fetch,
  })
}
