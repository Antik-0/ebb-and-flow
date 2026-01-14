import type { PropsWithChildren } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { memo, useEffect, useMemo, useState } from 'react'
import { useSharedMenus } from '../../controller/menus'
import { useMenubarCtx } from '../../controller/navbar'
import { GlassMask } from '../GlassMask'
import { MenuViewGroup } from './MenuViewGroup'

interface MenuViewportProps {
  onClose: () => void
}

export function MenuViewport(props: MenuViewportProps) {
  const { offsetX, showViewport, currHoverIndex } = useMenubarCtx()

  const menus = useSharedMenus()
  const contents = useMemo(() => menus.map(item => item.items), [menus])
  const showArrow = !!contents[currHoverIndex]

  function onExitComplete() {
    !showViewport && props.onClose()
  }

  return (
    <AnimatePresence onExitComplete={onExitComplete}>
      {showViewport && (
        <motion.div
          animate={{ y: 0 }}
          className="menu-viewport"
          data-role="menuviewport"
          exit={{ opacity: 0, y: 40 }}
          initial={{ y: 40 }}
          transition={{ type: 'spring', duration: 0.6 }}
        >
          <div className="flex w-full justify-center">
            <div
              className="menu-viewport__arrow"
              style={{
                display: showArrow ? undefined : 'none',
                translate: `${offsetX}px 50%`
              }}
            ></div>
          </div>
          <div className="relative isolate">
            <div className="rounded-4 relative overflow-hidden">
              {contents.map((content, index) => (
                <MenuViewContent index={index} key={index}>
                  {content && <MenuViewGroupMemo items={content} />}
                </MenuViewContent>
              ))}
            </div>
            <GlassMask className="rounded-4 inset-0 absolute -z-1" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const MenuViewGroupMemo = memo(MenuViewGroup)

type Motion = 'from-start' | 'from-end' | 'to-start' | 'to-end' | undefined

function MenuViewContent(props: PropsWithChildren<{ index: number }>) {
  const { index, children } = props

  const { currHoverIndex, prevHoverIndex } = useMenubarCtx()

  const [show, setShow] = useState(false)
  const [active, setActive] = useState(false)
  const [motion, setMotion] = useState<Motion>(undefined)

  useEffect(() => {
    const isFromEnd = currHoverIndex > prevHoverIndex
    if (index === currHoverIndex) {
      setMotion(isFromEnd ? 'from-end' : 'from-start')
    } else if (index === prevHoverIndex) {
      setMotion(isFromEnd ? 'to-start' : 'to-end')
    }
    setShow(index === currHoverIndex || index === prevHoverIndex)
    setActive(index === currHoverIndex)
  }, [currHoverIndex, prevHoverIndex])

  if (!children) return null

  function onAnimationEnd() {
    if (index === prevHoverIndex) {
      setShow(false)
    }
  }

  return (
    <div
      className="menu-content"
      data-active={active}
      data-index={index}
      data-motion={motion}
      onAnimationEnd={onAnimationEnd}
      style={{ display: show ? undefined : 'none' }}
    >
      {children}
    </div>
  )
}
