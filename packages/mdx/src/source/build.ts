import type { CacheMap, CompileContext, MDXConfig } from './types.ts'
import { rm } from 'node:fs/promises'
import { resolve } from 'node:path'
import { createProcessor } from '@mdx-js/mdx'
import { logger } from './logger.ts'

interface BuildOptions {
  mode?: 'dev' | 'build'
}

export async function buildMDXSource(options: BuildOptions = {}) {
  const { mode = 'build' } = options

  const root = process.cwd()

  const configPath = resolve(root, 'mdx.config.ts')
  const mdxConfig = (await import(configPath)).default as MDXConfig

  const contentDir = resolve(root, mdxConfig.dir)
  const mdxDataDir = resolve(root, mdxConfig.output ?? '.data')

  // mdx 编译文件位置
  const sourceDir = resolve(mdxDataDir, 'source')
  // cache file 位置
  const cacheFile = resolve(mdxDataDir, 'cache.json')

  // 创建处理器
  const { remarkPlugins, rehypePlugins } = mdxConfig
  const processor = createProcessor({ remarkPlugins, rehypePlugins })

  // 获取缓存
  let cache = await getCache(cacheFile)

  const configFile = Bun.file(configPath)
  const configStat = await configFile.stat()
  const configCacheKey = '__config__'

  if (mode === 'build' || configStat.mtimeMs !== cache[configCacheKey]) {
    // 构建模式/`config.ts`被修改清除缓存，重新编译
    await rm(sourceDir, { recursive: true, force: true })
    await rm(cacheFile, { recursive: true, force: true })
    cache = {}
  }
  cache[configCacheKey] = configStat.mtimeMs

  const compile = createCompileWithCache({
    contentDir,
    sourceDir,
    cache,
    processor
  })

  const glob = new Bun.Glob('**/*.mdx')

  logger.start()

  let totalDuration = 0
  for await (const path of glob.scan({ cwd: contentDir })) {
    const startTime = performance.now()
    const cacheHit = await compile(path)
    if (cacheHit) {
      logger.cached(path)
    } else {
      const duration = performance.now() - startTime
      totalDuration += duration
      logger.compiled(path, duration)
    }
  }

  if (mode === 'dev') {
    await Bun.write(cacheFile, JSON.stringify(cache)!)
  }

  // 构建 content 索引
  await buildContentIndex(mdxDataDir)

  logger.successd(totalDuration)

  return { compile }
}

function createCompileWithCache(ctx: CompileContext) {
  const { contentDir, sourceDir, cache, processor } = ctx

  return async (path: string) => {
    const filepath = resolve(contentDir, path)
    const file = Bun.file(filepath)
    const stat = await file.stat()
    const mtimeMs = stat.mtimeMs

    if (isCacheHit(path, mtimeMs, cache)) {
      return true
    }

    const value = await file.text()
    const vfile = await processor.process({ path: filepath, value })

    const tofile = resolve(sourceDir, path.replaceAll('.mdx', '.js'))
    await Bun.write(tofile, vfile.toString())
    cache[path] = mtimeMs

    return false
  }
}

async function getCache(cacheFile: string) {
  try {
    const module = await import(cacheFile, { with: { type: 'json' } })
    return module.default as CacheMap
  } catch {
    return {} as CacheMap
  }
}

function isCacheHit(path: string, mtimeMs: number, cache: CacheMap) {
  return path in cache && mtimeMs === cache[path]
}

async function buildContentIndex(dir: string) {
  const glob = new Bun.Glob('**/*.js')
  let entries = ''
  for await (const path of glob.scan({ cwd: resolve(dir, 'source') })) {
    const normlizedPath = path.replaceAll('\\', '/')
    const pathKey = normlizedPath.replaceAll(/\.js$/g, '')
    const entry = `  "${pathKey}": () => import("./source/${normlizedPath}"),\n`
    entries += entry
  }

  const text = `export default {\n${entries}}`
  await Bun.write(resolve(dir, 'index.js'), text)
}
