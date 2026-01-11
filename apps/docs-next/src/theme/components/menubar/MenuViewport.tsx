import type { AnimationEvent } from 'react'
import type { ContentView } from '../../controller/navbar'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useMemo, useState } from 'react'
import { ContentRender, useMenubarCtx } from '../../controller/navbar'
import { GlassMask } from '../GlassMask'

interface Props {
  onClose: () => void
}

interface ContentItem extends ContentView {
  show: boolean
  motion?: 'from-start' | 'from-end' | 'to-start' | 'to-end'
}

export function MenuViewport(props: Props) {
  const {
    offsetX,
    showViewport,
    contentViews,
    prevHoverIndex,
    currHoverIndex
  } = useMenubarCtx()

  const [contents] = useState<ContentItem[]>(() =>
    contentViews.current.map(content => ({
      show: false,
      motion: undefined,
      ...content
    }))
  )

  const showArrow = useMemo(
    () => contents[currHoverIndex]?.item?.items?.length,
    [currHoverIndex]
  )

  useEffect(() => {
    onHoverIndexChange(currHoverIndex, prevHoverIndex)
  }, [currHoverIndex])

  function onHoverIndexChange(currIndex: number, prevIndex: number) {
    const currItem = contents[currIndex]!
    const prevItem = contents[prevIndex]

    const isFromEnd = currIndex > prevIndex
    currItem.motion = isFromEnd ? 'from-end' : 'from-start'
    if (prevItem) {
      prevItem.motion = isFromEnd ? 'to-start' : 'to-end'
    }
    currItem.show = true
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
                <ContentRender
                  className="menu-content"
                  data-active={currHoverIndex === index}
                  data-index={index}
                  data-motion={item.motion}
                  key={index}
                  render={item.render}
                  style={{ display: item.show ? undefined : 'none' }}
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
