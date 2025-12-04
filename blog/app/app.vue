<script setup lang='ts'>
import { Background, ThemeProvider } from '@repo/theme'
import { themeConfig } from './theme.config'
</script>

<template>
  <ThemeProvider theme="dark" :value="themeConfig">
    <NuxtPage />
  </ThemeProvider>
  <Background :backgrounds="['/wallhaven-rrwvdq.webp']" />
</template>
