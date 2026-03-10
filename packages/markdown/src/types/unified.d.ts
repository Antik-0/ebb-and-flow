import type { Frontmatter, Metadata, VNode } from './index.ts'

declare module 'unified' {
  interface CompileResultMap {
    tree: VNode[]
    metadata: Metadata
    frontmatter: Frontmatter
  }
}
