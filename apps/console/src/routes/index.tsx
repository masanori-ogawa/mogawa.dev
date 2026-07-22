import { createFileRoute } from '@tanstack/react-router'
import { PostListPage } from '#/features/posts/components/PostListPage'

export const Route = createFileRoute('/')({
  component: PostListPage,
})
