import { Database } from 'bun:sqlite'
import { drizzle } from 'drizzle-orm/bun-sqlite'
import { relations } from './schema/articles.ts'

export const EBB_DB_URL = Bun.fileURLToPath(
  new URL('../.db/ebb.sqlite', import.meta.url)
)

const client = new Database(EBB_DB_URL, { create: true, strict: true })
const db = drizzle({ client, relations })

export default db
