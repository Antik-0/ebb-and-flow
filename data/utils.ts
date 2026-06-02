import pc from 'picocolors'

export function createLogger() {
  const logStart = () => {
    console.log(`\n${pc.yellow('🕔 markdown start compiling ...')}\n`)
  }

  const logSuccessd = (total: number, duration: number) => {
    console.log(`
      \n${
        pc.yellow('🎉 markdown compile successd ') +
        pc.red(`in ${duration.toFixed(2)} ms `) +
        pc.gray(`with ${total} files`)
      }\n
    `)
  }

  const logCompiled = (path: string, duration: number) => {
    console.log(
      pc.magenta(`✨ ${path.padEnd(50, ' ')} `) +
        pc.blue('compiled in ') +
        pc.red(`${duration.toFixed(2).padStart(8)} ms`)
    )
  }

  const logCached = (path: string) => {
    console.log(pc.magenta(`⚡ ${path.padEnd(50, ' ')} `) + pc.blue('cached'))
  }

  return {
    start: logStart,
    cached: logCached,
    successd: logSuccessd,
    compiled: logCompiled
  }
}

export function normalizePath(path: string) {
  return '/' + path.replaceAll('\\', '/').slice(0, -3)
}

type CacheMap = Record<string, string>

export async function loadCache(filepath: string) {
  try {
    const module = await import(filepath, { with: { type: 'json' } })
    return module.default as CacheMap
  } catch {
    return {} as CacheMap
  }
}

export function isCacheHit(key: string, hash: string, cache: CacheMap) {
  return key in cache && hash === cache[key]
}

export async function updateCache(filepath: string, cache: CacheMap) {
  const values: string[] = []
  for (const key of Object.keys(cache)) {
    values.push(`  "${key}": ${JSON.stringify(cache[key])}`)
  }
  const res = `{\n${values.join(',\n')}\n}`

  const file = Bun.file(filepath)
  await file.write(res)
}
