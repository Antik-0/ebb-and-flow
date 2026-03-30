import type { InjectionKey, Ref, SlotsType, VNodeChild } from 'vue'
import type { Empty } from '#/types'
import {
  defineComponent,
  inject,
  nextTick,
  onMounted,
  provide,
  shallowRef
} from 'vue'
import { useResizeObserver } from '#/hooks'

interface MenubarMotion {
  width: number
  offsetX: number
}

type MotionCallback = (motion: MenubarMotion) => void

export function useMenubarMotion() {
  const scope = shallowRef<HTMLElement | null>(null)
  let scopeHalfWidth = 0
  let menuItemNodes: HTMLElement[] = []
  const motionCbs: MotionCallback[] = []

  const { observe } = useResizeObserver()
  onMounted(() => {
    observe(
      () => scope.value,
      entry => {
        const target = entry.target as HTMLElement
        const rect = target.getBoundingClientRect()
        scopeHalfWidth = rect.width / 2
      }
    )

    menuItemNodes = [
      ...scope.value!.querySelectorAll<HTMLElement>("li[data-role='menuitem']")
    ]
  })

  async function updateMotion(index: number) {
    const target = menuItemNodes[index]
    if (!target) return

    // 等待 `scope` 和 `icon` 渲染完毕
    await nextTick()

    if (scopeHalfWidth === 0) {
      const rect = scope.value!.getBoundingClientRect()
      scopeHalfWidth = rect.width / 2
    }

    const offsetLeft = target.offsetLeft
    const offsetWidth = target.offsetWidth
    const offsetX = offsetLeft + offsetWidth / 2 - scopeHalfWidth

    const motion = { offsetX, width: offsetWidth }
    for (const cb of motionCbs) {
      cb(motion)
    }
  }

  function onMotionChange(callback: MotionCallback) {
    motionCbs.push(callback)
  }

  return { scope, updateMotion, onMotionChange }
}

function createContext<T>() {
  const contextKey = Symbol() as InjectionKey<T>

  const Provider = defineComponent<
    { value: T },
    Empty,
    '',
    SlotsType<{ default: () => VNodeChild }>
  >(
    (props, { slots }) => {
      provide(contextKey, props.value)
      return () => slots.default()
    },
    { props: ['value'] }
  )

  const useContext = () => inject(contextKey)!

  return [Provider, useContext] as const
}

interface MenubarContext {
  onMenuItemHover: (index: number) => void
  onHoverIndexChange: (callback: (index: number) => void) => void
}

interface MotionContext {
  onMotionChange: (callback: MotionCallback) => void
}

interface ViewportContext {
  prevIndex: Ref<number>
  currIndex: Ref<number>
}

export const [MenubarProvider, useMenubar] = createContext<MenubarContext>()
export const [MotionProvider, useMotionCtx] = createContext<MotionContext>()
export const [ViewportProvider, useViewport] = createContext<ViewportContext>()
