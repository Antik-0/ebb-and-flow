import type { InjectionKey, ShallowRef } from 'vue'
import { useMediaQuery } from '@repo/utils/hooks'
import { useData } from 'vitepress'
import { computed, inject } from 'vue'

export function useLayout() {
  const { page } = useData()

  const layout = computed(() => page.value.frontmatter.layout ?? 'doc')

  const isDesktop = useMediaQuery('(width >= 1024px)')
  const isMobile = computed(() => !isDesktop.value)

  return {
    layout,
    isMobile,
    isDesktop
  }
}

interface LayoutContext {
  avatar: string
  isMobile: ShallowRef<boolean>
  isDesktop: ShallowRef<boolean>
}

export const LayoutCtxKey = Symbol('layout') as InjectionKey<LayoutContext>

export function useLayoutCtx() {
  return inject(LayoutCtxKey)!
}
