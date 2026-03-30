'use client'
import type { PropsWithChildren } from 'react'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ImageViewer } from '../components/ImageViewer'
import { Navbar } from '../components/Navbar'
import { Sidebar } from '../components/sidebar/Sidebar'
import { ToolPanel } from '../components/ToolPanel'
import { ViewportSentinel } from '../components/ViewportSentinel'
import {
  layoutStore,
  setHtmlLayout,
  useLayoutState
} from '../controller/layout'
import { updateActiveLink } from '../controller/menus'

export function EbbPage({ children }: PropsWithChildren) {
  return (
    <div className="ebb-page" data-label="page">
      <Navbar />

      <main className="grid-area-[main] min-w-0 md:p-4" data-role="main">
        <section className="p-6 bg-[--c-bg-content] min-w-0 w-full relative md:rounded-4">
          {children}
        </section>
      </main>

      <Sidebar.Container>
        <Sidebar />
        <Sidebar.Overlay />
      </Sidebar.Container>

      <div className="aside-container" data-role="aside">
        <ToolPanel />
        <ImageViewer />
      </div>

      <LayoutWatcher />
      <MenusWatcher />
      <SentinelWatcher />
    </div>
  )
}

/**
 * ✨ 布局状态观察器
 */
function LayoutWatcher() {
  const { isDesktop, isMobile } = useLayoutState()

  useEffect(() => {
    layoutStore.setState({ isDesktop, isMobile })
  }, [isDesktop, isMobile])

  useEffect(() => setHtmlLayout('page'), [])

  return null
}

/**
 * ✨ 菜单激活状态观察器
 */
function MenusWatcher() {
  const pathname = usePathname()

  useEffect(() => {
    updateActiveLink(pathname)
  }, [pathname])

  return null
}

/**
 * ✨ 滚动哨兵状态观察器
 */
function SentinelWatcher() {
  const [isTriggerSentinel, setIsTriggerSentinel] = useState(false)

  useEffect(() => {
    layoutStore.setState({ isTriggerSentinel })
  }, [isTriggerSentinel])

  function onVisibleChange(visible: boolean) {
    setIsTriggerSentinel(!visible)
  }

  return <ViewportSentinel onVisibleChange={onVisibleChange} top={200} />
}
