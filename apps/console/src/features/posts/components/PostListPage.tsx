import { useNavigate } from '@tanstack/react-router'
import { Alert, Button, Chip } from '@heroui/react'
import {
  useDeletePostMutation,
  usePostsQuery,
  usePublishPostMutation,
  useRebuildSiteMutation,
  useUnpublishPostMutation,
} from '#/features/posts/hooks/usePostMutations'

export function PostListPage() {
  const navigate = useNavigate()
  const postsQuery = usePostsQuery()
  const rebuildMutation = useRebuildSiteMutation()
  const publishMutation = usePublishPostMutation()
  const unpublishMutation = useUnpublishPostMutation()
  const deleteMutation = useDeletePostMutation()

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Posts</h1>
          <p className="mt-1 text-slate-600">
            記事の作成・公開・再ビルドを管理します。
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="secondary"
            isDisabled={rebuildMutation.isPending}
            onPress={() => rebuildMutation.mutate()}
          >
            {rebuildMutation.isPending ? '再ビルド中…' : 'サイトを再ビルド'}
          </Button>
          <Button
            variant="primary"
            onPress={() => void navigate({ to: '/posts/new' })}
          >
            新規作成
          </Button>
        </div>
      </div>

      {rebuildMutation.isError ? (
        <Alert status="danger">
          <Alert.Content>
            <Alert.Description>
              {(rebuildMutation.error as Error).message}
            </Alert.Description>
          </Alert.Content>
        </Alert>
      ) : null}
      {rebuildMutation.isSuccess ? (
        <Alert status="success">
          <Alert.Content>
            <Alert.Description>
              サイトの再ビルドを開始しました。反映まで少し時間がかかる場合があります。
            </Alert.Description>
          </Alert.Content>
        </Alert>
      ) : null}

      {postsQuery.isLoading ? (
        <p className="text-slate-500">読み込み中…</p>
      ) : null}
      {postsQuery.isError ? (
        <Alert status="danger">
          <Alert.Content>
            <Alert.Description>
              {(postsQuery.error as Error).message}
            </Alert.Description>
          </Alert.Content>
        </Alert>
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
                      <Chip
                        color={
                          post.status === 'published' ? 'success' : 'default'
                        }
                        size="sm"
                      >
                        <Chip.Label>{post.status}</Chip.Label>
                      </Chip>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">/{post.slug}</p>
                    <p className="mt-2 text-sm text-slate-600">{post.summary}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onPress={() =>
                        void navigate({
                          to: '/posts/$id',
                          params: { id: post.id },
                        })
                      }
                    >
                      編集
                    </Button>
                    {post.status === 'published' ? (
                      <Button
                        variant="secondary"
                        size="sm"
                        onPress={() => unpublishMutation.mutate(post.id)}
                      >
                        非公開
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        size="sm"
                        onPress={() => publishMutation.mutate(post.id)}
                      >
                        公開
                      </Button>
                    )}
                    <Button
                      variant="danger"
                      size="sm"
                      onPress={() => {
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
                    </Button>
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
