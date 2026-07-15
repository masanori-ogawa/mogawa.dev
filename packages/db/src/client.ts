import { createClient } from '@libsql/client/web'
import { drizzle } from 'drizzle-orm/libsql/web'
import * as schema from './schema'

export type Database = ReturnType<typeof createDb>

export function createDb(url: string, authToken: string) {
  const client = createClient({ url, authToken })
  return drizzle(client, { schema })
}
