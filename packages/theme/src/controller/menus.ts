import type { MenuItem, MenuItemRaw } from '#/types'
import { createSharedState } from '@repo/utils/hooks'
import { useData } from 'vitepress'
import { onMounted, ref, shallowRef, watch } from 'vue'
import { normalize, useTheme } from '#/shared'

export const useSharedMenus = createSharedState(() => {
  const { page } = useData()
  const theme = useTheme()

  const navMenus = theme.value.navMenus
  const menus = ref(buildMenuTree(navMenus))

  const prevActiveNode = shallowRef<MenuItem | null>(null)
  const currActiveNode = shallowRef<MenuItem | null>(null)

  const updateNodeActive = (node: MenuItem | null, value: boolean) => {
    while (node) {
      node.acitve = value
      node = node.parent ?? null
    }
  }

  const updateActiveLink = () => {
    prevActiveNode.value = currActiveNode.value

    const currentPath = normalize(`/${page.value.relativePath}`)
    currActiveNode.value = matchActiveNode(menus.value, currentPath)

    updateNodeActive(prevActiveNode.value, false)
    updateNodeActive(currActiveNode.value, true)
  }

  watch(page, updateActiveLink)
  onMounted(updateActiveLink)

  return {
    menus,
    currActiveNode
  }
})

function buildMenuTree(
  menus: MenuItemRaw[],
  parent: MenuItem | null = null,
  depth = 0
) {
  if (depth === 3) return []

  const tree: MenuItem[] = []
  for (const item of menus) {
    const { items, ...restProps } = item
    const node = {
      ...restProps,
      parent,
      acitve: false
    } as MenuItem

    if (Array.isArray(items) && items.length) {
      node.items = buildMenuTree(items, node, depth + 1)
    }
    tree.push(node)
  }
  return tree
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
