import { useResizeObserver } from '@repo/utils/hooks'
import { onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'

export interface MenuItem {
  text: string
  href?: string
  icon?: string
  children?: MenuItem[]
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
