import { createFileRoute } from '@tanstack/react-router'
import { PostEditor } from '#/features/posts/components/PostEditor'

export const Route = createFileRoute('/posts/new')({
  component: NewPostPage,
})

function NewPostPage() {
  return <PostEditor mode="create" />
}
