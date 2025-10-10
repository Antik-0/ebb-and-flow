import { computed, shallowRef } from 'vue'

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
