import type { Linter } from 'eslint'

export function ignores(): Linter.Config[] {
  return [
    {
      ignores: [
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
      ]
    }
  ]
}
