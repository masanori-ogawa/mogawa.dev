import * as v from 'valibot'

export const postStatusSchema = v.picklist(['draft', 'published'])

export const slugSchema = v.pipe(
  v.string(),
  v.minLength(1, 'slugは必須です'),
  v.maxLength(120, 'slugは120文字以内にしてください'),
  v.regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    'slugは小文字英数字とハイフンのみ使用できます',
  ),
)

export const createPostSchema = v.object({
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
  body: v.pipe(
    v.string(),
    v.minLength(1, '本文は必須です'),
  ), // PostBody: HTML (Sanitized on API save)
  ogImageUrl: v.optional(
    v.nullable(
      v.union([
        v.pipe(v.string(), v.url('有効なURLを入力してください')),
        v.literal(''),
      ]),
    ),
  ),
  status: v.optional(postStatusSchema, 'draft'),
})

export const updatePostSchema = v.partial(createPostSchema)

export const postSchema = v.object({
  id: v.string(),
  slug: slugSchema,
  title: v.string(),
  summary: v.string(),
  body: v.string(),
  ogImageUrl: v.nullable(v.string()),
  status: postStatusSchema,
  publishedAt: v.nullable(v.string()),
  createdAt: v.string(),
  updatedAt: v.string(),
})

export const postListItemSchema = v.omit(postSchema, ['body'])

export const postsResponseSchema = v.object({
  posts: v.array(postListItemSchema),
})

export const postResponseSchema = v.object({
  post: postSchema,
})

export const errorResponseSchema = v.object({
  error: v.string(),
  details: v.optional(v.unknown()),
})

export const deployResponseSchema = v.object({
  ok: v.literal(true),
  message: v.string(),
})

export type PostStatus = v.InferOutput<typeof postStatusSchema>
export type CreatePostInput = v.InferOutput<typeof createPostSchema>
export type UpdatePostInput = v.InferOutput<typeof updatePostSchema>
export type Post = v.InferOutput<typeof postSchema>
export type PostListItem = v.InferOutput<typeof postListItemSchema>
