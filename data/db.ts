import { Database } from 'bun:sqlite'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import { drizzle } from 'drizzle-orm/bun-sqlite'
import pc from 'picocolors'
import { relations } from './schema.ts'

function findRootPath(path: string) {
  const lockfile = resolve(path, 'bun.lock')
  if (existsSync(lockfile)) {
    return path
  }

  const parent = resolve(path, '..')
  if (parent === path) {
    return path
  }
  return findRootPath(parent)
}

const currPath = fileURLToPath(new URL('.', import.meta.url))
const rootPath = findRootPath(currPath)

const dbURL = resolve(rootPath, 'data/.db/ebb.sqlite')

const client = new Database(dbURL, { create: true, strict: true })
const db = drizzle({ client, relations })

console.log(pc.red(`[Database] running in: `) + pc.cyan(`${dbURL}`))

export default db
