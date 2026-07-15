import { createApiClient } from '@mogawa/api-client'

export function getApiUrl() {
  return (import.meta.env.VITE_API_URL || 'http://localhost:8787').replace(
    /\/$/,
    '',
  )
}

export function createAuthedApiClient(getToken: () => Promise<string | null>) {
  return createApiClient(getApiUrl(), {
    headers: async (): Promise<Record<string, string>> => {
      const token = await getToken()
      if (!token) {
        return {}
      }
      return {
        Authorization: `Bearer ${token}`,
      }
    },
  })
}

export async function readApiError(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as { error?: string }
    return data.error || `Request failed (${response.status})`
  } catch {
    return `Request failed (${response.status})`
  }
}
