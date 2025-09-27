import type { NavbarItem } from '#/types'
import { useResizeObserver } from '@repo/utils/hooks'
import { onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import { useTheme } from '#/shared'

export function useNavbarMenus() {
  const theme = useTheme()

  const menus = theme.value.navMenus as NavbarItem[]

  return {
    menus
  }
}

export function useMenuHover() {
  const scope = shallowRef<HTMLElement | null>(null)
  const offsetX = ref(0)

  let scopeOffsetLeft = 0

  const onMousemove = (event: MouseEvent) => {
    offsetX.value = event.clientX - scopeOffsetLeft
  }

  watch(
    () => scope.value,
    target => {
      if (!target) return
      target.addEventListener('pointermove', onMousemove)
      scopeOffsetLeft = target.getBoundingClientRect().left
    }
  )

  const { onWindowResize } = useResizeObserver()

  onMounted(() => {
    onWindowResize(() => {
      const element = scope.value
      if (!element) return
      scopeOffsetLeft = element.getBoundingClientRect().left
    })
  })

  onBeforeUnmount(() => {
    scope.value?.removeEventListener('pointermove', onMousemove)
  })

  return { scope, offsetX }
}
