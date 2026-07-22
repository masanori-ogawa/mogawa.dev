import { useAuth } from '@clerk/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createAuthedApiClient, readApiError } from '#/lib/api'
import {
  fetchAdminPost,
  fetchAdminPosts,
  invalidatePosts,
  postKeys,
} from './postQueries'

export function usePostsQuery() {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: postKeys.all,
    queryFn: () => fetchAdminPosts(() => getToken()),
  })
}

export function usePostQuery(id: string | undefined, enabled: boolean) {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: id ? postKeys.detail(id) : ['posts', 'new'],
    queryFn: () => fetchAdminPost(() => getToken(), id!),
    enabled: enabled && Boolean(id),
  })
}

export function usePublishPostMutation() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const client = createAuthedApiClient(() => getToken())
      const response = await client.admin.posts[':id'].publish.$post({
        param: { id },
      })
      if (!response.ok) {
        throw new Error(await readApiError(response))
      }
      return response.json()
    },
    onSuccess: (_data, id) => invalidatePosts(queryClient, id),
  })
}

export function useUnpublishPostMutation() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const client = createAuthedApiClient(() => getToken())
      const response = await client.admin.posts[':id'].unpublish.$post({
        param: { id },
      })
      if (!response.ok) {
        throw new Error(await readApiError(response))
      }
      return response.json()
    },
    onSuccess: (_data, id) => invalidatePosts(queryClient, id),
  })
}

export function useDeletePostMutation() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const client = createAuthedApiClient(() => getToken())
      const response = await client.admin.posts[':id'].$delete({
        param: { id },
      })
      if (!response.ok) {
        throw new Error(await readApiError(response))
      }
      return response.json()
    },
    onSuccess: (_data, id) => invalidatePosts(queryClient, id),
  })
}

export function useRebuildSiteMutation() {
  const { getToken } = useAuth()
  return useMutation({
    mutationFn: async () => {
      const client = createAuthedApiClient(() => getToken())
      const response = await client.admin.site.rebuild.$post()
      if (!response.ok) {
        throw new Error(await readApiError(response))
      }
      return response.json()
    },
  })
}
