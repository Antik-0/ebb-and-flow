import type { MenuItem } from '../types'
import { useMemo, useSyncExternalStore } from 'react'
import { useSharedMenus } from './menus'

type Subscriber = () => void

let isOpen = false
const subscribers = new Set<Subscriber>()

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
  subscribers.forEach(subscriber => {
    subscriber()
  })
}

function subscribe(subscriber: Subscriber) {
  subscribers.add(subscriber)
  return () => subscribers.delete(subscriber)
}

function getSnapshot() {
  return isOpen
}

export function useSidebarControl() {
  const isOpen = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
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
