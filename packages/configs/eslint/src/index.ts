import { defineConfig, globalIgnores } from 'eslint/config'
import JSONC from './jsonc.ts'
import Unocss from './unocss.ts'
import Vue from './vue.ts'

/**
 * reference: https://eslint.org/docs/latest/use/configure/configuration-files
 */
export const ebbESLintConfig = defineConfig([
  globalIgnores([
    '**/node_modules',
    '**/dist',
    '**/cache',
    '**/.cache',
    '**/.nuxt',
    '**/.nitro',
    '**/.data',
    '**/.output',
    '**/.turbo',
    '**/*.ttf',
    '**/*.woff'
  ]),
  { extends: [JSONC, Vue, Unocss] }
])
