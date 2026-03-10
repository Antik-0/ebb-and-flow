import type { MarkdownConfig } from './types/index.ts'

export function defineMarkdownConfig(config: MarkdownConfig): MarkdownConfig {
  return config
}

export { createSource } from './build.ts'
