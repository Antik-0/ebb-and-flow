import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import customTheme from './Layout.vue'

import 'virtual:uno.css'
import './styles/index.css'

export default {
  extends: DefaultTheme,
  Layout: customTheme
} satisfies Theme
