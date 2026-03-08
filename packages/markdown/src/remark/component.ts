import type { Plugin } from 'unified'
import type { MDAST } from '../types/index.ts'
import { getNodeText } from '../shared/visit.ts'

interface LinkNode {
  root?: boolean
  prev?: LinkNode
  next?: LinkNode
  value?: MDAST.Node
  isBoundary?: boolean
}

/**
 * ✨ 自定义组件语法解析
 */
export const remarkComponent: Plugin<[], MDAST.Root> = () => {
  const prefix = ':::'

  function transform(node: MDAST.Parent) {
    const root = { ...node }
    if (node.children?.length) {
      const children = node.children
      const length = children.length
      let currNode: LinkNode = { root: true }

      for (let i = length - 1; i >= 0; i--) {
        const _node = children[i]!
        const linkNode: LinkNode = { isBoundary: false }

        if (_node.type === 'paragraph') {
          const text = getNodeText(_node)
          if (text === prefix) {
            // 组件闭合标识
            linkNode.isBoundary = true
          } else if (text.startsWith(prefix)) {
            const slots: MDAST.Node[] = []
            while (!currNode.root && !currNode.isBoundary) {
              slots.push(currNode.value!)
              currNode = currNode.prev!
            }

            // todo: fix error
            if (currNode.root) {
              throw new Error('missing component closed tag')
            }

            const template = text.slice(prefix.length)
            // todo: fix no props
            const component = resolveComponent(template)

            linkNode.value = createComponentNode(
              component.name,
              component.props,
              slots
            )
            linkNode.isBoundary = true

            // 删除组件闭合标签
            currNode = currNode.prev!
          }
        }

        if (!linkNode.isBoundary) {
          linkNode.value = transform(_node as MDAST.Parent)
        }

        linkNode.prev = currNode
        currNode.next = linkNode
        currNode = linkNode
      }

      const nodes: MDAST.Node[] = []
      while (!currNode.root) {
        nodes.push(currNode.value!)
        currNode = currNode.prev!
      }
      root.children = nodes as any
    }
    return root
  }

  return (ast, vfile) => {
    try {
      return transform(ast) as MDAST.Root
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
  const resolveReg = /^([A-Z][A-Za-z0-9]*)\s*\{(.+)\}$/

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
      props[key] = value
    }
  }

  return props
}
