import type { PropsWithChildren } from 'react'
import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useRef
} from 'react'
import { useResizeObserver } from '../hooks'

interface MenubarMotion {
  offsetX: number
  itemWidth: number
}

type MotionCallback = (motion: MenubarMotion) => void

export function useMenubarMotion() {
  const scope = useRef<HTMLElement | null>(null)
  const scopeHalfWidth = useRef(0)
  const menuItemNodes = useRef<HTMLElement[]>([])
  const motionCbs = useRef<MotionCallback[]>([])

  const { observe } = useResizeObserver()
  useEffect(() => {
    observe(
      () => scope.current,
      entry => {
        const target = entry.target as HTMLElement
        const rect = target.getBoundingClientRect()
        scopeHalfWidth.current = rect.width / 2
      }
    )

    menuItemNodes.current = [
      ...scope.current!.querySelectorAll<HTMLElement>(
        "li[data-role='menuitem']"
      )
    ]

    return () => {
      scopeHalfWidth.current = 0
      menuItemNodes.current = []
    }
  }, [])

  const updateMotion = useCallback((index: number) => {
    const target = menuItemNodes.current[index]
    if (!target) return

    if (scopeHalfWidth.current === 0) {
      const rect = scope.current!.getBoundingClientRect()
      scopeHalfWidth.current = rect.width / 2
    }

    const offsetLeft = target.offsetLeft
    const offsetWidth = target.offsetWidth
    const offsetX = offsetLeft + offsetWidth / 2 - scopeHalfWidth.current

    const motion: MenubarMotion = {
      offsetX,
      itemWidth: offsetWidth
    }

    for (const cb of motionCbs.current) {
      cb(motion)
    }
  }, [])

  const onMotionChange = useCallback((callback: MotionCallback) => {
    motionCbs.current.push(callback)
  }, [])

  return { scope, updateMotion, onMotionChange }
}

interface MenubarContext {
  onMenuItemHover: (index: number) => void
  onHoverIndexChange: (callback: (index: number) => void) => void
}

interface MotionContext {
  onMotionChange: (callback: MotionCallback) => void
}

interface ViewportContext {
  prevIndex: number
  currIndex: number
}

function createMenubar() {
  const MenubarCtx = createContext({} as MenubarContext)

  const Provider = (props: PropsWithChildren<{ value: MenubarContext }>) => {
    const { value, children } = props
    return createElement(MenubarCtx, { value }, children)
  }

  const useCtx = () => useContext(MenubarCtx)

  return [Provider, useCtx] as const
}

function createMenubarMotion() {
  const MotionCtx = createContext({} as MotionContext)

  const Provider = (props: PropsWithChildren<{ value: MotionContext }>) => {
    const { value, children } = props
    return createElement(MotionCtx, { value }, children)
  }

  const useCtx = () => useContext(MotionCtx)

  return [Provider, useCtx] as const
}

function createMenubarViewport() {
  const ViewportCtx = createContext({} as ViewportContext)

  const Provider = (props: PropsWithChildren<{ value: ViewportContext }>) => {
    const { value, children } = props
    return createElement(ViewportCtx, { value }, children)
  }

  const useCtx = () => useContext(ViewportCtx)

  return [Provider, useCtx] as const
}

export const [MotionProvider, useMotion] = createMenubarMotion()
export const [MenubarProvider, useMenubar] = createMenubar()
export const [ViewportProvider, useViewport] = createMenubarViewport()
