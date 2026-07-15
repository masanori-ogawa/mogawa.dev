import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useAuth } from '@clerk/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as v from 'valibot'
import { createPostSchema, updatePostSchema } from '@mogawa/schemas'
import { createAuthedApiClient, readApiError } from '#/lib/api'
import { markdownToHtml } from '#/lib/markdown'
import {
  fetchAdminPost,
  invalidatePosts,
  postKeys,
} from '#/lib/posts'

export function PostEditor({
  mode,
  postId,
}: {
  mode: 'create' | 'edit'
  postId?: string
}) {
  const navigate = useNavigate()
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  const existingQuery = useQuery({
    queryKey: postId ? postKeys.detail(postId) : ['posts', 'new'],
    queryFn: () => fetchAdminPost(() => getToken(), postId!),
    enabled: mode === 'edit' && Boolean(postId),
  })

  const [slug, setSlug] = useState('')
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [body, setBody] = useState('')
  const [ogImageUrl, setOgImageUrl] = useState('')
  const [status, setStatus] = useState<'draft' | 'published'>('draft')
  const [error, setError] = useState<string | null>(null)
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    if (existingQuery.data) {
      setSlug(existingQuery.data.slug)
      setTitle(existingQuery.data.title)
      setSummary(existingQuery.data.summary)
      setBody(existingQuery.data.body)
      setOgImageUrl(existingQuery.data.ogImageUrl ?? '')
      setStatus(existingQuery.data.status)
      setDirty(false)
    }
  }, [existingQuery.data])

  useEffect(() => {
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!dirty) return
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [dirty])

  const previewHtml = useMemo(() => markdownToHtml(body || ''), [body])

  const saveMutation = useMutation({
    mutationFn: async () => {
      setError(null)
      const payload = {
        slug,
        title,
        summary,
        body,
        ogImageUrl: ogImageUrl || null,
        status,
      }

      if (mode === 'create') {
        const parsed = v.parse(createPostSchema, payload)
        const client = createAuthedApiClient(() => getToken())
        const response = await client.admin.posts.$post({
          json: parsed,
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

      const parsed = v.parse(updatePostSchema, payload)
      const client = createAuthedApiClient(() => getToken())
      const response = await client.admin.posts[':id'].$patch({
        param: { id: postId! },
        json: parsed,
      })
      if (!response.ok) {
        throw new Error(await readApiError(response))
      }
      const data = await response.json()
      if (!('post' in data)) {
        throw new Error('Unexpected response')
      }
      return data.post
    },
    onSuccess: (post) => {
      if (!post) {
        setError('保存結果を取得できませんでした')
        return
      }
      setDirty(false)
      invalidatePosts(queryClient, post.id)
      void navigate({ to: '/posts/$id', params: { id: post.id } })
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : '保存に失敗しました')
    },
  })

  if (mode === 'edit' && existingQuery.isLoading) {
    return <p className="text-slate-500">記事を読み込み中…</p>
  }

  if (mode === 'edit' && existingQuery.isError) {
    return (
      <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {(existingQuery.error as Error).message}
      </p>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link to="/" className="text-sm text-blue-600 hover:text-blue-800">
            ← 一覧へ
          </Link>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            {mode === 'create' ? '新規記事' : '記事を編集'}
          </h1>
        </div>
        <button
          type="button"
          disabled={saveMutation.isPending}
          onClick={() => saveMutation.mutate()}
          className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60"
        >
          {saveMutation.isPending ? '保存中…' : '保存する'}
        </button>
      </div>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <form
          className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          onSubmit={(event) => {
            event.preventDefault()
            saveMutation.mutate()
          }}
          onChange={() => setDirty(true)}
        >
          <Field label="Title">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2"
              required
            />
          </Field>
          <Field label="Slug">
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 font-mono text-sm"
              required
            />
          </Field>
          <Field label="Summary">
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="min-h-24 w-full rounded-xl border border-slate-300 px-3 py-2"
              required
            />
          </Field>
          <Field label="OG Image URL (optional)">
            <input
              value={ogImageUrl}
              onChange={(e) => setOgImageUrl(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2"
              placeholder="https://..."
            />
          </Field>
          <Field label="Status">
            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as 'draft' | 'published')
              }
              className="w-full rounded-xl border border-slate-300 px-3 py-2"
            >
              <option value="draft">draft</option>
              <option value="published">published</option>
            </select>
          </Field>
          <Field label="Body (Markdown)">
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="min-h-80 w-full rounded-xl border border-slate-300 px-3 py-2 font-mono text-sm"
              required
            />
          </Field>
        </form>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-medium text-slate-500">Preview</h2>
          <div
            className="prose prose-slate mt-4 max-w-none"
            dangerouslySetInnerHTML={{ __html: previewHtml }}
          />
        </section>
      </div>
    </div>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  )
}
