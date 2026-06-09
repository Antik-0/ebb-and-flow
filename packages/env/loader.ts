import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath, URL } from 'node:url'

function findRootPath() {
  let path = fileURLToPath(new URL('.', import.meta.url))
  while (true) {
    const lockfile = resolve(path, 'bun.lock')
    if (existsSync(lockfile)) {
      return path
    }

    const parent = resolve(path, '..')
    if (parent === path) {
      return path
    }
    path = parent
  }
}

function parseEnvText(text: string) {
  const values: Record<string, any> = {}
  const validReg = /^([A-Z][_A-Z0-9]*)\s*=\s*(.*)/
  const stringReg = /(^['"]).*\1$/

  for (const line of text.split(/\r?\n/)) {
    const trimed = line.trim()
    if (!trimed || trimed.startsWith('#')) {
      continue
    }

    const match = trimed.match(validReg)
    if (!match) continue

    const key = match[1]!
    let value = match[2]!
    if (stringReg.test(value)) {
      value = value.slice(1, -1)
    } else {
      try {
        value = JSON.parse(value)
      } catch {}
    }

    values[key] = value
  }

  return values
}

interface EbbEnv {
  EBB_SERVER_PORT: number
  EBB_SERVER_BASE_URL: string
  EBB_DB_URL: string
}

const rootPath = findRootPath()
const envFile = resolve(rootPath, '.env.config')
const envText = readFileSync(envFile, { encoding: 'utf-8' })
const ebbEnv = parseEnvText(envText) as EbbEnv

export { ebbEnv, rootPath }
