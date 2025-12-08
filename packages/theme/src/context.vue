<script setup lang='ts'>
import type { ThemeConfig } from '#/types'
import { provideThemeCofnig } from './useTheme'

const props = defineProps<{
  value: ThemeConfig
  theme?: 'light' | 'dark'
}>()

provideThemeCofnig(props.value)
</script>

<template>
  <slot></slot>
</template>
