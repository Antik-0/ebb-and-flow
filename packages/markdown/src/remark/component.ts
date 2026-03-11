import type { MDAST } from '../types/index.ts'
import { withErrorHandler } from '../shared/error.ts'
import { normalizeKey } from '../shared/general.ts'

interface LinkNode {
  prev?: LinkNode
  value?: MDAST.Node
  closeTag?: string
}

/**
 * ✨ 自定义组件语法解析 - 只支持顶层组件
 */
export function remarkComponent() {
  return withErrorHandler<MDAST.Root>('remarkComponent', ast => {
    const children = ast.children
    const length = children.length

    let prevNode: LinkNode = { prev: null! }

    // 倒序遍历
    for (let i = length - 1; i >= 0; i--) {
      const node = children[i]!
      const currNode: LinkNode = { value: node }

      if (node.type === 'html') {
        const text = node.value
        if (closeTagReg.test(text)) {
          // 组件闭合标签
          currNode.closeTag = text.slice(2, -1)
        } else {
          // 尝试解析组件
          const component = parseComponent(text)
          const name = component.name

          // 尝试解析插槽
          const slots: MDAST.Node[] = []
          if (!component.inline) {
            while (prevNode.prev && name !== prevNode.closeTag) {
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

const closeTagReg = /^<\/[A-Z][A-Za-z0-9]*>$/
const componentReg = /^<([A-Z][A-Za-z0-9]*)(.*)(\S\/)?>$/
const propsReg = /(:?[a-z]+(?:-[a-z]+)?)\s*=\s*(["'])(.+?)\2/g

function parseComponent(template: string) {
  const match = template.match(componentReg)
  if (!match) {
    throw new Error(`resolve component failed in template: \`${template}\``)
  }

  const inline = template.endsWith(' />')
  const name = match[1] ?? ''
  const props = resolveProps(match[2] ?? '')

  return { name, props, inline }
}

function resolveProps(template: string) {
  template = template.trim()
  const props: Record<string, any> = {}

  for (const entry of template.matchAll(propsReg)) {
    let key = entry[1]!
    let value = entry[3]!
    if (key[0] === ':') {
      key = key.slice(1)
      value = JSON.parse(value)
    }
    props[normalizeKey(key)] = value
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
