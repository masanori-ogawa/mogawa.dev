import { defineConfig } from 'vite'
import contentCollections from '@content-collections/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { cloudflare } from '@cloudflare/vite-plugin'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    contentCollections(),
    cloudflare({
      viteEnvironment: { name: 'ssr' },
      inspectorPort: 9229,
    }),
    tailwindcss(),
    tanstackStart({
      prerender: {
        enabled: true,
        crawlLinks: true,
        failOnError: true,
        autoStaticPathsDiscovery: true,
      },
    }),
    viteReact(),
  ],
})
