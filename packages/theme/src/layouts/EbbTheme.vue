<script setup lang='ts'>
import type { ThemeConfig } from '#/types'
import { useNuxtApp } from 'nuxt/app'
import { usePageLoading } from '#/controller/layout.ts'
import { provideThemeCofnig } from '#/theme'

const props = defineProps<{
  config: ThemeConfig
  theme?: 'light' | 'dark'
}>()

const nuxtApp = useNuxtApp()
const { isLoading } = usePageLoading()

let loadingDelay = 200
let loadingStart = 0
let cancelLoading = false

nuxtApp.hook('page:loading:start', () => {
  cancelLoading = false
  loadingStart = performance.now()

  setTimeout(() => {
    !cancelLoading && (isLoading.value = true)
  }, loadingDelay)
})
nuxtApp.hook('page:loading:end', () => {
  cancelLoading = true
  const duration = performance.now() - loadingStart

  // loading 至少存在 1s
  setTimeout(
    () => {
      isLoading.value = false
    },
    Math.max(0, 1000 - duration)
  )
})

provideThemeCofnig(props.config)
</script>

<template>
  <slot></slot>
</template>
