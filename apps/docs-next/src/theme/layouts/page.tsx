'use client'
import type { PropsWithChildren } from 'react'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { Navbar } from '../components/Navbar'
import { Sidebar } from '../components/sidebar/Sidebar'
import { LayoutContext, useLayoutState } from '../controller/layout'
import { updateActiveLink } from '../controller/menus'

export function EbbLayoutPage({ children }: PropsWithChildren) {
  const { isDesktop, isMobile, isLargeScreen } = useLayoutState()
  const [isTriggerSentinel] = useState(false)

  const layoutContext = useMemo(
    () => ({ isDesktop, isMobile, isLargeScreen, isTriggerSentinel }),
    [isDesktop, isMobile, isLargeScreen, isTriggerSentinel]
  )

  return (
    <LayoutContext value={layoutContext}>
      <div className="min-h-screen">
        <Navbar />
        <Sidebar />
        <MenusSync />

        <div className="ebb-page" data-role="page">
          <main className="page-content">{children}</main>
        </div>
      </div>
    </LayoutContext>
  )
}

/**
 * 更新全局菜单激活状态
 */
function MenusSync() {
  const pathname = usePathname()

  useEffect(() => {
    updateActiveLink(pathname)
  }, [pathname])

  return null
}
