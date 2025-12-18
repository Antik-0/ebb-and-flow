<script setup lang='ts'>
import type { ThemeConfig } from '#/types'
import { provideThemeCofnig } from '#/theme'

const props = defineProps<{
  config: ThemeConfig
  theme?: 'light' | 'dark'
}>()

provideThemeCofnig(props.config)
</script>

<template>
  <slot></slot>
</template>
