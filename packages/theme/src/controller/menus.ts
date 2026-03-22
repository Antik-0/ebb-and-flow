import type { MenuItem, NavMenuRecord } from '#/types'
import { isExternalLink } from '@repo/utils'
import { useRouter } from 'nuxt/app'
import { computed, onMounted, shallowRef, watch } from 'vue'
import { useTheme } from '#/theme'

const menus = shallowRef<MenuItem[]>([])
let menuIndexMap: Record<string, string> = {}

const currActiveIndex = shallowRef('')
const currActiveNode = shallowRef<MenuItem | null>(null)

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
        if (prevNavNode) {
          prevNavNode.nextNav = node
        }
        node.prevNav = prevNavNode
        prevNavNode = node
      }

      if (link) {
        menuIndexMap[link] = pathIndex
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
 * 根据 `index` 判断当前菜单节点是否激活
 */
export function useMenuNodeIsActive(index: string) {
  return computed(() => currActiveIndex.value.startsWith(index))
}

/**
 * 获取当前激活的菜单节点
 */
export function useCurrActiveNode() {
  return currActiveNode
}

/**
 * 更新菜单激活状态
 */
export function useUpdateMenuActive() {
  const router = useRouter()

  onMounted(() => {
    watch(
      () => router.currentRoute.value,
      currentRoute => {
        updateActiveLink(currentRoute.path)
      },
      { immediate: true }
    )
  })
}

function updateActiveLink(path: string) {
  const activeIndex = menuIndexMap[path]
  if (!activeIndex) {
    currActiveIndex.value = ''
    currActiveNode.value = null
    return
  }

  let tree = menus.value
  let node: MenuItem = null!
  const paths = activeIndex.split('_')
  for (const path of paths) {
    const index = Number(path)
    node = tree[index]!
    tree = node.items!
  }

  currActiveNode.value = node
  currActiveIndex.value = activeIndex
}
