import Unocss from '@unocss/eslint-config/flat'
import { defineConfig, globalIgnores } from 'eslint/config'
import JSONC from './jsonc.js'
import Vue from './vue.js'

/**
 * reference: https://eslint.org/docs/latest/use/configure/configuration-files
 */
export default defineConfig([
  globalIgnores([
    '**/node_modules',
    '**/dist',
    '**/.cache',
    '**/.turbo',
    '**/*.ttf',
    '**/*.woff',
    '**/.vitepress/cache/**',
    '**/LICENSE*',
    '**/auto-import?(s).d.ts',
    '**/components.d.ts'
  ]),
  {
    extends: [JSONC, Vue, Unocss as any]
  }
])
