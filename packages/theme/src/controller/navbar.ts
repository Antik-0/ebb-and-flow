import type { InjectionKey, MaybeRefOrGetter, ShallowRef, VNode } from 'vue'
import type { NavMenuItem, Timer } from '#/types'
import { useResizeObserver } from '@repo/utils/hooks'
import { inject, onMounted, provide, shallowRef, toValue } from 'vue'

export function useMenubarHover(scope: MaybeRefOrGetter<HTMLElement | null>) {
  const offsetX = shallowRef(0)
  let scopeOffsetLeft = 0

  const onMousemove = (event: MouseEvent) => {
    offsetX.value = event.clientX - scopeOffsetLeft
  }

  const { onWindowResize } = useResizeObserver()

  onMounted(() => {
    onWindowResize(() => {
      const element = toValue(scope)
      if (!element) return
      scopeOffsetLeft = element.getBoundingClientRect().left
    })
  })

  return { offsetX, onMousemove }
}

export interface Content {
  item: NavMenuItem
  render: () => VNode[]
}

interface MenuViewContent {
  visible: ShallowRef<boolean>
  contents: ShallowRef<Content[]>
  prevHoverIndex: ShallowRef<number>
  currHoverIndex: ShallowRef<number>
  arrowOffsetX: ShallowRef<number>
  forwarItemContent: (item: NavMenuItem, contentRender: () => VNode[]) => void
  onMenuItemHover: (event: MouseEvent, index: number) => void
}

export const MenuViewCtx = Symbol('menubar') as InjectionKey<MenuViewContent>

export function useMenuViewCtx() {
  return inject(MenuViewCtx)!
}

export function useMenuViewControl(
  scope: MaybeRefOrGetter<HTMLElement | null>
) {
  const visible = shallowRef(false)
  let timer: Timer | null = null

  function onMouseenter() {
    visible.value = true
    timer && clearTimeout(timer)
  }

  function onMouseleave() {
    timer = setTimeout(() => {
      visible.value = false
    }, 200)
  }

  const contents = shallowRef<Content[]>([])

  function forwarItemContent(item: NavMenuItem, contentRender: () => VNode[]) {
    contents.value.push({
      item,
      render: contentRender
    })
  }

  const prevHoverIndex = shallowRef(-1)
  const currHoverIndex = shallowRef(-1)
  const arrowOffsetX = shallowRef(0)

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
      arrowOffsetXCache = Array.from<number>({ length })
    }

    if (arrowOffsetXCache[index] !== undefined) {
      return arrowOffsetXCache[index]
    }

    // 缓存未命中
    let offsetLeft = 0
    const targetWidth = target.offsetWidth

    const root = toValue(scope)!
    while (target !== root) {
      offsetLeft += target.offsetLeft
      target = target.offsetParent as HTMLElement
    }

    const offsetX = offsetLeft + targetWidth / 2 - root.offsetWidth / 2
    arrowOffsetXCache[index] = offsetX

    return offsetX
  }

  provide(MenuViewCtx, {
    visible,
    contents,
    prevHoverIndex,
    currHoverIndex,
    arrowOffsetX,
    forwarItemContent,
    onMenuItemHover
  })

  return {
    onMouseenter,
    onMouseleave
  }
}
