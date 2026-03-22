import type { Fn, Page } from '../types'
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

export { layoutStore, useLayout }

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

export function lockScrollbar() {
  const root = document.documentElement
  root.setAttribute('data-locked', 'true')
}

export function unlockScrollbar() {
  const root = document.documentElement
  root.removeAttribute('data-locked')
}

export function setHtmlLayout(layout: 'home' | 'page' | null) {
  const root = document.documentElement
  root.setAttribute('data-layout', layout ?? '')
}

const [uesPage, pageStore] = defineEbbStore<Page>(() => {
  return { title: '', toc: [] }
})

export { pageStore, uesPage }

const pageMountedCbs = new Set<Fn>([])

export function onPageMounted(callback: Fn) {
  pageMountedCbs.add(callback)

  return () => {
    pageMountedCbs.delete(callback)
  }
}

export function triggerPageMounted() {
  for (const cb of pageMountedCbs) {
    cb()
  }
}
