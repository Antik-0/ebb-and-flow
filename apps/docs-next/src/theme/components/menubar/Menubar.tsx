import type { RefObject } from 'react'
import { LayoutGroup, animate, motion, useMotionValue } from 'motion/react'
import { memo, useEffect, useMemo, useState } from 'react'
import { withVars } from '#/utils'
import { useMenuActiveNode, useSharedMenus } from '../../controller/menus'
import {
  MenubarContext,
  useMenubarHover,
  useMenubarMotion
} from '../../controller/navbar'
import { useEventListener } from '../../hooks'
import { FlowingLight } from '../FlowingLight'
import { MenubarItem } from './MenubarItem'
import { MenuViewport } from './MenuViewport'

const MenubarItemMemo = memo(MenubarItem)

export function Menubar() {
  const menus = useSharedMenus()
  const currActiveNode = useMenuActiveNode()
  const { scope, offsetX, motion, updateMotion } = useMenubarMotion()
  const [activeIndex, setActiveIndex] = useState(-1)

  useEffect(() => {
    if (currActiveNode) {
      const index = menus.indexOf(currActiveNode)
      setActiveIndex(index)
    }
  }, [])

  const [showViewport, setShowViewport] = useState(false)
  const [prevHoverIndex, setPrevHoverIndex] = useState(-1)
  const [currHoverIndex, setCurrHoverIndex] = useState(-1)

  useEffect(() => {
    updateMotion(currHoverIndex)
  }, [currHoverIndex])

  useEffect(() => {
    const prevActiveIndex = activeIndex

    let rootActiveNode = currActiveNode
    while (rootActiveNode?.parent) {
      rootActiveNode = rootActiveNode.parent
    }
    const index = menus.indexOf(rootActiveNode!)
    setActiveIndex(index)

    if (prevActiveIndex !== index) {
      if (index === currHoverIndex) {
        updateMotion(index)
      } else {
        setCurrHoverIndex(index)
      }
    }
  }, [currActiveNode])

  function onMouseenter() {
    setShowViewport(true)
  }

  function onMouseleave() {
    setShowViewport(false)
  }

  function onMenuItemHover(index: number) {
    setPrevHoverIndex(currHoverIndex)
    setCurrHoverIndex(index)
  }

  const contextValue = useMemo(
    () => ({
      offsetX,
      showViewport,
      prevHoverIndex,
      currHoverIndex
    }),
    [offsetX, showViewport, prevHoverIndex, currHoverIndex]
  )

  function onViewportClose() {
    setCurrHoverIndex(activeIndex)
  }

  return (
    <MenubarContext value={contextValue}>
      <nav
        className="menubar"
        onPointerEnter={onMouseenter}
        onPointerLeave={onMouseleave}
        ref={scope}
      >
        <MenubarBackground scope={scope} />

        <MenubarIndicator motion={motion} />

        <menu className="grid-full px-4 flex" data-role="menu">
          <LayoutGroup>
            {menus.map((item, index) => (
              <MenubarItemMemo
                item={item}
                key={item.id}
                onHover={() => onMenuItemHover(index)}
              />
            ))}
          </LayoutGroup>
        </menu>

        <FlowingLight />
        <MenuViewport onClose={onViewportClose} />
      </nav>
    </MenubarContext>
  )
}

interface BackgroundProps {
  scope: RefObject<HTMLElement | null>
}

function MenubarBackground(props: BackgroundProps) {
  const { offsetX, onMousemove } = useMenubarHover()
  const { addEventListener } = useEventListener()

  useEffect(() => {
    const target = props.scope.current
    if (!target) return
    addEventListener(target, 'pointermove', onMousemove)
  }, [])

  return (
    <div
      aria-hidden="true"
      className="menubar-background"
      style={withVars({ '--offset-x': offsetX + 'px' })}
    ></div>
  )
}

interface IndicatorProps {
  motion: {
    offsetX: number
    width: number
  }
}

function MenubarIndicator(props: IndicatorProps) {
  const { offsetX, width } = props.motion

  const motionX = useMotionValue(0)
  const motionW = useMotionValue(0)

  useEffect(() => {
    animate(motionX, offsetX, { type: 'spring', duration: 0.6 })
  }, [offsetX])

  useEffect(() => {
    animate(motionW, width, { type: 'spring', duration: 0.6 })
  }, [width])

  return (
    <motion.div
      className="menubar-indicator absolute -z-1"
      data-show="true"
      style={{ x: motionX, width: motionW }}
    />
  )
}
