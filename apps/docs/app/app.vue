<script setup lang="ts">
import type { AppTheme } from 'ebb-theme'
import { EbbThemeProvider } from 'ebb-theme'
import 'ebb-ui/main.css'
import { themeConfig } from './theme.config'

const theme = useCookie('theme')
const appTheme = (theme.value ?? themeConfig.defaultTheme ?? 'dark') as AppTheme

useHead({
  htmlAttrs: {
    lang: 'zh-CN',
    'data-theme': appTheme
  }
})
</script>

<template>
  <EbbThemeProvider :config="themeConfig" :theme="appTheme">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </EbbThemeProvider>
</template>
