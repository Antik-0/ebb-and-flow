import type { HAST, TabItem, VFileData } from '../types/index.ts'
import { withErrorHandler } from '../shared/error.ts'
import { visit } from '../shared/visit.ts'

/**
 * ✨ 完善部分标签 `props`
 */
export function rehypePatch() {
  return withErrorHandler<HAST.Root>('rehypePatch', (ast, file) => {
    const fileData = file.data as unknown as VFileData
    const metadata = fileData.metadata
    const frontmatter = fileData.frontmatter

    visit<HAST.Element>(
      ast,
      node => {
        const tagName = node.tagName

        // ✨ page-meta 注入 metadata
        if (tagName === 'PageMeta') {
          Object.assign(node.properties, {
            tags: frontmatter?.tags,
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

function parsePreTab(children: any[]) {
  const res: TabItem[] = []

  for (const node of children) {
    if (node.tagName === 'pre') {
      const props = node.properties
      const text = props.filename || props.language
      const icon = props.language
      res.push({ text, icon })
    }
  }
  return res
}
