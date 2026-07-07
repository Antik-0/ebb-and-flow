import 'iconify-icon'

export type * from './types'

export * from './hooks/index.ts'
export { defineThemeConfig, EbbThemeProvider } from './theme.ts'

export { DocContent as EbbContent } from './components/doc/DocContent.tsx'
export { default as EbbHome } from './layouts/EbbHome.vue'
export { default as EbbPage } from './layouts/EbbPage.vue'
