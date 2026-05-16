import type { InjectionKey, ShallowRef, SlotsType, VNodeChild } from 'vue'
import type { AppTheme, Empty, ThemeConfig } from './types'
import { useNuxtApp } from 'nuxt/app'
import { defineComponent, inject, provide, shallowRef } from 'vue'
import { usePage } from './controller/layout'

export function defineThemeConfig(config: ThemeConfig): ThemeConfig
export function defineThemeConfig(config: () => ThemeConfig): ThemeConfig
export function defineThemeConfig(config: ThemeConfig | (() => ThemeConfig)) {
  return typeof config === 'function' ? config() : config
}

interface AppThemeCtx {
  theme: ShallowRef<AppTheme>
  toggleTheme: () => void
}

function createAppTheme() {
  const appThemeKey = Symbol() as InjectionKey<AppThemeCtx>
  const expiredDate = 1000 * 60 * 60 * 24 * 360

  function initTheme(value: AppTheme) {
    const theme = shallowRef(value)

    function toggleTheme() {
      const themeValue = theme.value === 'light' ? 'dark' : 'light'
      theme.value = themeValue
      document.documentElement.setAttribute('data-theme', themeValue)
      window.cookieStore.set({
        name: 'theme',
        value: themeValue,
        path: '/',
        sameSite: 'lax',
        expires: Date.now() + expiredDate
      })
    }

    provide(appThemeKey, { theme, toggleTheme })
  }

  function useTheme() {
    return inject(appThemeKey)!
  }

  return [initTheme, useTheme] as const
}

function createEbbTheme() {
  const ebbThemeKey = Symbol() as InjectionKey<ThemeConfig>

  const provider = (value: ThemeConfig) => provide(ebbThemeKey, value)

  const useTheme = () => inject(ebbThemeKey)!

  return [provider, useTheme] as const
}

const [initAppTheme, useAppTheme] = createAppTheme()
const [initEbbTheme, useEbbTheme] = createEbbTheme()

const EbbThemeProvider = defineComponent<
  { config: ThemeConfig; theme: AppTheme },
  Empty,
  '',
  SlotsType<{ default: () => VNodeChild }>
>(
  (props, { slots }) => {
    const nuxtApp = useNuxtApp()
    const { isLoading } = usePage()

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

    initAppTheme(props.theme)
    initEbbTheme(props.config)

    return () => slots.default()
  },
  { name: 'EbbThemeProvider', props: ['config', 'theme'] }
)

export { EbbThemeProvider, useAppTheme, useEbbTheme }
