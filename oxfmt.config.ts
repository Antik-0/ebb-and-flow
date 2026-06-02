import { defineConfig } from 'oxfmt'

export default defineConfig({
  ignorePatterns: [
    '**/node_modules',
    '**/dist',
    '**/.db',
    '**/.drizzle',
    '**/.nuxt',
    '**/.next',
    '**/.nitro',
    '**/.output',
    '**/out'
  ],
  arrowParens: 'avoid',
  embeddedLanguageFormatting: 'auto',
  printWidth: 80,
  semi: false,
  singleQuote: true,
  trailingComma: 'none',
  sortPackageJson: {
    sortScripts: true
  },
  sortImports: {
    internalPattern: ['#/'],
    newlinesBetween: false,
    partitionByNewline: true,
    groups: [
      'type-builtin',
      'type-external',
      'type-internal',
      ['type-parent', 'type-sibling', 'type-index'],
      'value-builtin',
      'value-external',
      'value-internal',
      ['value-parent', 'value-sibling', 'value-index'],
      'unknown'
    ]
  },
  overrides: [
    {
      files: ['*.md'],
      options: {
        singleQuote: false
      }
    }
  ]
})
