import type { MenuItem, NavMenuRecord } from '#/types'
import { isExternalLink } from '@repo/utils'
import { computed, shallowRef } from 'vue'
import { useTheme } from '#/theme'

const menus = shallowRef<MenuItem[]>([])
const activeNodes = shallowRef<number[]>([])
const currActiveNode = shallowRef<MenuItem | null>(null)

function createMenuTree(menus: NavMenuRecord[]) {
  let nodeId = 0
  let prevNavNode: MenuItem | undefined

  function buildMenuTree(
    menus: NavMenuRecord[],
    parent: MenuItem | null = null,
    depth = 0
  ) {
    if (depth === 3) return []

    const tree: MenuItem[] = []
    for (const item of menus) {
      const { items, ...restProps } = item

      const node = {
        id: nodeId++,
        parent,
        ...restProps
      } as MenuItem

      const link = node.link
      // 建立导航链接
      if (link && link !== '/' && !isExternalLink(link)) {
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

export function updateActiveLink(path: string) {
  const activeNode = matchActiveNode(menus.value, path)
  let node = activeNode
  const nodeIds = []
  while (node) {
    nodeIds.push(node.id)
    node = node.parent ?? null
  }
  activeNodes.value = nodeIds
  currActiveNode.value = activeNode
}

/**
 * 获取共享菜单
 */
export function useMenus() {
  const { theme } = useTheme()
  if (menus.value.length === 0) {
    menus.value = createMenuTree(theme.navMenus)
  }
  return menus
}

/**
 * 根据 `id` 判断当前菜单节点是否激活
 */
export function useMenuNodeIsActive(id: number) {
  return computed(() => activeNodes.value.includes(id))
}

/**
 * 获取当前激活的菜单节点
 */
export function useCurrActiveNode() {
  return currActiveNode
}
