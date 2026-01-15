import type { Metadata } from '@ebb/mdx'

declare global {
  interface MDXMetadata extends Metadata {
    /**
     * 文章标签
     */
    tags?: string[]
  }
}

declare module '*.css' {
  const content: string
  export default content
}
