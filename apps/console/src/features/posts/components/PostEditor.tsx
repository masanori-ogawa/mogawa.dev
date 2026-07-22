import { useEffect, useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useAuth } from '@clerk/react'
import { useQueryClient } from '@tanstack/react-query'
import { useForm } from '@tanstack/react-form'
import {
  Alert,
  Button,
  FieldError,
  Input,
  Label,
  ListBox,
  Select,
  TextArea,
  TextField,
} from '@heroui/react'
import * as v from 'valibot'
import { createPostSchema, slugSchema } from '@mogawa/schemas'
import { createAuthedApiClient, readApiError } from '#/lib/api'
import { invalidatePosts } from '#/features/posts/hooks/postQueries'
import { usePostQuery } from '#/features/posts/hooks/usePostMutations'
import { PostBodyEditor } from './PostBodyEditor'

const postFormSchema = v.object({
  slug: slugSchema,
  title: v.pipe(
    v.string(),
    v.minLength(1, 'タイトルは必須です'),
    v.maxLength(200, 'タイトルは200文字以内にしてください'),
  ),
  summary: v.pipe(
    v.string(),
    v.minLength(1, '概要は必須です'),
    v.maxLength(500, '概要は500文字以内にしてください'),
  ),
  body: v.pipe(v.string(), v.minLength(1, '本文は必須です')),
  ogImageUrl: v.string(),
  status: v.picklist(['draft', 'published']),
})

type PostFormValues = v.InferInput<typeof postFormSchema>

