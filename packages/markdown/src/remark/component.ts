import type { MDAST } from '../types/index.ts'
import { withErrorHandler } from '../shared/error.ts'
import { getNodeText } from '../shared/visit.ts'

interface LinkNode {
  prev?: LinkNode
  value?: MDAST.Node
  isBoundary?: boolean
}

/**
 * ✨ 自定义组件语法解析 - 只支持顶层组件
 */
export function remarkComponent() {
  const marker = ':::'

  return withErrorHandler<MDAST.Root>('remarkComponent', ast => {
    const children = ast.children
    const length = children.length

    let prevNode: LinkNode = { prev: null! }

    // 倒序遍历
    for (let i = length - 1; i >= 0; i--) {
      const node = children[i]!
      const currNode: LinkNode = { value: node }

      if (node.type === 'paragraph') {
        const text = getNodeText(node)
        if (text === marker) {
          // 组件闭合标签
          currNode.isBoundary = true
        } else if (text.startsWith(marker)) {
          // 尝试解析组件
          const component = parseComponent(text, marker)

          // 尝试解析插槽
          const slots: MDAST.Node[] = []
          if (!component.inline) {
            while (prevNode.prev && !prevNode.isBoundary) {
              slots.push(prevNode.value!)
              prevNode = prevNode.prev!
            }

            // 没匹配到闭合标签
            if (!prevNode.prev) {
              throw new Error(
                `missing component closed tag in template: \`${text}\``
              )
            }

            // 删除组件闭合标签
            prevNode = prevNode.prev!
          }

          currNode.value = createComponentNode(
            component.name,
            component.props,
            slots
          )
        }
      }

      currNode.prev = prevNode
      prevNode = currNode
    }

    const nodes: MDAST.Node[] = []
    while (prevNode.prev) {
      nodes.push(prevNode.value!)
      prevNode = prevNode.prev!
    }

    ast.children = nodes as MDAST.RootContent[]
    return ast
  })
}

const componentReg = /^([A-Z][A-Za-z0-9]*)\s*(?:\{(.+)\})?$/

function parseComponent(template: string, marker: string) {
  const inline = template.endsWith(marker)
  const markerLen = marker.length
  const start = markerLen
  const end = template.length - (inline ? markerLen : 0)
  template = template.slice(start, end).replace(/\r?\n$/, '')

  const match = template.match(componentReg)
  if (!match) {
    throw new Error(`resolve component failed in template: \`${template}\``)
  }

  const name = match[1] ?? ''
  const props = resolveProps(match[2] ?? '')

  return { name, props, inline }
}

function resolveProps(template: string) {
  template = template.replaceAll(/([:,])\s+/g, '$1') + ' '

  const props: Record<string, any> = {}
  const length = template.length
  let i = 0
  let key = ''
  let value: any = ''

  for (let j = 0; j < length; j++) {
    const s = template[j]
    if (s === '=') {
      key = template.slice(i, j)
      i = j + 1
    } else if (s === ' ') {
      value = template.slice(i, j)
      if (key[0] === ':') {
        key = key.slice(1)
        value = JSON.parse(value)
      }
      i = j + 1
      if (key) {
        props[key] = value
      }
    }
  }

  return props
}

function createComponentNode(
  name: string,
  props: Record<string, any>,
  slots: MDAST.Node[]
) {
  return {
    type: 'component',
    data: {
      hName: name,
      hProperties: props
    },
    children: slots
  } as MDAST.Node
}
