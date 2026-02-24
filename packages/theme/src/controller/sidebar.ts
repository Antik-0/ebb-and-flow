import { computed, ref } from 'vue'
import { useMenus } from './menus'

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
    isOpen,
    open,
    close,
    toggle
  }
}

export function useSidebarMenus() {
  const menus = useMenus()

  const sidebarMenus = computed(() =>
    menus.value.filter(item => !item.hiddenInSidebar)
  )

  return sidebarMenus
}
