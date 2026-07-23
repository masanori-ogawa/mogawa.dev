import { createFileRoute, notFound } from '@tanstack/react-router'
import { BlogPost } from '#/features/blog/components/BlogPost'
import { getPublishedPost } from '#/features/blog/posts'
import { getSiteUrl, seo } from '#/lib/site'

export const Route = createFileRoute('/blog/$slug')({
  loader: ({ params }) => {
    const post = getPublishedPost(params.slug)
    if (!post) {
      throw notFound()
    }
    return { post }
  },
  head: ({ loaderData }) => {
    const post = loaderData?.post
    if (!post) {
      return {}
    }
    const siteUrl = getSiteUrl()
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.summary,
      datePublished: post.publishedAt,
      image: post.ogImageUrl || undefined,
      mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
    }

    return {
      meta: seo({
        title: post.title,
        description: post.summary,
        path: `/blog/${post.slug}`,
        image: post.ogImageUrl,
        type: 'article',
      }),
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify(jsonLd),
        },
      ],
    }
  },
  component: BlogPostRoute,
})

function BlogPostRoute() {
  const { post } = Route.useLoaderData()
  return <BlogPost post={post} />
}
