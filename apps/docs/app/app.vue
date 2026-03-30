<script setup lang='ts'>
import { EbbThemeProvider } from 'ebb-theme'
import { themeConfig } from './theme.config'
import 'ebb-ui/main.css'
</script>

<template>
  <EbbThemeProvider :config="themeConfig">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </EbbThemeProvider>
</template>
