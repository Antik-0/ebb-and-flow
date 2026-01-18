import { animate, motion, useMotionValue } from 'motion/react'
import { memo, useEffect, useRef, useState } from 'react'
import { stylex } from '#/utils'
import { useSidebarControl, useSidebarMenus } from '../../controller/sidebar'
import { useEventListener } from '../../hooks'
import { GlassMask } from '../GlassMask'
import { SidebarGroup } from './SidebarGroup'

export function Sidebar() {
  const { isOpen, close } = useSidebarControl()

  const [show, setShow] = useState(isOpen)
  const x = useMotionValue('-100%')

  const { addEventListener } = useEventListener()
  const sidebar = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (isOpen) {
      setShow(true)
      animate(x, '0%', { type: 'spring', duration: 0.6 })
    } else {
      animate(x, '-100%', {
        ease: 'backIn',
        duration: 0.6,
        onComplete() {
          setShow(false)
        }
      })
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
    <div
      className="inset-0 fixed z-[--z-index-sidebar]"
      data-role="sidebar"
      style={stylex({ display: !show && 'none' })}
    >
      <motion.aside
        className="flex-col w-80 inset-y-0 left-0 absolute z-20 isolate"
        ref={sidebar}
        style={{ x }}
      >
        <SidebarContent />
        <SidebarMask />
      </motion.aside>
      <div className="bg-black/20 inset-0 absolute z-10" onClick={close}></div>
    </div>
  )
}

const SidebarContent = memo(() => {
  const sidebarMenus = useSidebarMenus()
  return (
    <div className="px-6 py-8 flex-1 overflow-x-hidden overflow-y-auto">
      {sidebarMenus.map((item, index) => (
        <SidebarGroup item={item} key={index} />
      ))}
    </div>
  )
})

const SidebarMask = memo(() => {
  return (
    <div className="sidebar-background w-100 inset-y-0 right-0 absolute -z-1">
      <GlassMask style={stylex({ '--fit-size': 'contain' })} />
    </div>
  )
})
