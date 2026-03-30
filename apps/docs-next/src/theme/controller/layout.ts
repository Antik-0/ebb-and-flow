import type { Page } from '../types'
import { useMediaQuery } from '../hooks'
import { defineEbbStore } from '../store'

export function useLayoutState() {
  const isDesktop = useMediaQuery('(width >= 1024px)', { initialValue: true })
  const isMobile = !isDesktop
  return { isMobile, isDesktop }
}

interface LayoutState {
  isMobile: boolean
  isDesktop: boolean
  isTriggerSentinel: boolean
}

const [useLayout, layoutStore] = defineEbbStore<LayoutState>(() => {
  return {
    isMobile: false,
    isDesktop: true,
    isTriggerSentinel: false
  }
})

export { layoutStore, useLayout }

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
