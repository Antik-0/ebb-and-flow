import { memo, useEffect } from 'react'
import { useLayout } from '../controller/layout'
import { useSidebarControl } from '../controller/sidebar'
import { useFPS } from '../hooks'
import { PanelLeftClose, PanelLeftOpen } from '../icons'
import { BackToTop } from './BackToTop'
import { GlassMask } from './GlassMask'
import { ScrollIndicator } from './ScrollIndicator'
import { SidebarTrigger } from './sidebar/SidebarTrigger'

interface Props {
  aside?: boolean
}

export function ToolPanel({ aside }: Props) {
  const isTriggerSentinel = useLayout(state => state.isTriggerSentinel)

  return (
    <div className="toolpanel" data-aside={aside} data-show={isTriggerSentinel}>
      <div className="rounded-5 flex flex-col gap-1">
        <SidebarButton />
        <Indicator />
        <FPS />
        <BackToTop />
      </div>
      <GlassMask className="rounded-5 inset-0 absolute -z-1" />
    </div>
  )
}

const SidebarButton = memo(() => {
  const isTriggerSentinel = useLayout(state => state.isTriggerSentinel)
  const { isOpen, close } = useSidebarControl()

  useEffect(() => {
    if (!isTriggerSentinel) {
      close()
    }
  }, [isTriggerSentinel])

  return (
    <SidebarTrigger className="tool-button">
      {isOpen ? <PanelLeftOpen /> : <PanelLeftClose />}
    </SidebarTrigger>
  )
})

const Indicator = memo(() => {
  return (
    <div className="text-6 text-teal flex size-10 flex-center">
      <ScrollIndicator />
    </div>
  )
})

const FPS = memo(() => {
  const fps = useFPS()
  return (
    <div className="text-teal flex-col size-10 items-center justify-between">
      <span className="text-3 leading-[1]">fps</span>
      <span className="text-14px leading-6">{fps}</span>
    </div>
  )
})
