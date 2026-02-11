import type { Plugin } from 'unified'
import type { VFile } from 'vfile'
import type { Data, MDAST, Metadata } from '../types.ts'
import { define } from 'unist-util-mdx-define'
import { createExpression } from '../shared/estree.ts'
import {
  computeReadingTime,
  getGitUpdatedTime,
  sanitizeSelector
} from '../shared/general.ts'
import { getNodeText, visit } from '../shared/visit.ts'

export interface RemarkMetadataOptions {
  /**
   * 元字段名称
   * @default 'metadata'
   */
  name?: string
  /**
   * 元信息创建回调
   */
  setup?: (ast: MDAST.Root, file: VFile) => Data
  /**
   * 标题提取深度
   * @default [2,3]
   */
  tocDepth?: number[]
}

/**
 * ✨ 定义 `.mdx` 文件的元数据
 *
 * `lastUpdated` - 最后更新时间
 *
 * `readingTime` - 阅读时间
 *
 * `toc` - 页面导航
 */
export const remarkMetadata: Plugin<
  [RemarkMetadataOptions],
  MDAST.Root
> = options => {
  const { name = '_metadata', setup, tocDepth = [2, 3] } = options ?? {}

  return (ast, file) => {
    const filepath = file.path
    const lastUpdated = getGitUpdatedTime(filepath)
    const readingTime = computeReadingTime(file.toString())

    const metadata: Metadata = {
      title: '',
      toc: [],
      lastUpdated,
      readingTime
    }

    visit<MDAST.Heading>(
      ast,
      (node, { signal }) => {
        let text = ''
        const depth = node.depth
        if (depth === 1) {
          text = getNodeText(node)
          metadata.title = text
        }
        if (tocDepth.includes(depth)) {
          const tocText = text || getNodeText(node)
          metadata.toc.push({
            to: `#${sanitizeSelector(tocText)}`,
            text: tocText,
            level: node.depth
          })
        }
        return signal.stop
      },
      { type: 'heading' }
    )

    const extendData = setup?.(ast, file) ?? {}
    Object.assign(metadata, extendData)

    const defineValue = {
      [name]: createExpression(metadata)
    } as define.Variables

    // 同步数据给 `rehype` 插件
    file.data.metadata = metadata
    file.data.tocDepth = tocDepth

    try {
      define(ast, file, defineValue)
    } catch (error) {
      const errorMsg = (error as Error).message
      console.error(`[remarkMetadata Error]: ${errorMsg} in file: ${filepath}`)
    }
  }
}
