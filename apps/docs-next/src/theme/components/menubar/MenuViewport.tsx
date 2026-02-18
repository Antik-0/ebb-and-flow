import type { PropsWithChildren, RefObject } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import {
  memo,
  useEffect,
  useEffectEvent,
  useImperativeHandle,
  useMemo,
  useState
} from 'react'
import { stylex } from '#/utils'
import { useSharedMenus } from '../../controller/menus'
import {
  ViewportProvider,
  useMenubar,
  useViewport
} from '../../controller/navbar'
import { GlassMask } from '../GlassMask'
import { MenuViewGroup } from './MenuViewGroup'

export interface ViewportRef {
  open: () => void
  close: () => void
}

interface MenuViewportProps {
  ref: RefObject<ViewportRef>
  onClose: () => void
}

export function MenuViewport(props: MenuViewportProps) {
  const menus = useSharedMenus()
  const contents = useMemo(() => menus.map(item => item.items), [menus])

  const { onHoverIndexChange } = useMenubar()

  const [show, setShow] = useState(false)
  const [prevIndex, setPrevIndex] = useState(-1)
  const [currIndex, setCurrIndex] = useState(-1)

  const handleIndexChange = useEffectEvent((index: number) => {
    setPrevIndex(currIndex)
    setCurrIndex(index)
  })

  useEffect(() => {
    onHoverIndexChange(handleIndexChange)
  }, [])

  useImperativeHandle(
    props.ref,
    () => ({
      open: () => setShow(true),
      close: () => setShow(false)
    }),
    []
  )

  function onExitComplete() {
    !show && props.onClose()
  }

  const contextValue = { prevIndex, currIndex }

  return (
    <AnimatePresence onExitComplete={onExitComplete}>
      {show && (
        <motion.div
          animate={{ y: 0 }}
          className="pt-2 min-w-full contain-layout left-1/2 top-full absolute isolate -translate-x-1/2"
          data-role="viewport"
          exit={{ opacity: 0, y: 40 }}
          initial={{ y: 40 }}
          transition={{ type: 'spring', duration: 0.6 }}
        >
          <div className="relative isolate">
            <ViewportProvider value={contextValue}>
              <div className="rounded-4 relative overflow-hidden">
                {contents.map((content, index) => (
                  <MenuViewContent index={index} key={index}>
                    {content && <MenuViewGroupMemo items={content} />}
                  </MenuViewContent>
                ))}
              </div>
            </ViewportProvider>
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

  const { currIndex, prevIndex } = useViewport()

  const [show, setShow] = useState(false)
  const [active, setActive] = useState(false)
  const [motion, setMotion] = useState<Motion>(undefined)

  useEffect(() => {
    const isFromEnd = currIndex > prevIndex
    if (index === currIndex) {
      setMotion(isFromEnd ? 'from-end' : 'from-start')
    } else if (index === prevIndex) {
      setMotion(isFromEnd ? 'to-start' : 'to-end')
    }
    setShow(index === currIndex || index === prevIndex)
    setActive(index === currIndex)
  }, [currIndex, prevIndex])

  if (!children) return null

  function onAnimationEnd() {
    if (index === currIndex) {
      return
    }
    if (index === prevIndex) {
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
      style={stylex({ display: !show && 'none' })}
    >
      {children}
    </div>
  )
}
