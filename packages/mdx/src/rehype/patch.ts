import type { Plugin } from 'unified'
import type { HAST } from '../types.ts'
import { createEsTree } from '../shared/estree.ts'
import { getNodeText, visit } from '../shared/visit.ts'

/**
 * ✨ 完善部分标签 `props`
 */
export const rehypePatch: Plugin<[], HAST.Root> = () => {
  return async (ast, file) => {
    const tocDepth = (file.data.tocDepth as number[]) ?? []
    const tocHeads = tocDepth.map(n => `h${n}`)

    visit<any>(
      ast,
      node => {
        // ✨ 导航 h 标签注入 id
        if (tocHeads.includes(node.tagName)) {
          const id = getNodeText(node)
          Object.assign(node.properties, { id })
          return
        }

        // ✨ code-group 注入 tabs
        if (node.name === 'CodeGroup') {
          const tabs = parsePreTab(node.children)

          const attrs = propsToJsxAttributes({ tabs })
          node.attributes.push(...attrs)
        }
      },
      { depth: 1 }
    )
  }
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
  return res
}

interface JsxAttribute {
  type: 'mdxJsxAttribute'
  name: string
  value: string | JsxAttributeValue
}

interface JsxAttributeValue {
  type: 'mdxJsxAttributeValueExpression'
  value: string
}

function propsToJsxAttributes(props: Record<string, any>) {
  const attrs: JsxAttribute[] = []

  for (const name in props) {
    let value = props[name]
    if (typeof value !== 'string') {
      value = {
        type: 'mdxJsxAttributeValueExpression',
        value: JSON.stringify(value),
        data: {
          estree: createEsTree(value)
        }
      }
    }
    attrs.push({ type: 'mdxJsxAttribute', name, value })
  }

  return attrs
}
