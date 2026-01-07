import type { MenuItem, NavMenuRecord } from '#/types'
import { isExternalLink } from '@repo/utils'
import { useRouter } from 'nuxt/app'
import { onMounted, ref, shallowRef, watch } from 'vue'
import { createSharedState } from '#/hooks'
import { useTheme } from '#/theme'

export const useSharedMenus = createSharedState(() => {
  const router = useRouter()
  const { theme } = useTheme()

  const menus = ref(buildMenuTree(theme.navMenus))

  const prevActiveNode = shallowRef<MenuItem | null>(null)
  const currActiveNode = shallowRef<MenuItem | null>(null)

  const updateNodeActive = (node: MenuItem | null, value: boolean) => {
    while (node) {
      node.active = value
      node = node.parent ?? null
    }
  }

  const updateActiveLink = () => {
    prevActiveNode.value = currActiveNode.value

    const currentPath = router.currentRoute.value.path
    currActiveNode.value = matchActiveNode(menus.value, currentPath)

    updateNodeActive(prevActiveNode.value, false)
    updateNodeActive(currActiveNode.value, true)
  }

  watch(() => router.currentRoute.value, updateActiveLink)
  onMounted(updateActiveLink)

  return {
    menus,
    currActiveNode
  }
})

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
      ...restProps,
      parent,
      active: false
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
