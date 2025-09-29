import type { InjectionKey, Ref, ShallowRef, VNode } from 'vue'
import type { NavMenuItem } from '#/types'
import { useResizeObserver } from '@repo/utils/hooks'
import { onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'

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

export interface Content {
  item: NavMenuItem
  render: () => VNode[]
}

interface MenubarContext {
  contents: ShallowRef<Content[]>
  prevHoverIndex: Ref<number>
  currHoverIndex: Ref<number>
  forwarItemContent: (item: NavMenuItem, contentRender: () => VNode[]) => void
  onMenuItemHover: (event: MouseEvent, index: number) => void
}

export const MenubarCtx = Symbol('menubar') as InjectionKey<MenubarContext>

export function useMenuViewControl() {
  const prevHoverIndex = ref(-1)
  const currHoverIndex = ref(-1)
  const arrowOffsetX = ref(0)

  const contents = shallowRef<Content[]>([])

  function forwarItemContent(item: NavMenuItem, contentRender: () => VNode[]) {
    contents.value.push({
      item,
      render: contentRender
    })
  }

  function onMenuItemHover(event: MouseEvent, index: number) {
    prevHoverIndex.value = currHoverIndex.value
    currHoverIndex.value = index

    const target = event.target! as HTMLElement
    arrowOffsetX.value = computeArrowOffsetX(target, index)
  }

  let arrowOffsetXCache: number[] = []
  function computeArrowOffsetX(target: HTMLElement, index: number) {
    if (arrowOffsetXCache.length === 0) {
      const length = contents.value.length
      arrowOffsetXCache = Array.from<number>({ length }).fill(0)
    }

    if (arrowOffsetXCache[index] !== 0) {
      return arrowOffsetXCache[index]!
    }

    // 缓存未命中
    // 设计上下文，全部都走缓存
    // const parent = target.offsetParent!.offsetWidth
    return 0
  }

  return {
    contents,
    prevHoverIndex,
    currHoverIndex,
    forwarItemContent,
    onMenuItemHover
  }
}
