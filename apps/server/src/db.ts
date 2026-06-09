import { Database } from 'bun:sqlite'
import { resolve } from 'node:path'
import { drizzle } from 'drizzle-orm/bun-sqlite'
import { ebbEnv, rootPath } from 'ebb-env'
import { relations } from './schema.ts'

const dbURL = resolve(rootPath, ebbEnv.EBB_DB_URL)
const client = new Database(dbURL, { create: true, strict: true })
const db = drizzle({ client, relations })

export default db
