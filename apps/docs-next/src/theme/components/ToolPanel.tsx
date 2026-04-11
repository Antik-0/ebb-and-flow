import { clsx } from '@repo/utils'
import { memo, useEffect } from 'react'
import { useLayout } from '../controller/layout'
import { useSidebarControl } from '../controller/sidebar'
import { useAnimation, useFPS } from '../hooks'
import { PanelLeftClose, PanelLeftOpen, Rocket } from '../icons'
import { GlassMask, ScrollIndicator } from './Effect'
import { SidebarTrigger } from './sidebar/SidebarTrigger'

export function ToolPanel() {
  const isTriggerSentinel = useLayout(state => state.isTriggerSentinel)

  return (
    <div
      className={clsx(
        'fixed top-1/2 right-2 z-[--z-index-toolpanel] p-1',
        'translate-x-full opacity-0 transition-all duration-600 ease-out',
        'data-[show=true]:translate-x-0 data-[show=true]:opacity-100'
      )}
      data-role="toolpanel"
      data-show={isTriggerSentinel}
    >
      <div className="flex flex-col gap-1 rounded-5">
        <SidebarButton />
        <Indicator />
        <FPS />
        <BackToTop />
      </div>
      <GlassMask className="absolute inset-0 -z-1 rounded-5" />
    </div>
  )
}

const SidebarButton = memo(() => {
  const isMobile = useLayout(state => state.isMobile)
  const isTriggerSentinel = useLayout(state => state.isTriggerSentinel)
  const { isOpen, close } = useSidebarControl()

  useEffect(() => {
    if (!isTriggerSentinel) {
      close()
    }
  }, [isTriggerSentinel])

  if (!isMobile) {
    return null
  }

  return (
    <SidebarTrigger
      className={clsx(
        'flex size-10 flex-center cursor-pointer text-5 text-muted-foreground',
        'transition-color duration-200 hover:text-brand-2'
      )}
      title="侧边导航"
    >
      {isOpen ? <PanelLeftOpen /> : <PanelLeftClose />}
    </SidebarTrigger>
  )
})

const Indicator = memo(() => {
  return (
    <div className="flex size-10 flex-center text-6 text-teal">
      <ScrollIndicator />
    </div>
  )
})

const FPS = memo(() => {
  const fps = useFPS()
  return (
    <div className="size-10 flex-col items-center justify-between text-teal">
      <span className="text-3 leading-[1]">fps</span>
      <span className="text-14px leading-6">{fps}</span>
    </div>
  )
})

function BackToTop() {
  const [animation, scope] = useAnimation<HTMLButtonElement>(
    [{ transform: 'translateY(10px)' }, { transform: 'translateY(-100px)' }],
    {
      duration: 1000,
      easing: 'cubic-bezier(0.6, -0.28, 0.74, 0.05)'
    }
  )

  function backToTop() {
    animation.play()
    document.documentElement.scrollIntoView()
  }

  return (
    <button
      aria-label="back to top"
      className="flex size-10 flex-center cursor-pointer text-6 text-muted-foreground hover:text-brand-3"
      onClick={backToTop}
      ref={scope}
      title="回到顶部"
      type="button"
    >
      <Rocket />
    </button>
  )
}
