import type { ThemeConfig } from './types'
import { createContext, useContext } from 'react'

export const ThemeContext = createContext<ThemeConfig>({} as ThemeConfig)

const isDark = false

export function useTheme() {
  const theme = useContext(ThemeContext)
  return { theme, isDark }
}

// 类型推导
export function defineThemeConfig(config: ThemeConfig): ThemeConfig
export function defineThemeConfig(config: () => ThemeConfig): ThemeConfig
export function defineThemeConfig(config: ThemeConfig | (() => ThemeConfig)) {
  return typeof config === 'function' ? config() : config
}
