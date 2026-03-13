import type { VFile } from 'vfile'
import type { Data, MDAST, Metadata } from '../types/index.ts'
import { withErrorHandler } from '../shared/error.ts'
import {
  computeReadingTime,
  getGitUpdatedTime,
  sanitizeSelector
} from '../shared/general.ts'
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
export function remarkMetadata(options: RemarkMetadataOptions = {}) {
  const { setup, tocDepth = [2, 3] } = options

  return withErrorHandler<MDAST.Root>('remarkMetadata', (ast, file) => {
    const filepath = file.path
    const lastUpdated = getGitUpdatedTime(filepath)
    const readingTime = computeReadingTime(file.toString())

    const metadata: Metadata = {
      title: '',
      toc: [],
      lastUpdated,
      readingTime
    }
    let index = 0

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
          const aid = `${sanitizeSelector(tocText)}-${index}`
          metadata.toc.push({
            id: aid,
            label: tocText,
            level: node.depth
          })
          node.data = {
            hProperties: {
              id: aid,
              'data-index': index
            }
          }
          index += 1
        }
        return signal.STOP
      },
      { type: 'heading' }
    )

    const extendData = setup?.(ast, file) ?? {}
    Object.assign(metadata, extendData)
    file.data.metadata = metadata
  })
}
