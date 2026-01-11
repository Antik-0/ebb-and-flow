import { createContext, useContext } from 'react'
import { useMediaQuery } from '../hooks'

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

interface LayoutContext {
  isMobile: boolean
  isDesktop: boolean
  isLargeScreen: boolean
  isTriggerSentinel: boolean
}

export const LayoutContext = createContext({} as LayoutContext)

export function useLayout() {
  return useContext(LayoutContext)
}
