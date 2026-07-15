import type { QueryClient } from '@tanstack/react-query'
import type { Post, PostListItem } from '@mogawa/schemas'
import { createAuthedApiClient, readApiError } from './api'

export const postKeys = {
  all: ['posts'] as const,
  detail: (id: string) => ['posts', id] as const,
}

export async function fetchAdminPosts(
  getToken: () => Promise<string | null>,
): Promise<PostListItem[]> {
  const client = createAuthedApiClient(getToken)
  const response = await client.admin.posts.$get()
  if (!response.ok) {
    throw new Error(await readApiError(response))
  }
  const data = await response.json()
  if (!('posts' in data)) {
    throw new Error('Unexpected response')
  }
  return data.posts
}

export async function fetchAdminPost(
  getToken: () => Promise<string | null>,
  id: string,
): Promise<Post> {
  const client = createAuthedApiClient(getToken)
  const response = await client.admin.posts[':id'].$get({
    param: { id },
  })
  if (!response.ok) {
    throw new Error(await readApiError(response))
  }
  const data = await response.json()
  if (!('post' in data)) {
    throw new Error('Unexpected response')
  }
  return data.post
}

export function invalidatePosts(queryClient: QueryClient, id?: string) {
  void queryClient.invalidateQueries({ queryKey: postKeys.all })
  if (id) {
    void queryClient.invalidateQueries({ queryKey: postKeys.detail(id) })
  }
}
