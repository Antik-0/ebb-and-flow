import { Database } from 'bun:sqlite'
import { resolve } from 'node:path'
import { drizzle } from 'drizzle-orm/bun-sqlite'
import { relations } from './schema.ts'
import { findRootPath } from './utils.ts'

const rootPath = findRootPath()
const dbURL = resolve(rootPath, '.db/ebb.sqlite')

const client = new Database(dbURL, { create: true, strict: true })
const db = drizzle({ client, relations })

export default db
