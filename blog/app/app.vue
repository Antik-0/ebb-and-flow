<script setup lang='ts'>
import { Background, ThemeProvider } from '@repo/theme'
import { themeCofig } from './theme.config'
</script>

<template>
  <ThemeProvider theme="dark" :value="themeCofig">
    <NuxtLayout />
  </ThemeProvider>
  <Background :backgrounds="['/wallhaven-rrwvdq.webp']" />
</template>
