import { defineCollection, defineConfig } from '@content-collections/core'
import { compile, run } from '@mdx-js/mdx'
import { createElement } from 'react'
import * as runtime from 'react/jsx-runtime'
import { renderToStaticMarkup } from 'react-dom/server'
import * as v from 'valibot'

const posts = defineCollection({
  name: 'posts',
  directory: 'posts',
  include: '**/*.mdx',
  schema: v.object({
    title: v.string(),
    summary: v.string(),
    publishedAt: v.string(),
    draft: v.optional(v.boolean()),
    ogImageUrl: v.optional(v.string()),
    content: v.string(),
  }),
  transform: async (document) => {
    const compiled = await compile(document.content, {
      outputFormat: 'function-body',
    })
    const { default: Content } = await run(compiled, {
      ...runtime,
      baseUrl: import.meta.url,
    })
    const html = renderToStaticMarkup(createElement(Content))

    return {
      ...document,
      slug: document._meta.path,
      html,
    }
  },
})

export default defineConfig({
  content: [posts],
})
