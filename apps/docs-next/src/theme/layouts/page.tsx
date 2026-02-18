'use client'
import type { PropsWithChildren } from 'react'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ImageViewer } from '../components/ImageViewer'
import { Navbar } from '../components/Navbar'
import { Sidebar } from '../components/sidebar/Sidebar'
import { ToolPanel } from '../components/ToolPanel'
import { ViewportSentinel } from '../components/ViewportSentinel'
import { layoutStore, useLayoutState } from '../controller/layout'
import { updateActiveLink } from '../controller/menus'

export function EbbLayoutPage({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen" data-label="page">
      <LayoutWatcher />
      <MenusWatcher />

      <Navbar />
      {false && <Sidebar />}

      <div className="ebb-page" data-role="page">
        <main className="page-content">{children}</main>
      </div>
      {false && <ToolPanel />}

      {false && <ImageViewer />}
      <SentinelWatcher />
    </div>
  )
}

/**
 * ✨ 布局状态观察器
 */
function LayoutWatcher() {
  const { isDesktop, isMobile, isLargeScreen } = useLayoutState()

  useEffect(() => {
    layoutStore.setState({ isDesktop, isMobile, isLargeScreen })
  }, [isDesktop, isMobile, isLargeScreen])

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
