import type { ComputedRef, InjectionKey } from 'vue'
import { useMediaQuery } from '@repo/utils/hooks'
import { computed, inject, provide } from 'vue'

export function useLayout() {
  const isDesktop = useMediaQuery('(width >= 1024px)')
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
  showToolPanel: ComputedRef<boolean>
}

const LayoutCtx = Symbol('layout') as InjectionKey<LayoutContext>

export function provideLayoutCtx(value: LayoutContext) {
  provide(LayoutCtx, value)
}

export function useLayoutCtx() {
  return inject(LayoutCtx)!
}
