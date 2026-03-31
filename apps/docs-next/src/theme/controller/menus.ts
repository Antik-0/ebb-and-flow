import type { MenuItem, NavMenuRecord } from '../types'
import { isExternalLink } from '@repo/utils'
import { useSyncExternalStore } from 'react'
import { useTheme } from '../theme'

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

let menus: MenuItem[] = []
let menuIndexMap: Record<string, string> = {}

const menuState = {
  index: '',
  node: null as MenuItem | null
}

function createMenuTree(menus: NavMenuRecord[]) {
  let nodeId = 0
  let prevNavNode: MenuItem | undefined
  menuIndexMap = {}

  function buildMenuTree(
    menus: NavMenuRecord[],
    parent: MenuItem | null = null,
    depth = 0
  ) {
    if (depth === 3) return []

    const tree: MenuItem[] = []
    for (const [index, item] of menus.entries()) {
      const { items, ...restProps } = item
      const pathIndex = parent ? `${parent.index}_${index}` : String(index)

      const node = {
        id: nodeId++,
        index: pathIndex,
        parent,
        ...restProps
      } as MenuItem

      // 建立导航链接
      const link = node.link
      if (link && link !== '/' && !isExternalLink(link)) {
        // 内部链接添加 `/docs` 前缀
        node.link = '/docs' + link
        if (prevNavNode) {
          prevNavNode.nextNav = node
        }
        node.prevNav = prevNavNode
        prevNavNode = node
      }

      if (node.link) {
        menuIndexMap[node.link] = pathIndex
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

/**
 * 更新菜单激活状态
 */
export function updateActiveLink(path: string) {
  const activeIndex = menuIndexMap[path]
  if (!activeIndex) {
    menuState.node = null
    menuState.index = ''
    notify()
    return
  }

  let tree = menus
  let node: MenuItem = null!
  const paths = activeIndex.split('_')
  for (const path of paths) {
    const index = Number(path)
    node = tree[index]!
    tree = node.items!
  }

  menuState.node = node
  menuState.index = activeIndex
  notify()
}

/**
 * 获取共享菜单
 */
export function useMenus() {
  const { theme } = useTheme()
  if (menus.length === 0) {
    menus = createMenuTree(theme.navMenus)
  }
  return menus
}

/**
 * 根据 `index` 判断当前菜单节点是否激活
 */
export function useMenuNodeIsActive(index: string) {
  const getSnapshot = () => menuState.index.startsWith(index)
  const isActive = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
  return isActive
}

/**
 * 获取当前激活的菜单节点
 */
export function useMenuActiveNode() {
  const node = useSyncExternalStore(
    subscribe,
    () => menuState.node,
    () => null
  )
  return node
}
