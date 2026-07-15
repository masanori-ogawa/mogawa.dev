import { createFileRoute } from '@tanstack/react-router'
import { PostEditor } from '#/components/PostEditor'

export const Route = createFileRoute('/posts/new')({
  component: NewPostPage,
})

function NewPostPage() {
  return <PostEditor mode="create" />
}
