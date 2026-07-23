import { allPosts } from 'content-collections'

export type BlogPost = (typeof allPosts)[number]

export function getPublishedPosts(): BlogPost[] {
  return allPosts
    .filter((post) => !post.draft)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    )
}

export function getPublishedPost(slug: string): BlogPost | undefined {
  return getPublishedPosts().find((post) => post.slug === slug)
}
