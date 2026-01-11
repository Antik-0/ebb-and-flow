import type { MenuItem, NavMenuRecord } from '../types'
import { isExternalLink } from '@repo/utils'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useTheme } from '../theme'

export function useMenus() {
  const { theme } = useTheme()
  const pathname = usePathname()

  const [menus] = useState(() => buildMenuTree(theme.navMenus))
  const [currActiveNode, setCurrActiveNode] = useState<MenuItem | null>(null)
  const prevActiveNode = useRef<MenuItem | null>(null)

  const updateActiveLink = () => {
    const prevNode = currActiveNode
    const currNode = matchActiveNode(menus, pathname)
    prevActiveNode.current = prevNode
    setCurrActiveNode(currNode)

    updateNodeActive(prevNode, false)
    updateNodeActive(currNode, true)
  }

  useEffect(() => {
    updateActiveLink()
  }, [pathname])

  return { menus, currActiveNode }
}

let prevNavNode: MenuItem | undefined

function buildMenuTree(
  menus: NavMenuRecord[],
  parent: MenuItem | null = null,
  depth = 0
) {
  if (depth === 3) return []

  const tree: MenuItem[] = []
  for (const item of menus) {
    const { items, link, ...restProps } = item

    const node = {
      ...restProps,
      parent,
      active: false
    } as MenuItem

    // 建立导航链接
    if (link && link !== '/' && !isExternalLink(link)) {
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

function updateNodeActive(node: MenuItem | null, value: boolean) {
  while (node) {
    node.active = value
    node = node.parent ?? null
  }
}
