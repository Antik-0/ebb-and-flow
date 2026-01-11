'use client'
import type { PropsWithChildren } from 'react'
import { useMemo, useState } from 'react'
import { Navbar } from '../components/Navbar'
import { Sidebar } from '../components/sidebar/Sidebar'
import { LayoutContext, useLayoutState } from '../controller/layout'

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

        <div className="ebb-page" data-role="page">
          <main className="page-content">{children}</main>
        </div>
      </div>
    </LayoutContext>
  )
}
