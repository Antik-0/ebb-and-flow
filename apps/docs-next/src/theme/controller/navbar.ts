import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useResizeObserver } from '../hooks'

let scopeHalfWidth = 0
let scopeOffsetLeft = 0
let menuItemNodes: HTMLElement[] = []

export function useMenubarHover() {
  // 距离 scope 左边界的偏移量
  const [offsetX, setOffsetX] = useState(0)
  const onMouseMove = (event: PointerEvent) => {
    setOffsetX(event.clientX - scopeOffsetLeft)
  }

  return { offsetX, onMouseMove }
}

export function useMenubarMotion() {
  const scope = useRef<HTMLElement | null>(null)
  const { observe } = useResizeObserver()

  useEffect(() => {
    observe(
      () => scope.current,
      entry => {
        const target = entry.target as HTMLElement
        const rect = target.getBoundingClientRect()
        scopeHalfWidth = rect.width / 2
        scopeOffsetLeft = rect.left
      }
    )

    menuItemNodes = [
      ...scope.current!.querySelectorAll<HTMLElement>(
        "li[data-role='menuitem']"
      )
    ]

    return () => {
      scopeHalfWidth = 0
      scopeOffsetLeft = 0
      menuItemNodes = []
    }
  }, [])

  // 距离 scope 中心点的偏移量
  const [offsetX, setOffsetX] = useState(0)
  const [motion, setMotion] = useState({ offsetX: 0, width: 0 })

  function updateMotion(index: number) {
    const target = menuItemNodes[index]
    if (!target) return

    const itemWidth = target.offsetWidth
    const offsetXValue = target.offsetLeft + itemWidth / 2 - scopeHalfWidth
    setOffsetX(offsetXValue)
    setMotion({ offsetX: offsetXValue, width: itemWidth })
  }

  return { scope, offsetX, motion, updateMotion }
}

interface MenubarContext {
  offsetX: number
  showViewport: boolean
  prevHoverIndex: number
  currHoverIndex: number
}

export const MenubarContext = createContext({} as MenubarContext)

export function useMenubarCtx() {
  return useContext(MenubarContext)
}
