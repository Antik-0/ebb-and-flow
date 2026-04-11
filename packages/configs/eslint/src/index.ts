import { defineConfig, globalIgnores } from 'eslint/config'
import JSONC from './jsonc.ts'
import Vue from './vue.ts'

/**
 * reference: https://eslint.org/docs/latest/use/configure/configuration-files
 */
export const ebbESLintConfig = defineConfig([
  globalIgnores([
    '**/node_modules',
    '**/dist',
    '**/.data',
    '**/.nuxt',
    '**/.next',
    '**/.nitro',
    '**/.output',
    '**/.turbo',
    '**/out',
    '**/*.ttf',
    '**/*.woff'
  ]),
  { extends: [JSONC, Vue] }
])
