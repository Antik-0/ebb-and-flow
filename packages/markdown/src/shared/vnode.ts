import type { HAST, Props, VNode } from '../types/index.ts'

type HNode = HAST.Text | HAST.Element | HAST.Comment

/**
 * 将 `hast` 转换为 `vnode` 树
 */
export function createVNodeTree(ast: HAST.Root) {
  function transform(node: HNode) {
    if (node.type === 'comment') {
      return null
    }
    if (node.type === 'text') {
      if (node.value === '\n') {
        return null
      }
      return node.value
    }

    const tag = node.tagName
    const props = node.properties as Props
    const children: VNode[] = []

    if (node.children) {
      for (const element of node.children) {
        const vnode = transform(element)
        if (vnode) {
          children.push(vnode)
        }
      }
    }

    return [tag, props, children] as VNode
  }

  const tree: VNode[] = []
  for (const element of ast.children) {
    const vnode = transform(element as HNode)
    if (vnode) {
      tree.push(vnode)
    }
  }

  return tree
}
