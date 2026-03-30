import type { MenuItem } from '../types'
import { useMemo } from 'react'
import { defineEbbStore } from '../store'
import { useMenus } from './menus'

interface SidebarState {
  isOpen: boolean
  disabled: boolean
  open: () => void
  close: () => void
  toggle: () => void
  setDisabled: (value: boolean) => void
}

const [useSidebar, sidebarStore] = defineEbbStore<SidebarState>((set, get) => {
  return {
    isOpen: false,
    disabled: false,
    open: () => {
      const state = get()
      !state.disabled && set({ isOpen: true })
    },
    close: () => {
      const state = get()
      !state.disabled && set({ isOpen: false })
    },
    toggle: () => {
      const state = get()
      !state.disabled && set({ isOpen: !state.isOpen })
    },
    setDisabled: (value: boolean) => set({ disabled: value })
  }
})

export { sidebarStore, useSidebar }

export function useSidebarControl() {
  const isOpen = useSidebar(state => state.isOpen)
  const disabled = useSidebar(state => state.disabled)
  const { open, close, toggle, setDisabled } = sidebarStore.getState()
  return { isOpen, disabled, open, close, toggle, setDisabled }
}

export function useSidebarMenus() {
  const menus = useMenus()

  const sidebarMenus = useMemo<MenuItem[]>(
    () => menus.filter(item => !item.hiddenInSidebar),
    [menus]
  )

  return sidebarMenus
}
