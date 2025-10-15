import type { ComputedRef, InjectionKey } from 'vue'
import { useMediaQuery } from '@repo/utils/hooks'
import { useData } from 'vitepress'
import { computed, inject } from 'vue'

export function useLayout() {
  const { page } = useData()

  const layout = computed<'home' | 'doc'>(
    () => page.value.frontmatter.layout ?? 'doc'
  )

  const isDesktop = useMediaQuery('(width >= 1024px)')
  const isMobile = computed(() => !isDesktop.value)

  const isLargeScreen = useMediaQuery('(width >= 1536px)')

  return {
    layout,
    isMobile,
    isDesktop,
    isLargeScreen
  }
}

interface LayoutContext {
  avatar: string
  isMobile: ComputedRef<boolean>
  isDesktop: ComputedRef<boolean>
  isLargeScreen: ComputedRef<boolean>
  showToolPanel: ComputedRef<boolean>
}

export const LayoutCtx = Symbol('layout') as InjectionKey<LayoutContext>

export function useLayoutCtx() {
  return inject(LayoutCtx)!
}
