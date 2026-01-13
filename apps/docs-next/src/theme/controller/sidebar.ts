import type { MenuItem } from '../types'
import { useMemo } from 'react'
import { defineEbbStore } from '../store'
import { useSharedMenus } from './menus'

interface SidebarState {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

const [useSidebar, sidebarStore] = defineEbbStore<SidebarState>(set => {
  return {
    isOpen: false,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
    toggle: () => set(state => ({ isOpen: !state.isOpen }))
  }
})

export { useSidebar, sidebarStore }

export function useSidebarControl() {
  const isOpen = useSidebar(state => state.isOpen)
  const { open, close, toggle } = sidebarStore.getState()
  return { isOpen, open, close, toggle }
}

export function useSidebarMenus() {
  const menus = useSharedMenus()

  const sidebarMenus = useMemo<MenuItem[]>(
    () => menus.filter(item => !item.hiddenInSidebar),
    [menus]
  )

  return sidebarMenus
}
