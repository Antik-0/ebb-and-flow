import type { Plugin } from 'unified'
import type { VFile } from 'vfile'
import type { Data, MDAST, Metadata, TocItem } from '../types.ts'
import { define } from 'unist-util-mdx-define'
import {
  computeReadingTime,
  getGitUpdatedTime,
  getNodeText,
  visit
} from '../helper.ts'
import { valueToEstreeNode } from './estree.ts'

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
  const { name = '_metadata', setup, tocDepth = [2, 3] } = options

  return (ast, file) => {
    const filepath = file.history[0]!
    const lastUpdated = getGitUpdatedTime(filepath)
    const readingTime = computeReadingTime(file.value as string)

    const toc: TocItem[] = []
    visit<MDAST.Heading>(
      ast,
      (node, { signal }) => {
        const depth = node.depth
        if (tocDepth.includes(depth)) {
          toc.push({
            text: getNodeText(node),
            level: node.depth
          })
        }
        return signal.stop
      },
      { type: 'heading' }
    )

    const metadata: Metadata = {
      lastUpdated,
      readingTime,
      toc
    }
    Object.assign(file.data, metadata)

    // 同步数据给 `rehype` 插件
    file.data.tocDepth = tocDepth

    const extendData = setup?.(ast, file) ?? {}

    const defineValue = {
      [name]: valueToEstreeNode({ ...metadata, ...extendData })
    } as define.Variables

    try {
      define(ast, file, defineValue)
    } catch (error) {
      const errorMsg = (error as Error).message
      console.error(`[RemarkMetadata Error]: ${errorMsg} in file: ${filepath}`)
    }
  }
}
