import { createFileRoute } from '@tanstack/react-router'
import { PostEditor } from '#/components/PostEditor'

export const Route = createFileRoute('/posts/$id')({
  component: EditPostPage,
})

function EditPostPage() {
  const { id } = Route.useParams()
  return <PostEditor mode="edit" postId={id} />
}
