import type { InjectionKey } from 'vue'
import { createSharedState, useResizeObserver } from '@repo/utils/hooks'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

export interface MenuItem {
  text: string
  href?: string
  icon?: string
  children?: MenuItem[]
}

interface MenuMouseContext {
  hover: boolean
  ox: number
  oy: number
}

export const MenuMouseContext = Symbol(
  'nav-menu'
) as InjectionKey<MenuMouseContext>

export const useNavMouseHoverState = createSharedState(() => {
  const scope = ref<HTMLElement | null>(null)
  const hover = ref(false)
  const offsetX = ref(0)

  let scopeOffsetLeft = 0

  const { onWindowResize } = useResizeObserver()

  onMounted(() => {
    onWindowResize(() => {
      const element = scope.value
      if (!element) return

      scopeOffsetLeft = element.getBoundingClientRect().left
    })
  })

  const onMousemove = (event: MouseEvent) => {
    offsetX.value = event.clientX - scopeOffsetLeft
  }

  const onMouseenter = () => (hover.value = true)

  const onMouseleave = () => (hover.value = false)

  const clearEvents = () => {
    if (!scope.value) return
    scope.value.removeEventListener('pointermove', onMousemove)
    scope.value.removeEventListener('pointerenter', onMouseenter)
    scope.value.removeEventListener('pointerleave', onMouseleave)
  }

  watch(
    () => scope.value,
    target => {
      if (!target) return
      target.addEventListener('pointermove', onMousemove)
      target.addEventListener('pointerenter', onMouseenter)
      target.addEventListener('pointerleave', onMouseleave)

      scopeOffsetLeft = target.getBoundingClientRect().left
    }
  )

  onBeforeUnmount(clearEvents)

  return {
    scope,
    hover,
    offsetX,
    clearEvents
  }
})
