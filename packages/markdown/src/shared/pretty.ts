import type { Node, Parent } from 'unist'

/**
 * ✨ 美化打印调试(去除postions噪音)
 */
export function prettyLog(ast: Parent | Node) {
  function dfs(node: Parent | Node) {
    const { position, children, ...attrs } = node as Parent
    const nodes: Node[] = []
    if (children) {
      for (const snode of children) {
        nodes.push(dfs(snode))
      }
    }
    return { ...attrs, children: nodes }
  }

  const root = dfs(ast)
  console.dir(root, { depth: null })
}
