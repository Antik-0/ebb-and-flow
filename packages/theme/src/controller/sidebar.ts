import type { SidebarMenuItem } from '#/types'
import { computed, readonly, ref } from 'vue'
import { useSharedMenus } from './menus'

const isOpen = ref(false)

export function useSidebarControl() {
  function open() {
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
  }

  function toggle() {
    isOpen.value = !isOpen.value
  }

  return {
    isOpen: readonly(isOpen),
    open,
    close,
    toggle
  }
}

export function useSidebarMenus() {
  const { menus } = useSharedMenus()

  const sidebarMenus = computed<SidebarMenuItem[]>(() =>
    menus.value.filter(item => item.link !== '/')
  )

  return { sidebarMenus }
}
