import type { InjectionKey } from 'vue'
import type { ThemeConfig } from '#/types'
import { inject, provide, shallowRef } from 'vue'

export type { ThemeConfig }

const ThemeConfigKey = Symbol('theme') as InjectionKey<ThemeConfig>

export function provideThemeCofnig(value: ThemeConfig) {
  provide(ThemeConfigKey, value)
}

const isDark = shallowRef(true)

export function useTheme() {
  const theme = inject(ThemeConfigKey, {} as ThemeConfig)
  return { theme, isDark }
}

// 类型推导
export function defineThemeConfig(config: ThemeConfig): ThemeConfig
export function defineThemeConfig(config: () => ThemeConfig): ThemeConfig
export function defineThemeConfig(config: ThemeConfig | (() => ThemeConfig)) {
  return typeof config === 'function' ? config() : config
}
