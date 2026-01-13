import type { MenuItem, NavMenuRecord } from '../types'
import { isExternalLink } from '@repo/utils'
import { useSyncExternalStore } from 'react'
import { useTheme } from '../theme'

let menus: MenuItem[] = []
let currActiveNode: MenuItem | null = null
let activeNodes: number[] = []

/**
 * ----------------------------------------
 * ✨ 节点激活订阅状态
 * ---------------------------------------- */

type Subscriber = () => void

const subscribers = new Set<Subscriber>()

function subscribe(subscriber: Subscriber) {
  subscribers.add(subscriber)
  return () => subscribers.delete(subscriber)
}

function notify() {
  subscribers.forEach(subscriber => {
    subscriber()
  })
}

function createMenuTree(menus: NavMenuRecord[]) {
  let nodeId = 0
  let prevNavNode: MenuItem | undefined

  function buildMenuTree(
    root: NavMenuRecord[],
    parent: MenuItem | null = null,
    depth = 0
  ) {
    if (depth === 3) return []

    const tree: MenuItem[] = []
    for (const item of root) {
      const { items, link, ...restProps } = item

      const node = {
        id: nodeId++,
        parent,
        ...restProps
      } as MenuItem

      // 建立导航链接
      if (link && link !== '/' && !isExternalLink(link)) {
        // 内部链接添加 `/docs` 前缀
        node.link = '/docs' + link
        if (prevNavNode) {
          prevNavNode.nextNav = node
        }
        node.prevNav = prevNavNode
        prevNavNode = node
      }

      if (Array.isArray(items) && items.length) {
        node.items = buildMenuTree(items, node, depth + 1)
      }
      tree.push(node)
    }
    return tree
  }

  return buildMenuTree(menus)
}

export function updateActiveLink(pathname: string) {
  currActiveNode = matchActiveNode(menus, pathname)
  let node = currActiveNode
  const nodeIds = []
  while (node) {
    nodeIds.push(node.id)
    node = node.parent
  }
  activeNodes = nodeIds
  notify()
}

function matchActiveNode(menus: MenuItem[], currentPath: string) {
  const queue = [...menus]

  while (queue.length) {
    const node = queue.shift()!
    if (node.link === currentPath) {
      return node
    }
    if (node.items) {
      queue.push(...node.items)
    }
  }
  return null
}

/**
 * 获取共享菜单
 */
export function useSharedMenus() {
  const { theme } = useTheme()
  if (menus.length === 0) {
    menus = createMenuTree(theme.navMenus)
  }
  return menus
}

/**
 * 根据菜单 id 判断当前菜单节点是否激活
 */
export function useMenuNodeIsActive(id: number) {
  const getSnapshot = () => activeNodes.includes(id)
  const isActive = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
  return isActive
}

/**
 * 获取当前激活的菜单节点
 */
export function useMenuActiveNode() {
  const getSnapshot = () => currActiveNode
  const node = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
  return node
}
