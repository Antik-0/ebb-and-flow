import type { Literal, Node } from 'unist'

interface VNode extends Node {
  children?: VNode[]
}

// biome-ignore-start lint/suspicious/noConfusingVoidType: maybe void
type Visitor<T extends VNode = VNode> = (
  node: T,
  ctx: VisitorCtx<T>
) => number | void
// biome-ignore-end lint/suspicious/noConfusingVoidType: maybe void

type VisitorCtx<T = VNode> = {
  index: number
  parent: T | null
  signal: Signal
}

/**
 * `visitor` 信号量
 */
const SIGNAL = {
  STOP: 1, // 停止继续遍历子节点，会继续遍历兄弟节点
  RETURN: 2, // 停止继续遍历
  DELETE: 4 // 删除节点
} as const

type Signal = typeof SIGNAL

interface VisitOptions {
  /**
   * 过滤类型
   */
  type?: string
  /**
   * 访问深度, `-1` 表示访问所有节点
   * @default -1
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

  const needDelete = Symbol('delete')

  const dfs = (
    node: VNode,
    index: number,
    parent: VNode | null,
    depth = -1
  ) => {
    let flag = 0
    if (!type || type === node.type) {
      const ctx = { index, parent, signal: SIGNAL }
      flag = visitor(node as T, ctx as VisitorCtx<T>) ?? 0
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

      if (childFlag & SIGNAL.DELETE) {
        // 标记当前子节点需要删除
        hasChange = true
        Reflect.set(childNode, needDelete, true)
      }
      if (childFlag & SIGNAL.RETURN) {
        // 退出树遍历
        flag |= SIGNAL.RETURN
        break
      }
    }

    if (hasChange) {
      node.children = node.children.filter(n => !Reflect.has(n, needDelete))
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
