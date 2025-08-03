import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'

import 'virtual:uno.css'
import './styles/main.css'
import './styles/reset.css'

export default {
  extends: DefaultTheme,
  Layout
} satisfies Theme
