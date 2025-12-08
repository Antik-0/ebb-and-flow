import type { InjectionKey } from 'vue'
import type { ThemeConfig } from '#/types'
import { inject, provide, shallowRef } from 'vue'

const ThemeConfigKey = Symbol('theme') as InjectionKey<ThemeConfig>

export function provideThemeCofnig(value: ThemeConfig) {
  provide(ThemeConfigKey, value)
}

const isDark = shallowRef(true)

export function useTheme() {
  const theme = inject(ThemeConfigKey, {} as ThemeConfig)
  return { theme, isDark }
}
