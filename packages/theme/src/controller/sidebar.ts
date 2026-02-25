import { computed, ref } from 'vue'
import { useMenus } from './menus'

const isOpen = ref(false)
const disabled = ref(false)

export function useSidebarControl() {
  function open() {
    if (!disabled.value) {
      isOpen.value = true
    }
  }

  function close() {
    if (!disabled.value) {
      isOpen.value = false
    }
  }

  function toggle() {
    if (!disabled.value) {
      isOpen.value = !isOpen.value
    }
  }

  return {
    isOpen,
    disabled,
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
