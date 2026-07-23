import path from 'node:path'
import { createBuilder } from '@content-collections/core'

const configPath = path.resolve(import.meta.dirname, '../content-collections.ts')
const builder = await createBuilder(configPath)
await builder.build()
console.log('[generate-content] content-collections generated')
