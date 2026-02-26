import type { ComputedRef, InjectionKey } from 'vue'
import type { Fn, Page } from '#/types'
import { computed, inject, provide, ref } from 'vue'
import { useMediaQuery } from '#/hooks'

export function useLayout() {
  const isDesktop = useMediaQuery('(width >= 1024px)', { initialValue: true })
  const isMobile = computed(() => !isDesktop.value)
  const isLargeScreen = useMediaQuery('(width >= 1536px)')

  return {
    isMobile,
    isDesktop,
    isLargeScreen
  }
}

interface LayoutContext {
  isMobile: ComputedRef<boolean>
  isDesktop: ComputedRef<boolean>
  isLargeScreen: ComputedRef<boolean>
  isTriggerSentinel: ComputedRef<boolean>
}

function createLayoutCtx() {
  const contextKey = Symbol() as InjectionKey<LayoutContext>

  const provider = (value: LayoutContext) => provide(contextKey, value)

  const useContext = () => inject(contextKey)!

  return [provider, useContext] as const
}

export const [provideLayoutCtx, useLayoutCtx] = createLayoutCtx()

export function lockScrollbar() {
  const root = document.documentElement
  root.setAttribute('data-locked', 'true')
}

export function unlockScrollbar() {
  const root = document.documentElement
  root.removeAttribute('data-locked')
}

const page = ref<Page | null>(null)

function setPageData(data: Page | null) {
  page.value = data
}

export function usePageData() {
  return { page, setPageData }
}

const isLoading = ref(false)

export function usePageLoading() {
  return { isLoading }
}

let pageMountedCbs: Fn[] = []

export function onPageMounted(callback: Fn) {
  pageMountedCbs.push(callback)
  return () => (pageMountedCbs = pageMountedCbs.filter(f => f !== callback))
}

export function triggerPageMounted() {
  for (const cb of pageMountedCbs) {
    cb()
  }
}
