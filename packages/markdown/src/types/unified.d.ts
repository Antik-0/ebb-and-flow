import type { Frontmatter, Metadata, VNode } from './index.ts'

declare module 'unified' {
  interface CompileResultMap {
    body: VNode[]
    metadata: Metadata
    frontmatter: Frontmatter
  }
}
