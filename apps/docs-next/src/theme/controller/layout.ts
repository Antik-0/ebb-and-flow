import { useMediaQuery } from '../hooks'
import { defineEbbStore } from '../store'

interface LayoutState {
  isMobile: boolean
  isDesktop: boolean
  isLargeScreen: boolean
  isTriggerSentinel: boolean
}

const [useLayout, layoutStore] = defineEbbStore<LayoutState>(() => {
  return {
    isMobile: false,
    isDesktop: true,
    isLargeScreen: false,
    isTriggerSentinel: false
  }
})

export { useLayout, layoutStore }

export function useLayoutState() {
  const isDesktop = useMediaQuery('(width >= 1024px)', { initialValue: true })
  const isMobile = !isDesktop
  const isLargeScreen = useMediaQuery('(width >= 1536px)')

  return {
    isMobile,
    isDesktop,
    isLargeScreen
  }
}
