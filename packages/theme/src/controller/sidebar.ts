import type { SidebarItem } from '#/types'
import { computed, ref, shallowRef } from 'vue'
import { useSharedMenus } from './menus'

const isOpen = shallowRef(false)

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
    isOpen: computed(() => isOpen.value),
    open,
    close,
    toggle
  }
}

export function useSidebar() {
  const { menus } = useSharedMenus()

  const sidebarMenus = ref<SidebarItem[]>(
    menus.value.filter(item => item.link !== '/')
  )

  return { menus: sidebarMenus }
}
