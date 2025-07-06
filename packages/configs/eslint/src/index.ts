import type { Linter } from 'eslint'
import tsEslint from 'typescript-eslint'
import { ignores, javascript, jsonc, typescript, vue } from './plugins/index.js'

/**
 * reference: https://eslint.org/docs/latest/use/configure/configuration-files
 */
export function defineConfig() {
  const configs = [ignores(), jsonc(), javascript(), typescript(), vue()].flat()
  return tsEslint.config(...configs) as Linter.Config[]
}
