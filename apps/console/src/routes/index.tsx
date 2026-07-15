import { Link, createFileRoute } from '@tanstack/react-router'
import { useAuth } from '@clerk/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  fetchAdminPosts,
  invalidatePosts,
  postKeys,
} from '#/lib/posts'
import { createAuthedApiClient, readApiError } from '#/lib/api'

export const Route = createFileRoute('/')({
  component: PostsPage,
})

function PostsPage() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  const postsQuery = useQuery({
    queryKey: postKeys.all,
    queryFn: () => fetchAdminPosts(() => getToken()),
  })

  const rebuildMutation = useMutation({
    mutationFn: async () => {
      const client = createAuthedApiClient(() => getToken())
      const response = await client.admin.site.rebuild.$post()
      if (!response.ok) {
        throw new Error(await readApiError(response))
      }
      return response.json()
    },
  })

  const publishMutation = useMutation({
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

  const unpublishMutation = useMutation({
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

  const deleteMutation = useMutation({
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

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Posts</h1>
          <p className="mt-1 text-slate-600">記事の作成・公開・再ビルドを管理します。</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => rebuildMutation.mutate()}
            disabled={rebuildMutation.isPending}
            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50 disabled:opacity-60"
          >
            {rebuildMutation.isPending ? '再ビルド中…' : 'サイトを再ビルド'}
          </button>
          <Link
            to="/posts/new"
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
          >
            新規作成
          </Link>
        </div>
      </div>

      {rebuildMutation.isError ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {(rebuildMutation.error as Error).message}
        </p>
      ) : null}
      {rebuildMutation.isSuccess ? (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          サイトの再ビルドを開始しました。反映まで少し時間がかかる場合があります。
        </p>
      ) : null}

      {postsQuery.isLoading ? (
        <p className="text-slate-500">読み込み中…</p>
      ) : null}
      {postsQuery.isError ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {(postsQuery.error as Error).message}
        </p>
      ) : null}

      {postsQuery.data ? (
        postsQuery.data.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-slate-500">
            まだ記事がありません。最初の下書きを作成しましょう。
          </p>
        ) : (
          <ul className="space-y-3">
            {postsQuery.data.map((post) => (
              <li
                key={post.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-semibold">{post.title}</h2>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          post.status === 'published'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {post.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">/{post.slug}</p>
                    <p className="mt-2 text-sm text-slate-600">{post.summary}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      to="/posts/$id"
                      params={{ id: post.id }}
                      className="rounded-full border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50"
                    >
                      編集
                    </Link>
                    {post.status === 'published' ? (
                      <button
                        type="button"
                        className="rounded-full border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50"
                        onClick={() => unpublishMutation.mutate(post.id)}
                      >
                        非公開
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-sm text-emerald-700 hover:bg-emerald-100"
                        onClick={() => publishMutation.mutate(post.id)}
                      >
                        公開
                      </button>
                    )}
                    <button
                      type="button"
                      className="rounded-full border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
                      onClick={() => {
                        if (
                          window.confirm(
                            `「${post.title}」を削除しますか？この操作は取り消せません。`,
                          )
                        ) {
                          deleteMutation.mutate(post.id)
                        }
                      }}
                    >
                      削除
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )
      ) : null}
    </div>
  )
}
