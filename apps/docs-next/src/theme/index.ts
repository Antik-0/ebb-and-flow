import type { ThemeConfig } from './types'

export type * from './types'
export { DocContent as EbbDocContent } from './components/doc/DocContent'
export { EbbNotFound } from './components/NotFound'
export { EbbLayoutHome } from './layouts/home'
export { EbbLayoutPage } from './layouts/page'
export { EbbThemeProvider, useTheme } from './theme'

export function defineThemeConfig(config: ThemeConfig): ThemeConfig
export function defineThemeConfig(config: () => ThemeConfig): ThemeConfig
export function defineThemeConfig(
  config: ThemeConfig | (() => ThemeConfig)
): ThemeConfig {
  return typeof config === 'function' ? config() : config
}
