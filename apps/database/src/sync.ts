import type { MarkdownData } from 'ebb-markdown'
import { Database } from 'bun:sqlite'
import { resolve } from 'node:path'
import { drizzle } from 'drizzle-orm/bun-sqlite'
import { createUnified } from 'ebb-markdown'
import { articles } from './schema.ts'
import {
  createLogger,
  isCacheHit,
  loadCache,
  normalizePath,
  updateCache
} from './utils.ts'

const cwd = process.cwd()
const root = resolve(cwd, '../../')
const docs = resolve(root, 'docs/src')
const dataDir = resolve(cwd, '.data')
const cacheFile = resolve(dataDir, 'cache.json')

const source: Record<string, MarkdownData & { value: string }> = {}

{
  const cache = await loadCache(cacheFile)

  const logger = createLogger()
  const unified = createUnified()

  async function compileMarkdown(path: string) {
    const filepath = resolve(docs, path)
    const file = Bun.file(filepath)
    const stat = await file.stat()
    const mtimeMs = stat.mtimeMs
    const key = normalizePath(path)

    if (isCacheHit(key, mtimeMs, cache)) {
      return true
    }

    const value = await file.text()
    const vfile = await unified.process({ path: filepath, value })
    const result = vfile.result as MarkdownData

    cache[key] = mtimeMs
    source[key] = { ...result, value }

    return false
  }

  let totalCount = 0
  let totalDuration = 0

  logger.start()
  const glob = new Bun.Glob('**/*.md')

  for await (const path of glob.scan({ cwd: docs })) {
    try {
      const startTime = performance.now()
      const cached = await compileMarkdown(path)
      if (cached) {
        logger.cached(path)
      } else {
        const duration = performance.now() - startTime
        logger.compiled(path, duration)

        totalCount += 1
        totalDuration += duration
      }
    } catch (error) {
      const message = (error as Error).message
      console.error('🔧 ' + message + '\n')
    }
  }

  updateCache(cacheFile, cache)
  logger.successd(totalCount, totalDuration)
}

{
  const sqlURL = resolve(dataDir, 'ebb.sqlite')
  const client = new Database(sqlURL, { create: true, strict: true })
  const db = drizzle({ client })

  db.transaction(
    tx => {
      const values = Object.entries(source).map(([path, item]) => {
        const hash = Bun.hash(item.value) as bigint
        const { metadata, frontmatter } = item
        const value = {
          path,
          hash,
          title: metadata.title,
          toc: metadata.toc,
          body: item.body,
          content: item.value,
          lastUpdated: metadata.lastUpdated,
          readingTime: metadata.readingTime,
          frontmatter
        }
        return value as typeof articles.$inferInsert
      })
      tx.insert(articles).values(values).run()
    },
    { behavior: 'deferred' }
  )
}
