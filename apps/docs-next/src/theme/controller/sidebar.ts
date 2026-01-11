import type { SidebarMenuItem } from '../types'
import { useMemo, useSyncExternalStore } from 'react'
import { useMenus } from './menus'

type Listener = () => void

let isOpen = false
let listeners: Listener[] = []

function open() {
  isOpen = true
  update()
}

function close() {
  isOpen = false
  update()
}

function toggle() {
  isOpen = !isOpen
  update()
}

function update() {
  for (const listener of listeners) {
    listener()
  }
}

function subscribe(listener: Listener) {
  listeners.push(listener)
  return () => (listeners = listeners.filter(l => l !== listener))
}

function getSnapshot() {
  return isOpen
}

export function useSidebarControl() {
  const isOpen = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
  return { isOpen, open, close, toggle }
}

export function useSidebarMenus() {
  const { menus } = useMenus()

  const sidebarMenus = useMemo<SidebarMenuItem[]>(
    () => menus.filter(item => !item.hiddenInSidebar),
    [menus]
  )

  return { sidebarMenus }
}
