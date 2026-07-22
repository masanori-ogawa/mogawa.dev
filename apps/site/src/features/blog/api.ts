import { createApiClient } from '@mogawa/api-client'
import type { Post, PostListItem } from '@mogawa/schemas'
import { getApiUrl } from '#/lib/site'

export function getPublicApiClient() {
  return createApiClient(getApiUrl())
}

export async function fetchPublishedPosts(): Promise<PostListItem[]> {
  try {
    const client = getPublicApiClient()
    const response = await client.posts.$get()
    if (!response.ok) {
      console.warn(`Failed to fetch posts: ${response.status}`)
      return []
    }
    const data = await response.json()
    if ('posts' in data) {
      return data.posts
    }
    return []
  } catch (error) {
    console.warn('Failed to fetch published posts', error)
    return []
  }
}

export async function fetchPublishedPost(slug: string): Promise<Post | null> {
  try {
    const client = getPublicApiClient()
    const response = await client.posts[':slug'].$get({
      param: { slug },
    })
    if (!response.ok) {
      return null
    }
    const data = await response.json()
    if ('post' in data) {
      return data.post
    }
    return null
  } catch (error) {
    console.warn(`Failed to fetch post ${slug}`, error)
    return null
  }
}
