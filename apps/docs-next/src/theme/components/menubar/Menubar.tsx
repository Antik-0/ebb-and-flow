import type { ViewportRef } from './MenuViewport'
import { LayoutGroup, animate, motion, useMotionValue } from 'motion/react'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { stylex } from '#/utils'
import { useMenuActiveNode, useSharedMenus } from '../../controller/menus'
import {
  MenubarProvider,
  MotionProvider,
  useMenubarMotion,
  useMotion
} from '../../controller/navbar'
import { FlowingLight } from '../FlowingLight'
import { MenubarItem } from './MenubarItem'
import { MenuViewport } from './MenuViewport'

const MenubarItemMemo = memo(MenubarItem, () => true)

type HoverChangeCallback = (index: number) => void

export function Menubar() {
  const menus = useSharedMenus()
  const currActiveNode = useMenuActiveNode()
  const { scope, updateMotion, onMotionChange } = useMenubarMotion()

  const activeIndex = useRef(-1)
  const viewportRef = useRef<ViewportRef>(undefined!)
  const hoverChangeCbs = useRef<HoverChangeCallback[]>([])

  useEffect(() => {
    const prevActiveIndex = activeIndex.current

    let activeNode = currActiveNode
    while (activeNode?.parent) {
      activeNode = activeNode.parent
    }

    const index = menus.indexOf(activeNode!)
    if (prevActiveIndex !== index) {
      activeIndex.current = index
      updateMotion(index)
    }
  }, [currActiveNode])

  const onMenuItemHover = useCallback((index: number) => {
    updateMotion(index)
    for (const cb of hoverChangeCbs.current) {
      cb(index)
    }
  }, [])

  const onHoverIndexChange = useCallback((callback: HoverChangeCallback) => {
    hoverChangeCbs.current.push(callback)
  }, [])

  function onMouseEnter() {
    viewportRef.current.open()
  }

  function onMouseLeave() {
    viewportRef.current.close()
  }

  function onViewportClose() {
    updateMotion(activeIndex.current)
  }

  const motionValue = useMemo(
    () => ({
      onMotionChange
    }),
    [onMotionChange]
  )

  const contextValue = useMemo(
    () => ({
      onMenuItemHover,
      onHoverIndexChange
    }),
    [onMenuItemHover, onHoverIndexChange]
  )

  return (
    <nav className="menubar" onPointerLeave={onMouseLeave} ref={scope}>
      <MotionProvider value={motionValue}>
        <MenubarBackground />
        <MenubarIndicator />
      </MotionProvider>

      <MenubarProvider value={contextValue}>
        <menu
          className="grid-full px-4 flex"
          data-role="menu"
          onPointerEnter={onMouseEnter}
        >
          <LayoutGroup>
            {menus.map((item, index) => (
              <MenubarItemMemo index={index} item={item} key={item.id} />
            ))}
          </LayoutGroup>
        </menu>
        <MenuViewport onClose={onViewportClose} ref={viewportRef} />
      </MenubarProvider>

      <FlowingLight />
    </nav>
  )
}

function MenubarBackground() {
  const [offsetX, setOffsetX] = useState(0)
  const { onMotionChange } = useMotion()

  useEffect(() => {
    onMotionChange(motion => {
      setOffsetX(motion.offsetX)
    })
  }, [])

  return (
    <div
      aria-hidden="true"
      className="menubar-background"
      data-role="background"
      style={stylex({ '--offset-x': offsetX + 'px' })}
    ></div>
  )
}

function MenubarIndicator() {
  const motionX = useMotionValue(0)
  const motionW = useMotionValue(0)
  const { onMotionChange } = useMotion()

  useEffect(() => {
    onMotionChange(motion => {
      const { offsetX, itemWidth } = motion
      animate(motionX, offsetX, { type: 'spring', duration: 0.6 })
      animate(motionW, itemWidth, { type: 'spring', duration: 0.6 })
    })
  }, [])

  return (
    <motion.div
      aria-hidden="true"
      className="rounded-[--rounded] h-8 absolute -z-1"
      data-role="indicator"
      style={{
        x: motionX,
        width: motionW,
        boxShadow: 'inset 0 0 12px 1px hsl(187 75% 65% / 0.4)'
      }}
    />
  )
}
