import type { ComputedRef, InjectionKey, Ref } from 'vue'
import type { Page } from '#/types'
import { computed, inject, provide, ref } from 'vue'
import { useMediaQuery } from '#/hooks'

export function useLayoutState() {
  const isDesktop = useMediaQuery('(width >= 1024px)', { initialValue: true })
  const isMobile = computed(() => !isDesktop.value)
  const isTriggerSentinel = ref(false)

  return { isMobile, isDesktop, isTriggerSentinel }
}

interface LayoutContext {
  isMobile: ComputedRef<boolean>
  isDesktop: ComputedRef<boolean>
  isTriggerSentinel: Ref<boolean>
}

function createLayoutContext() {
  const contextKey = Symbol() as InjectionKey<LayoutContext>

  const provider = (value: LayoutContext) => provide(contextKey, value)

  const useContext = () => inject(contextKey)!

  return [provider, useContext] as const
}

export const [provideLayout, useLayout] = createLayoutContext()

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

// * ==================================================
// * ✨ page data
// * ==================================================

const page = ref<Page | null>(null)
const isLoading = ref(false)

export function usePage() {
  return { page, isLoading }
}

export function setPageData(data: Page | null) {
  page.value = data
}
