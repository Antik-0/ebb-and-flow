import type { PropsWithChildren } from 'react'
import { animate, motion, useMotionValue } from 'motion/react'
import { memo, useEffect, useRef } from 'react'
import { stylex } from '#/utils'
import { useSidebarControl, useSidebarMenus } from '../../controller/sidebar'
import { useEventListener, useResizeObserver } from '../../hooks'
import { GlassMask } from '../GlassMask'
import { SidebarGroup } from './SidebarGroup'

Sidebar.Overlay = SidebarOverlay
Sidebar.Container = SidebarContainer

export { Sidebar }

function Sidebar() {
  const { isOpen, close } = useSidebarControl()

  const x = useMotionValue('0')

  const { addEventListener } = useEventListener()
  const sidebar = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (isOpen) {
      animate(x, '0%', { type: 'spring', duration: 0.6 })
    } else {
      animate(x, '-100%', { ease: 'backIn', duration: 0.6 })
    }
  }, [isOpen])

  useEffect(() => {
    const element = sidebar.current
    addEventListener(element, 'click', event => {
      for (const path of event.composedPath()) {
        const node = path as HTMLElement
        if (node === document.body) break
        if (node.getAttribute('data-role') === 'route') {
          close()
          break
        }
      }
    })
  }, [])

  return (
    <motion.aside className="ebb-sidebar" data-role="sidebar" style={{ x }}>
      <div className="grid-full px-1 py-4 flex-col min-h-0" ref={sidebar}>
        <SidebarContent />
      </div>
      <SidebarMask />
    </motion.aside>
  )
}

function SidebarContainer({ children }: PropsWithChildren) {
  const container = useRef<HTMLDivElement>(null!)
  const { observe } = useResizeObserver()
  const { open, close } = useSidebarControl()

  useEffect(() => {
    observe(container, entry => {
      const boxSize = entry.borderBoxSize[0]!
      const inlineSize = boxSize.inlineSize
      if (inlineSize >= 320) {
        open()
      } else {
        close()
      }
    })
  }, [])

  return (
    <div className="sidebar-container" ref={container}>
      {children}
    </div>
  )
}

function SidebarOverlay() {
  const { isOpen, close } = useSidebarControl()

  return (
    <div
      aria-hidden="true"
      className="sidebar-overlay bg-black/20 inset-0 fixed"
      onClick={close}
      style={stylex({ display: !isOpen && 'none' })}
    ></div>
  )
}

function SidebarMask() {
  return (
    <div className="sidebar-mask w-100 inset-y-0 right-0 absolute -z-1">
      <GlassMask style={stylex({ '--fit-size': 'contain' })} />
    </div>
  )
}

const SidebarContent = memo(() => {
  const sidebarMenus = useSidebarMenus()

  return (
    <div
      className="px-3 flex-1 overflow-x-hidden overflow-y-auto"
      style={{
        scrollbarWidth: 'thin',
        scrollbarColor: 'var(--c-scrollbar) transparent'
      }}
    >
      {sidebarMenus.map((item, index) => (
        <SidebarGroup item={item} key={index} />
      ))}
    </div>
  )
})
