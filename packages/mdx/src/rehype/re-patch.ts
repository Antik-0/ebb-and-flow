import type { Plugin } from 'unified'
import type { HAST } from '../types.ts'
import { getNodeText, visit } from '../helper.ts'

/**
 * ✨ 为 `toc` 配置的 `h` 标签注入 `props`
 */
export const rehypePatch: Plugin<[], HAST.Root> = () => {
  return async (ast, file) => {
    const tocDepth = (file.data.tocDepth as number[]) ?? []
    const tocHeads = tocDepth.map(n => `h${n}`)

    visit<HAST.Element>(
      ast,
      (node, { signal }) => {
        if (tocHeads.includes(node.tagName)) {
          const id = getNodeText(node)
          Object.assign(node.properties, { id })
          return signal.stop
        }
        return
      },
      { type: 'element' }
    )
  }
}
