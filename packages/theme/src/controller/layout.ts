import type { ComputedRef, InjectionKey } from 'vue'
import type { Page } from '#/types'
import { useMediaQuery } from '@repo/utils/hooks'
import { computed, inject, provide, ref } from 'vue'

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

const context = Symbol('layout') as InjectionKey<LayoutContext>

export function provideLayoutContext(value: LayoutContext) {
  provide(context, value)
}

export function useLayoutContext() {
  return inject(context)!
}

const page = ref<Page | null>(null)

const setPageData = (data: Page | null) => {
  page.value = data
}

export function usePageData() {
  return { page, setPageData }
}

const isLoading = ref(false)

export function usePageLoading() {
  return { isLoading }
}
