import type { Pluggable } from 'unified'
import type { MarkdownData } from './types/index.ts'
import { resolve } from 'node:path'
import { rehypePatch } from './rehype/patch.ts'
import { rehypeShiki } from './rehype/shiki.ts'
import { remarkComponent } from './remark/component.ts'
import { remarkMetadata } from './remark/metadata.ts'
import { remarkToRehype } from './remark/to-hast.ts'
import { logger } from './shared/logger.ts'
import { createUnified } from './unified.ts'

const __source = 'source.json'
const __cache = 'cache.json'

export interface SourceOptions {
  /**
   * md 文件源目录
   */
  dir: string
  /**
   * md 编译后的输出目录
   */
  output: string
}

export async function createSource(options: SourceOptions) {
  const root = process.cwd()

  const contentDir = resolve(root, options.dir)
  const outputDir = resolve(root, options.output)

  const cacheFile = resolve(outputDir, __cache)
  const sourceFile = resolve(outputDir, __source)

  const cache = await loadCache(cacheFile)
  const source = await loadSource(sourceFile)

  // 创建处理器
  const remarkPlugins = [
    [remarkComponent],
    [remarkMetadata],
    [remarkToRehype]
  ] as Pluggable[]
  const rehypePlugins = [[rehypeShiki], [rehypePatch]] as Pluggable[]
  const unified = createUnified({ remarkPlugins, rehypePlugins })

  let totalCount = 0
  let totalDuration = 0

  async function handle(path: string) {
    const startTime = performance.now()
    totalCount += 1

    const filepath = resolve(contentDir, path)
    const file = Bun.file(filepath)
    const stat = await file.stat()
    const mtimeMs = stat.mtimeMs
    const key = normalizePath(path)

    if (isCacheHit(key, mtimeMs, cache)) {
      logger.cached(path)
    } else {
      const value = await file.text()
      const vfile = await unified.process({ path: filepath, value })
      const result = vfile.result as MarkdownData

      cache[key] = mtimeMs
      source[key] = result

      const duration = performance.now() - startTime
      totalDuration += duration
      logger.compiled(path, duration)
    }
  }

  logger.start()

  const glob = new Bun.Glob('**/*.md')
  for await (const path of glob.scan({ cwd: contentDir })) {
    try {
      await handle(path)
    } catch (error) {
      const message = (error as Error).message
      console.error('🔧 ' + message + '\n')
    }
  }

  updateCache(cacheFile, cache)
  updateSource(sourceFile, source)

  logger.successd(totalCount, totalDuration)
}

type SourceData = Record<string, MarkdownData>

async function loadSource(filepath: string) {
  try {
    const module = await import(filepath, { with: { type: 'json' } })
    return module.default as SourceData
  } catch {
    return {} as SourceData
  }
}

async function updateSource(filepath: string, data: SourceData) {
  const file = Bun.file(filepath)
  await file.write(pretty(data))
}

type CacheMap = Record<string, number>

async function loadCache(filepath: string) {
  try {
    const module = await import(filepath, { with: { type: 'json' } })
    return module.default as CacheMap
  } catch {
    return {} as CacheMap
  }
}

function isCacheHit(path: string, mtimeMs: number, cache: CacheMap) {
  return path in cache && mtimeMs === cache[path]
}

async function updateCache(filepath: string, cache: CacheMap) {
  const file = Bun.file(filepath)
  await file.write(pretty(cache))
}

function pretty(data: Record<string, any>) {
  let res = '{\n'
  for (const key of Object.keys(data)) {
    res += `  "${key}": ${JSON.stringify(data[key])},\n`
  }
  res = res.slice(0, -2)
  res += '\n}'
  return res
}

function normalizePath(path: string) {
  if (!path.startsWith('/')) {
    path = '/' + path
  }
  return path.replaceAll('\\', '/').slice(0, -3)
}
