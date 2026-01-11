import type { PointerEvent } from 'react'
import { LayoutGroup, motion, useMotionValue } from 'motion/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { withVars } from '#/utils'
import { useMenus } from '../../controller/menus'
import { MenubarContext, useMenuViewControl } from '../../controller/navbar'
import { useResizeObserver } from '../../hooks'
import { FlowingLight } from '../FlowingLight'
import { MenubarGroup } from './MenubarGroup'
import { MenubarItem } from './MenubarItem'
import { MenuViewport } from './MenuViewport'

export function Menubar() {
  // scope 的计算信息
  const scopeHalfWidth = useRef(0)
  const scopeOffsetLeft = useRef(0)
  const menuItemNodes = useRef<HTMLElement[]>([])

  const scope = useRef<HTMLElement | null>(null)
  const { observe } = useResizeObserver()

  useEffect(() => {
    observe(
      () => scope.current,
      entry => {
        const target = entry.target as HTMLElement
        const rect = target.getBoundingClientRect()
        scopeHalfWidth.current = rect.width / 2
        scopeOffsetLeft.current = rect.left
      }
    )

    menuItemNodes.current = [
      ...scope.current!.querySelectorAll<HTMLElement>("li[role='menuitem']")
    ]
  }, [])

  const [hoverX, setHoverX] = useState(0)
  const onMousemove = (event: PointerEvent<HTMLElement>) => {
    setHoverX(event.clientX - scopeOffsetLeft.current)
  }

  const [offsetX, setOffsetX] = useState(0)
  const motionX = useMotionValue(0)
  const motionW = useMotionValue(0)

  const [activeIndex, setActiveIndex] = useState(-1)
  const { menus, currActiveNode } = useMenus()

  const {
    visible,
    prevHoverIndex,
    currHoverIndex,
    contentViews,
    onMouseenter,
    onMouseleave,
    onMenuItemHover,
    forwardContent
  } = useMenuViewControl()

  const contextValue = useMemo(
    () => ({
      offsetX,
      showViewport: visible,
      contentViews,
      prevHoverIndex,
      currHoverIndex,
      forwardContent
    }),
    [offsetX, visible, prevHoverIndex, currHoverIndex]
  )

  function onViewportClose() {}

  return (
    <MenubarContext value={contextValue}>
      <nav
        className="menubar"
        onPointerEnter={onMouseenter}
        onPointerLeave={onMouseleave}
        onPointerMove={onMousemove}
        ref={scope}
      >
        <div
          aria-hidden="true"
          className="menubar-background"
          style={withVars({ '--offset-x': hoverX + 'px' })}
        ></div>

        <motion.div
          className="menubar-indicator absolute -z-1"
          data-show="true"
          style={{ x: motionX, width: motionW }}
        />

        <menu className="grid-full px-4 flex" data-role="menu">
          <LayoutGroup>
            {menus.map((item, index) => (
              <MenubarItem
                content={() => <MenubarGroup items={item.items} />}
                item={item}
                key={index}
                onHover={() => onMenuItemHover(index)}
              />
            ))}
          </LayoutGroup>
        </menu>

        <FlowingLight />
        {false && <MenuViewport onClose={onViewportClose} />}
      </nav>
    </MenubarContext>
  )
}
