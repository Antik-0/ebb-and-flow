import type { MenuItemRaw, SidebarItem } from '#/types'
import { useData } from 'vitepress'
import { onMounted, ref, shallowRef, watch } from 'vue'
import { normalize, useTheme } from '#/shared'

const isOpen = shallowRef(false)

export function useSidebarControl() {
  function open() {
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
  }

  return {
    isOpen,
    open,
    close
  }
}

export function useSidebarMenus() {
  const { page } = useData()
  const theme = useTheme()

  const navMenus = theme.value.navMenus
  const menus = ref(buildMenuTree(navMenus))

  const prevActiveNode = shallowRef<SidebarItem | null>(null)
  const currActiveNode = shallowRef<SidebarItem | null>(null)

  const updateNodeActive = (node: SidebarItem | null, value: boolean) => {
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
    menus
  }
}

function buildMenuTree(
  menus: MenuItemRaw[],
  parent: SidebarItem | null = null,
  depth = 0
) {
  if (depth === 3) return []

  const tree: SidebarItem[] = []
  for (const item of menus) {
    const { items, ...restProps } = item
    const node = {
      ...restProps,
      parent,
      acitve: false
    } as SidebarItem

    if (Array.isArray(items) && items.length) {
      node.items = buildMenuTree(items, node, depth + 1)
    }
    tree.push(node)
  }
  return tree
}

function matchActiveNode(menus: SidebarItem[], currentPath: string) {
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
