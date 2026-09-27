import 'iconify-icon'

export type * from './types'
export { DocContent as EbbContent } from './components/doc/DocContent.tsx'
export * from './hooks/index.ts'
export { default as EbbHome } from './layouts/EbbHome.vue'
export { default as EbbPage } from './layouts/EbbPage.vue'
export { defineThemeConfig, EbbThemeProvider } from './theme.ts'
