import type { Pluggable } from 'unified'
import type { MarkdownConfig, MarkdownData } from './types/index.ts'
import { resolve } from 'node:path'
import { rehypePatch } from './rehype/patch.ts'
import { rehypeShiki } from './rehype/shiki.ts'
import { remarkComponent } from './remark/component.ts'
import { remarkMetadata } from './remark/metadata.ts'
import { remarkToRehype } from './remark/to-hast.ts'
import { logger } from './shared/logger.ts'
import { createUnified } from './unified.ts'

const __config = 'markdown.config.ts'
const __source = 'source.json'
const __cache = 'cache.json'

export async function createSource() {
  const root = process.cwd()

  const configPath = resolve(root, __config)
  const config = (await import(configPath)).default as MarkdownConfig

  const contentDir = resolve(root, config.dir)
  const outputDir = resolve(root, config.output ?? '.data')

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

  const glob = new Bun.Glob('**/*.md')

  logger.start()
  let totalDuration = 0

  for await (const path of glob.scan({ cwd: contentDir })) {
    // todo: 并行处理
    const startTime = performance.now()

    const filepath = resolve(contentDir, path)
    const file = Bun.file(filepath)
    const stat = await file.stat()
    const mtimeMs = stat.mtimeMs

    if (isCacheHit(path, mtimeMs, cache)) {
      logger.cached(path)
    } else {
      try {
        const value = await file.text()
        const vfile = await unified.process({ path: filepath, value })
        const result = vfile.result as MarkdownData

        cache[path] = mtimeMs
        source[path] = result

        const duration = performance.now() - startTime
        totalDuration += duration
        logger.compiled(path, duration)
      } catch (error) {
        const message = (error as Error).message
        console.error(message)
      }
    }
  }

  updateSource(sourceFile, source)
  logger.successd(totalDuration)
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
  await file.write(JSON.stringify(data))
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
