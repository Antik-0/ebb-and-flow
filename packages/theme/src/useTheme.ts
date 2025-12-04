import type { InjectionKey } from 'vue'
import type { ThemeConfig } from '#/types'
import { inject, provide, shallowRef } from 'vue'

type ThemeMode = 'light' | 'dark'

const ThemeConfigKey = Symbol('theme') as InjectionKey<ThemeConfig>

export function provideThemeCofnig(value: ThemeConfig) {
  provide(ThemeConfigKey, value)
}

export function useTheme() {
  const theme = inject(ThemeConfigKey, {} as ThemeConfig)
  return { theme, isDark }
}

const isDark = shallowRef(false)
const ThemeColorKey = 'app-color-scheme'

export function toggleThemeColor(mode?: ThemeMode) {
  if (mode) {
    isDark.value = mode === 'dark'
  } else {
    isDark.value = !isDark.value
  }
  window.localStorage.setItem(ThemeColorKey, mode ?? 'dark')
  return isDark.value
}
