import { compareDesc, parseISO } from 'date-fns'
import { allPosts } from 'content-collections'

export type BlogPost = (typeof allPosts)[number]

export function getPublishedPosts(): BlogPost[] {
  return allPosts
    .filter((post) => !post.draft)
    .sort((a, b) =>
      compareDesc(parseISO(a.publishedAt), parseISO(b.publishedAt)),
    )
}

export function getPublishedPost(slug: string): BlogPost | undefined {
  return getPublishedPosts().find((post) => post.slug === slug)
}
