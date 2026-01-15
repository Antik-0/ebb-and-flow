import type { Literal, Node } from 'unist'
import { execSync } from 'node:child_process'

interface VNode extends Node {
  children?: VNode[]
}

// biome-ignore-start lint/suspicious/noConfusingVoidType: no why
type Visitor<T extends VNode = VNode> = (
  node: T,
  ctx: VisitorCtx<T>
) => number | void
// biome-ignore-end lint/suspicious/noConfusingVoidType: no why

type VisitorCtx<T> = {
  index: number
  parent: T | null
  signal: Signal
}

type Signal = typeof SIGNAL

/**
 * `visitor` 信号量
 */
const SIGNAL = {
  stop: 1, // 停止继续遍历子节点，会继续遍历兄弟节点
  return: 2, // 停止继续遍历
  delete: 4 // 删除节点
} as const

interface VisitOptions {
  /**
   * 过滤类型
   */
  type?: string
  /**
   * 访问深度, `-1` 表示访问所有节点
   */
  depth?: number
  /**
   * 反向遍历，不影响顶层节点
   */
  reversed?: boolean
}

/**
 * ✨ 遍历 `AST`，根据 `visitor` 回调返回值，控制遍历流程
 */
export function visit<T extends VNode = VNode>(
  tree: VNode,
  visitor: Visitor<T>,
  options: VisitOptions = {}
) {
  const { type, depth = -1, reversed = false } = options

  const delSymbol = Symbol('delete')

  const dfs = (
    node: VNode,
    index: number,
    parent: VNode | null,
    depth = -1
  ) => {
    let flag = 0
    if (!type || type === node.type) {
      flag = visitor(node as T, { index, parent, signal: SIGNAL } as any) ?? 0
    }

    if (depth === 0 || flag > 0 || !node.children) {
      return flag
    }

    const isReversed = node.type !== 'root' && reversed
    const children = isReversed ? node.children.toReversed() : node.children

    let hasChange = false
    for (let i = 0; i < children.length; i++) {
      const childNode = children[i]!
      const childFlag = dfs(childNode, i, node, depth - 1) ?? 0

      if (childFlag & SIGNAL.delete) {
        // 标记当前子节点需要删除
        hasChange = true
        Reflect.set(childNode, delSymbol, true)
      }
      if (childFlag & SIGNAL.return) {
        // 退出树遍历
        flag |= SIGNAL.return
        break
      }
    }

    if (hasChange) {
      node.children = node.children.filter(n => !Reflect.has(n, delSymbol))
    }

    return flag
  }

  dfs(tree, -1, null, depth)
}

/**
 * 获取节点文本
 */
export function getNodeText(node: VNode) {
  let s = ''
  visit<Literal>(
    node,
    node => {
      s += node.value
    },
    { type: 'text' }
  )
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
