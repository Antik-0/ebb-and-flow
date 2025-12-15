import 'iconify-icon'

// theme

export type * from './types'
export { defineThemeConfig, useTheme } from './theme.ts'
export { default as ThemeRoot } from './theme-root.vue'

// layout

export { default as LayoutHome } from './layout/home.vue'
export { default as LayoutPage } from './layout/page.vue'

// components

export { default as Background } from './components/Background.vue'
export { default as DocContent } from './components/doc/DocContent.vue'
