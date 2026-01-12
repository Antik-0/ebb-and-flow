import type { AnimationEvent } from 'react'
import type { MenuItem } from '../../types'
import { AnimatePresence, motion } from 'motion/react'
import { memo, useEffect, useMemo, useState } from 'react'
import { useSharedMenus } from '../../controller/menus'
import { useMenubarCtx } from '../../controller/navbar'
import { GlassMask } from '../GlassMask'
import { MenuViewGroup } from './MenuViewGroup'

interface Props {
  onClose: () => void
}

interface ContentItem {
  show: boolean
  motion?: 'from-start' | 'from-end' | 'to-start' | 'to-end'
  content?: MenuItem[]
}

export function MenuViewport(props: Props) {
  const { offsetX, showViewport, prevHoverIndex, currHoverIndex } =
    useMenubarCtx()

  const menus = useSharedMenus()
  const [contents, setContents] = useState<ContentItem[]>(() =>
    createViewContent(menus)
  )

  const showArrow = useMemo(
    () => contents[currHoverIndex]?.content,
    [currHoverIndex]
  )

  useEffect(() => {
    onHoverIndexChange(currHoverIndex, prevHoverIndex)
  }, [currHoverIndex, prevHoverIndex])

  function onHoverIndexChange(currIndex: number, prevIndex: number) {
    const currItem = contents[currIndex]
    const prevItem = contents[prevIndex]
    if (!currItem) return

    const isFromEnd = currIndex > prevIndex
    currItem.motion = isFromEnd ? 'from-end' : 'from-start'
    if (prevItem) {
      prevItem.motion = isFromEnd ? 'to-start' : 'to-end'
    }
    currItem.show = true
    setContents([...contents])
  }

  function onAnimationend(event: AnimationEvent) {
    const target = event.target as HTMLElement
    if (!target.classList.contains('menu-content')) {
      return
    }
    const motion = target.getAttribute('data-motion')!
    if (motion.startsWith('to')) {
      const index = Number(target.getAttribute('data-index'))
      contents[index]!.show = false
      setContents([...contents])
    }
  }

  function onExitComplete() {
    !showViewport && props.onClose()
  }

  return (
    <AnimatePresence onExitComplete={onExitComplete}>
      {showViewport && (
        <motion.div
          animate={{ y: 0 }}
          className="menu-viewport"
          exit={{ opacity: 0, y: 40 }}
          initial={{ y: 40 }}
          onPointerMove={event => event.stopPropagation()}
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
            <div
              className="rounded-4 relative overflow-hidden"
              onAnimationEnd={onAnimationend}
            >
              {contents.map((item, index) => (
                <MenuViewContent
                  content={item.content}
                  index={index}
                  isActive={currHoverIndex === index}
                  key={index}
                  motion={item.motion}
                  show={item.show}
                />
              ))}
            </div>
            <GlassMask className="rounded-4 inset-0 absolute -z-1" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface ViewContentProps {
  show: boolean
  index: number
  isActive: boolean
  motion: ContentItem['motion']
  content?: MenuItem[]
}

const MenuViewGroupMemo = memo(MenuViewGroup)

function MenuViewContent(props: ViewContentProps) {
  const { show, index, isActive, motion, content } = props
  if (!content) return null
  return (
    <div
      className="menu-content"
      data-active={isActive}
      data-index={index}
      data-motion={motion}
      style={{ display: show ? undefined : 'none' }}
    >
      <MenuViewGroupMemo items={content} />
    </div>
  )
}

function createViewContent(menus: MenuItem[]) {
  const res: ContentItem[] = []
  for (const item of menus) {
    res.push({
      show: false,
      motion: undefined,
      content: item.items
    })
  }
  return res
}
