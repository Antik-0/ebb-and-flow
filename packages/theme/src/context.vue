<script setup lang='ts'>
import type { ThemeConfig } from '#/types'
import { onMounted, watch } from 'vue'
import { provideThemeCofnig, toggleTheme } from './useTheme'

const props = defineProps<{
  value: ThemeConfig
  theme?: 'light' | 'dark'
}>()

provideThemeCofnig(props.value)

onMounted(() => {
  watch(
    () => props.theme,
    () => {
      const isDark = toggleTheme(props.theme)
      const root = document.documentElement
      if (isDark) {
        root.classList.add('dark')
        root.setAttribute('data-theme', 'dark')
      } else {
        root.classList.remove('dark')
        root.setAttribute('data-theme', 'light')
      }
    },
    { immediate: true }
  )
})
</script>

<template>
  <slot></slot>
</template>
