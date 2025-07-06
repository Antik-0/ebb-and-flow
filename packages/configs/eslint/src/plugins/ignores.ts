import type { Linter } from 'eslint'

export function ignores(): Linter.Config[] {
  return [
    {
      ignores: [
        '**/node_modules',
        '**/dist',
        '**/.idea',
        '**/.cache',
        '**/.turbo',
        '**/*.sh',
        '**/*.ttf',
        '**/*.woff',
        '**/.changeset',
        '**/.vite-inspect',
        '**/.vitepress/cache/**',
        '**/CHANGELOG*.md',
        '**/LICENSE*',
        '**/auto-import?(s).d.ts',
        '**/components.d.ts'
      ]
    }
  ]
}
