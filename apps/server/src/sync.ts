import type { MarkdownData } from 'ebb-markdown'
import { Database } from 'bun:sqlite'
import { exists, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { sql } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/bun-sqlite'
import { ebbEnv, rootPath } from 'ebb-env'
import { createUnified } from 'ebb-markdown'
import pc from 'picocolors'
import { articles } from './schema.ts'
import {
  createLogger,
  isCacheHit,
  loadCache,
  normalizePath,
  updateCache
} from './utils.ts'

const dbURL = resolve(rootPath, ebbEnv.EBB_DB_URL)
const dbDir = dirname(dbURL)
const docsDir = resolve(rootPath, 'docs')
const cachePath = resolve(dbDir, 'cache.json')

{
  const isExist = await exists(dbDir)
  if (!isExist) {
    await mkdir(dbDir)
    console.log(pc.cyan(`[step: create db dir]: ${dbDir} \n`))
  }

  console.log(pc.cyan(`[step] create sqlite table \n`))
  const proc = Bun.spawn(['bunx', 'drizzle-kit', 'push'], {
    cwd: rootPath,
    stdin: 'inherit',
    stdout: 'inherit',
    stderr: 'inherit'
  })
  await proc.exited
}

type SourceData = MarkdownData & {
  hash: string
  value: string
}
const source: Record<string, SourceData> = {}

{
  const cache = await loadCache(cachePath)

  const logger = createLogger()
  const unified = createUnified()

  async function compileMarkdown(path: string) {
    const filepath = resolve(docsDir, path)
    const file = Bun.file(filepath)

    const value = await file.text()
    const key = normalizePath(path)
    const hash = Bun.hash(value).toString()

    if (isCacheHit(key, hash, cache)) {
      return true
    }

    const vfile = await unified.process({ path: filepath, value })
    const result = vfile.result as MarkdownData

    cache[key] = hash
    source[key] = { hash, value, ...result }

    return false
  }

  let totalCount = 0
  let totalDuration = 0

  logger.start()
  const glob = new Bun.Glob('**/*.md')

  for await (const path of glob.scan({ cwd: docsDir })) {
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

  updateCache(cachePath, cache)
  logger.successd(totalCount, totalDuration)
}

{
  console.log(pc.cyan(`[step] 正在同步数据... \n`))

  const client = new Database(dbURL, { create: true, strict: true })
  const db = drizzle({ client })
  const values = Object.entries(source).map(([path, item]) => {
    const { metadata, frontmatter } = item
    return {
      path,
      hash: item.hash,
      body: item.body,
      content: item.value,
      title: metadata.title,
      toc: metadata.toc,
      lastUpdated: metadata.lastUpdated,
      readingTime: metadata.readingTime,
      frontmatter
    } as typeof articles.$inferInsert
  })

  db.transaction(
    tx => {
      if (!values.length) return

      tx.insert(articles)
        .values(values)
        .onConflictDoUpdate({
          target: articles.path,
          set: {
            hash: sql`excluded.hash`,
            body: sql`excluded.body`,
            content: sql`excluded.content`,
            title: sql`excluded.title`,
            toc: sql`excluded.toc`,
            lastUpdated: sql`excluded.lastUpdated`,
            readingTime: sql`excluded.readingTime`,
            frontmatter: sql`excluded.frontmatter`
          }
        })
        .run()
    },
    { behavior: 'deferred' }
  )

  console.log(pc.yellow(`[done] 数据同步结束 \n`))
}
