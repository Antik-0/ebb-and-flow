import type { Plugin } from 'unified'
import type { MDAST } from '../types/index.ts'
import { prettyLog } from '../shared/pretty.ts'
import { getNodeText } from '../shared/visit.ts'

interface LinkNode {
  prev?: LinkNode
  next?: LinkNode
  value?: MDAST.Node
  isBoundary?: boolean
}

/**
 * ✨ 自定义组件语法解析，只解析顶层组件
 */
export const remarkComponent: Plugin<[], MDAST.Root> = () => {
  const prefix = ':::'

  function transform(node: MDAST.Parent) {
    const root = { ...node }
    if (node.children?.length) {
      const children = node.children
      const length = children.length
      let prevNode: LinkNode = { prev: null! }

      for (let i = length - 1; i >= 0; i--) {
        const _node = children[i]!
        const currNode: LinkNode = { isBoundary: false }

        if (_node.type === 'paragraph') {
          const text = getNodeText(_node)
          if (text === prefix) {
            // 组件闭合标识
            currNode.isBoundary = true
          } else if (text.startsWith(prefix)) {
            const slots: MDAST.Node[] = []
            while (prevNode.prev && !prevNode.isBoundary) {
              slots.push(prevNode.value!)
              prevNode = prevNode.prev!
            }

            if (!prevNode.prev) {
              throw new Error('missing component closed tag')
            }

            const template = text.slice(prefix.length)
            const component = resolveComponent(template)

            currNode.value = createComponentNode(
              component.name,
              component.props,
              slots
            )
            currNode.isBoundary = true

            // 删除组件闭合标签
            prevNode = prevNode.prev!
          }
        }

        if (!currNode.isBoundary) {
          currNode.value = _node
        }

        currNode.prev = prevNode
        prevNode.next = currNode
        prevNode = currNode
      }

      const nodes: MDAST.Node[] = []
      while (prevNode.prev) {
        nodes.push(prevNode.value!)
        prevNode = prevNode.prev!
      }
      root.children = nodes as any
    }
    return root
  }

  return (ast, vfile) => {
    try {
      prettyLog(ast)
      // return transform(ast) as MDAST.Root
      return ast
    } catch (error) {
      throw new Error(
        `[remarkComponent]: ${(error as Error).message} in ${vfile.path}`
      )
    }
  }
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

function resolveComponent(template: string) {
  template = template.trim()
  const resolveReg = /^([A-Z][A-Za-z0-9]*)\s*(?:\{(.+)\})?$/

  const match = template.match(resolveReg)
  if (!match) {
    throw new Error('resolve component failed')
  }

  const name = match[1] ?? ''
  const props = resolveProps(match[2] ?? '')

  return { name, props }
}

function resolveProps(template: string) {
  template = template.replaceAll(/([:,])\s+/g, '$1') + ' '
  const props: Record<string, any> = {}

  const length = template.length
  let j = 0
  let key = ''
  let value: any = ''

  for (let i = 0; i < length; i++) {
    const s = template[i]
    if (s === '=') {
      key = template.slice(j, i)
      j = i + 1
    } else if (s === ' ') {
      value = template.slice(j, i)
      if (key[0] === ':') {
        key = key.slice(1)
        value = JSON.parse(value)
      }
      j = i + 1
      if (key) {
        props[key] = value
      }
    }
  }

  return props
}
