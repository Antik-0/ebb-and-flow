import type { ThemeConfig } from './types'
import { useContext } from 'react'
import { ThemeContext } from './layouts/theme'

const isDark = false

export function useTheme() {
  const theme = useContext(ThemeContext)
  return { theme, isDark }
}

export function defineThemeConfig(config: ThemeConfig): ThemeConfig
export function defineThemeConfig(config: () => ThemeConfig): ThemeConfig
export function defineThemeConfig(
  config: ThemeConfig | (() => ThemeConfig)
): ThemeConfig {
  return typeof config === 'function' ? config() : config
}
