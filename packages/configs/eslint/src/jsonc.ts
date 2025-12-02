import { defineConfig } from 'eslint/config'
import pluginJSONC from 'eslint-plugin-jsonc'
import parserJSONC from 'jsonc-eslint-parser'

export default defineConfig([
  ...pluginJSONC.configs['flat/recommended-with-jsonc'],
  {
    files: ['**/*.json', '**/*.jsonc', '**/*.json5'],
    languageOptions: {
      parser: parserJSONC
    },
    rules: {
      'jsonc/indent': ['error', 2],
      'jsonc/key-spacing': [
        'error',
        {
          afterColon: true,
          beforeColon: false,
          mode: 'strict'
        }
      ],
      'jsonc/no-bigint-literals': 'error',
      'jsonc/no-binary-expression': 'error',
      'jsonc/no-number-props': 'error',
      'jsonc/no-comments': 'off'
    }
  },
  {
    files: ['**/package.json'],
    rules: {
      'jsonc/sort-keys': [
        'error',
        {
          order: [
            'name',
            'version',
            'description',
            'private',
            'author',
            'keywords',
            'homepage',
            'bugs',
            'repository',
            'license',
            'contributors',
            'categories',
            'funding',
            'icon',
            'contributes',
            'bin',
            'type',
            'files',
            'module',
            'main',
            'types',
            'imports',
            'exports',
            'packageManager',
            'engines',
            'scripts',
            'simple-git-hooks',
            'lint-staged',
            'dependencies',
            'devDependencies',
            'peerDependencies',
            'peerDependenciesMeta',
            'optionalDependencies',
            'pnpm'
          ],
          pathPattern: '^$'
        },
        {
          order: ['types', 'import', 'require', 'default'],
          pathPattern: '^exports.*$'
        },
        {
          order: { type: 'asc' },
          pathPattern: '^scripts.*$'
        },
        {
          order: { type: 'asc' },
          pathPattern: '^(dependencies|devDependencies).*$'
        },
        {
          order: { type: 'asc' },
          pathPattern: '^workspaces.catalog.*$'
        }
      ]
    }
  }
])
