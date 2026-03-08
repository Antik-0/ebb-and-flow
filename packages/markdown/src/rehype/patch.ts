import type { Plugin } from 'unified'
import type { HAST } from '../types/index.ts'
import { sanitizeSelector } from '../shared/index.ts'
import { getNodeText, visit } from '../shared/visit.ts'

/**
 * ✨ 完善部分标签 `props`
 */
export const rehypePatch: Plugin<[], HAST.Root> = () => {
  return (ast, file) => {
    const tocDepth = (file.data.tocDepth as number[]) ?? []
    const tocHeads = tocDepth.map(n => `h${n}`)
    const metadata = file.data.metadata as Record<string, any>

    visit<HAST.Element>(
      ast,
      node => {
        const tagName = node.tagName
        // ✨ 导航 h 标签注入 id
        if (tocHeads.includes(tagName)) {
          const id = sanitizeSelector(getNodeText(node))
          Object.assign(node.properties, { id })
          return
        }

        // ✨ page-meta 注入 metadata
        if (tagName === 'PageMeta') {
          Object.assign(node.properties, metadata)
          return
        }

        // ✨ code-group 注入 tabs
        if (tagName === 'CodeGroup') {
          return
        }
      },
      { depth: 1 }
    )
  }
}
