import { defineCollection, defineConfig } from '@content-collections/core'
import { compile, run } from '@mdx-js/mdx'
import * as runtime from 'react/jsx-runtime'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { z } from 'zod'

const posts = defineCollection({
  name: 'posts',
  directory: 'posts',
  include: '**/*.mdx',
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    publishedAt: z.string(),
    draft: z.boolean().optional(),
    ogImageUrl: z.string().optional(),
    content: z.string(),
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
