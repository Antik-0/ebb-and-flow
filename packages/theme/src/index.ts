import 'iconify-icon'

export type * from './types'
export { default as EbbHome } from './layouts/EbbHome.vue'
export { default as EbbPage } from './layouts/EbbPage.vue'
export { EbbThemeProvider, defineThemeConfig, useTheme } from './theme.ts'

// components

export { default as DocContent } from './components/doc/DocContent.vue'
