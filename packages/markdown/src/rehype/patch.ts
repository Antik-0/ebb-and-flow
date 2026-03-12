import type { HAST, VFileData } from '../types/index.ts'
import { withErrorHandler } from '../shared/error.ts'
import { sanitizeSelector } from '../shared/general.ts'
import { getNodeText, visit } from '../shared/visit.ts'

/**
 * ✨ 完善部分标签 `props`
 */
export function rehypePatch() {
  return withErrorHandler<HAST.Root>('rehypePatch', (ast, file) => {
    const fileData = file.data as unknown as VFileData
    const tocDepth = fileData.tocDepth ?? []
    const tocHeads = tocDepth.map(n => `h${n}`)
    const metadata = fileData.metadata
    const frontmatter = fileData.frontmatter

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
          Object.assign(node.properties, {
            tags: frontmatter.tags,
            lastUpdated: metadata.lastUpdated,
            readingTime: metadata.readingTime
          })
          return
        }

        // ✨ code-group 注入 tabs
        if (tagName === 'CodeGroup') {
          const tabs = parsePreTab(node.children)
          Object.assign(node.properties, { tabs })
          return
        }
      },
      { depth: 1 }
    )
  })
}

interface TabItem {
  text: string
  icon: string
}

function parsePreTab(children: any[]) {
  const res: TabItem[] = []

  for (const preRoot of children) {
    const preNode = preRoot?.children[0]
    if (preNode?.tagName === 'pre') {
      const props = preNode.properties
      const text = props.filename || props.language
      const icon = props.language
      res.push({ text, icon })
    }
  }
  return []
}
