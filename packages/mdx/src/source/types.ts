import type { ProcessorOptions, createProcessor } from '@mdx-js/mdx'

export interface MDXConfig {
  /**
   * mdx 文件源目录
   */
  dir: string
  /**
   * mdx 编译后的输出目录
   */
  output?: string
  /**
   * remark 插件
   */
  remarkPlugins?: ProcessorOptions['remarkPlugins']
  /**
   * rehype 插件
   */
  rehypePlugins?: ProcessorOptions['rehypePlugins']
}

export type CacheMap = Record<string, number>

export interface CompileContext {
  contentDir: string
  sourceDir: string
  cache: CacheMap
  processor: ReturnType<typeof createProcessor>
}
