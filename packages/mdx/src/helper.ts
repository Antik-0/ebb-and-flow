import type { Literal, Node, Parent } from 'unist'
import { execSync } from 'node:child_process'

type Visitor<T extends Node = Node> = (
  node: T,
  index: number,
  parent: Parent | null
) => boolean | void

/**
 * 遍历 `AST`, 如果回调函数返回 `false`, 那么不会继续对子树遍历，但是会继续遍历兄弟树
 */
export function visit<T extends Node = Node>(
  tree: Node,
  visitor: Visitor<T>
): void
export function visit<T extends Node = Node>(
  tree: Node,
  type: string,
  visitor: Visitor<T>
): void
export function visit<T extends Node = Node>(
  tree: Node,
  typeOrVisitor: string | Visitor<T>,
  maybeVisitor?: Visitor<T>
) {
  let filterType: string | undefined
  let visitor: Visitor<T>

  if (typeof typeOrVisitor === 'string') {
    filterType = typeOrVisitor
    visitor = maybeVisitor!
  } else {
    visitor = typeOrVisitor
  }

  const dfs = (node: Node, index: number, parent: Parent | null) => {
    let shouldContinue = true
    if (!filterType || filterType === node.type) {
      shouldContinue = visitor(node as T, index, parent) ?? true
    }
    if (!shouldContinue) return

    const children = (node as unknown as Parent).children ?? []
    for (let i = 0; i < children.length; i++) {
      dfs(children[i]!, i, node as Parent)
    }
  }

  dfs(tree, -1, null)
}

/**
 * 获取节点文本
 */
export function getNodeText(node: Node) {
  let s = ''
  visit<Literal>(node, 'text', node => {
    s += node.value
  })
  return s
}

/**
 * 计算文章阅读时间
 */
export function computeReadingTime(content: string) {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

/**
 * 获取文章 git 最后提交时间
 */
export function getGitUpdatedTime(filepath: string) {
  try {
    const time = execSync(
      `git log -1 --pretty=format:%ct -- ${filepath}`
    ).toString()
    return Number(time) * 1000
  } catch {
    return null
  }
}