const emptyValues: PostFormValues = {
  slug: '',
  title: '',
  summary: '',
  body: '',
  ogImageUrl: '',
  status: 'draft',
}

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
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [dirty, setDirty] = useState(false)
  const [hydrated, setHydrated] = useState(mode === 'create')

  const existingQuery = usePostQuery(postId, mode === 'edit')

  const form = useForm({
    defaultValues: emptyValues,
    validators: {
      onSubmit: postFormSchema,
    },
    onSubmit: async ({ value }) => {
      setSubmitError(null)
      const payload = v.parse(createPostSchema, {
        ...value,
        ogImageUrl: value.ogImageUrl || null,
      })

      try {
        if (mode === 'create') {
          const client = createAuthedApiClient(() => getToken())
          const response = await client.admin.posts.$post({
            json: payload,
          })
          if (!response.ok) {
            throw new Error(await readApiError(response))
          }
          const data = await response.json()
          if (!('post' in data) || !data.post) {
            throw new Error('Unexpected response')
          }
          setDirty(false)
          invalidatePosts(queryClient, data.post.id)
          void navigate({ to: '/posts/$id', params: { id: data.post.id } })
          return
        }

        const client = createAuthedApiClient(() => getToken())
        const response = await client.admin.posts[':id'].$patch({
          param: { id: postId! },
          json: payload,
        })
        if (!response.ok) {
          throw new Error(await readApiError(response))
        }
        const data = await response.json()
        if (!('post' in data) || !data.post) {
          throw new Error('Unexpected response')
        }
        setDirty(false)
        invalidatePosts(queryClient, data.post.id)
        void navigate({ to: '/posts/$id', params: { id: data.post.id } })
      } catch (error) {
        setSubmitError(
          error instanceof Error ? error.message : '保存に失敗しました',
        )
      }
    },
  })

  useEffect(() => {
    if (!existingQuery.data || hydrated) return
    form.reset({
      slug: existingQuery.data.slug,
      title: existingQuery.data.title,
      summary: existingQuery.data.summary,
      body: existingQuery.data.body,
      ogImageUrl: existingQuery.data.ogImageUrl ?? '',
      status: existingQuery.data.status,
    })
    setHydrated(true)
    setDirty(false)
  }, [existingQuery.data, form, hydrated])

  useEffect(() => {
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!dirty) return
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [dirty])

  if (mode === 'edit' && existingQuery.isLoading) {
    return <p className="text-slate-500">記事を読み込み中…</p>
  }

  if (mode === 'edit' && existingQuery.isError) {
    return (
      <Alert status="danger">
        <Alert.Content>
          <Alert.Description>
            {(existingQuery.error as Error).message}
          </Alert.Description>
        </Alert.Content>
      </Alert>
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
        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button
              variant="primary"
              isDisabled={isSubmitting}
              onPress={() => void form.handleSubmit()}
            >
              {isSubmitting ? '保存中…' : '保存する'}
            </Button>
          )}
        </form.Subscribe>
      </div>

      {submitError ? (
        <Alert status="danger">
          <Alert.Content>
            <Alert.Description>{submitError}</Alert.Description>
          </Alert.Content>
        </Alert>
      ) : null}

      <form
        className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        onSubmit={(event) => {
          event.preventDefault()
          event.stopPropagation()
          void form.handleSubmit()
        }}
        onChange={() => setDirty(true)}
      >
        <form.Field name="title">
          {(field) => (
            <TextField
              name={field.name}
              value={field.state.value}
              onChange={field.handleChange}
              onBlur={field.handleBlur}
              isInvalid={field.state.meta.errors.length > 0}
            >
              <Label>Title</Label>
              <Input />
              <FieldError>
                {field.state.meta.errors[0]
                  ? String(field.state.meta.errors[0])
                  : null}
              </FieldError>
            </TextField>
          )}
        </form.Field>

        <form.Field name="slug">
          {(field) => (
            <TextField
              name={field.name}
              value={field.state.value}
              onChange={field.handleChange}
              onBlur={field.handleBlur}
              isInvalid={field.state.meta.errors.length > 0}
            >
              <Label>Slug</Label>
              <Input className="font-mono text-sm" />
              <FieldError>
                {field.state.meta.errors[0]
                  ? String(field.state.meta.errors[0])
                  : null}
              </FieldError>
            </TextField>
          )}
        </form.Field>

        <form.Field name="summary">
          {(field) => (
            <TextField
              name={field.name}
              value={field.state.value}
              onChange={field.handleChange}
              onBlur={field.handleBlur}
              isInvalid={field.state.meta.errors.length > 0}
            >
              <Label>Summary</Label>
              <TextArea className="min-h-24" />
              <FieldError>
                {field.state.meta.errors[0]
                  ? String(field.state.meta.errors[0])
                  : null}
              </FieldError>
            </TextField>
          )}
        </form.Field>

        <form.Field name="ogImageUrl">
          {(field) => (
            <TextField
              name={field.name}
              value={field.state.value}
              onChange={field.handleChange}
              onBlur={field.handleBlur}
            >
              <Label>OG Image URL (optional)</Label>
              <Input placeholder="https://..." />
            </TextField>
          )}
        </form.Field>

        <form.Field name="status">
          {(field) => (
            <Select
              selectedKey={field.state.value}
              onSelectionChange={(key) => {
                if (key === 'draft' || key === 'published') {
                  field.handleChange(key)
                  setDirty(true)
                }
              }}
              onBlur={field.handleBlur}
            >
              <Label>Status</Label>
              <Select.Trigger className="w-full">
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  <ListBox.Item id="draft" textValue="draft">
                    draft
                  </ListBox.Item>
                  <ListBox.Item id="published" textValue="published">
                    published
                  </ListBox.Item>
                </ListBox>
              </Select.Popover>
            </Select>
          )}
        </form.Field>

        <form.Field name="body">
          {(field) => (
            <div className="space-y-1.5">
              <Label>Body</Label>
              <PostBodyEditor
                value={field.state.value}
                onChange={(html) => {
                  field.handleChange(html)
                  setDirty(true)
                }}
                onBlur={field.handleBlur}
              />
              {field.state.meta.errors[0] ? (
                <p className="text-sm text-red-600">
                  {String(field.state.meta.errors[0])}
                </p>
              ) : null}
            </div>
          )}
        </form.Field>
      </form>
    </div>
  )
}
