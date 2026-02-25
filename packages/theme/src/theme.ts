import type { InjectionKey, SlotsType, VNodeChild } from 'vue'
import type { Empty, ThemeConfig } from './types'
import { useNuxtApp } from 'nuxt/app'
import { defineComponent, inject, provide } from 'vue'
import { usePageLoading } from './controller/layout'

// 类型推导
export function defineThemeConfig(config: ThemeConfig): ThemeConfig
export function defineThemeConfig(config: () => ThemeConfig): ThemeConfig
export function defineThemeConfig(config: ThemeConfig | (() => ThemeConfig)) {
  return typeof config === 'function' ? config() : config
}

function createEbbTheme() {
  const contextKey = Symbol() as InjectionKey<ThemeConfig>

  const provider = (value: ThemeConfig) => provide(contextKey, value)

  const useTheme = () => {
    const theme = inject(contextKey)!
    return { theme }
  }

  return [provider, useTheme] as const
}

const [provideTheme, useTheme] = createEbbTheme()

const EbbThemeProvider = defineComponent<
  { config: ThemeConfig },
  Empty,
  '',
  SlotsType<{ default: () => VNodeChild }>
>(
  (props, { slots }) => {
    const nuxtApp = useNuxtApp()
    const { isLoading } = usePageLoading()

    const loadingDelay = 200
    let loadingStart = 0
    let cancelLoading = false

    nuxtApp.hook('page:loading:start', () => {
      cancelLoading = false
      loadingStart = performance.now()

      setTimeout(() => {
        !cancelLoading && (isLoading.value = true)
      }, loadingDelay)
    })
    nuxtApp.hook('page:loading:end', () => {
      cancelLoading = true
      const duration = performance.now() - loadingStart

      // loading 至少存在 1s
      setTimeout(
        () => {
          isLoading.value = false
        },
        Math.max(0, 1000 - duration)
      )
    })

    provideTheme(props.config)

    return () => slots.default()
  },
  { name: 'EbbThemeProvider', props: ['config'] }
)

export { EbbThemeProvider, useTheme }
