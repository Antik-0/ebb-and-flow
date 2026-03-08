import type { Plugin } from 'unified'
import type { VFile } from 'vfile'
import type { Data, MDAST, Metadata } from '../types/index.ts'
import {
  computeReadingTime,
  getGitUpdatedTime,
  sanitizeSelector
} from '../shared/index.ts'
import { getNodeText, visit } from '../shared/visit.ts'

export interface RemarkMetadataOptions {
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
 * ✨ 定义 `.md` 文件的元数据
 */
export const remarkMetadata: Plugin<
  [RemarkMetadataOptions],
  MDAST.Root
> = options => {
  const { setup, tocDepth = [2, 3] } = options ?? {}

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

    // 同步数据
    file.data.metadata = metadata
    file.data.tocDepth = tocDepth
  }
}
