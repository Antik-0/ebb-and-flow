<script setup lang='ts'>
import { Background, ThemeRoot } from '@repo/theme'
import { themeConfig } from './theme.config'
</script>

<template>
  <ThemeRoot :config="themeConfig" theme="dark">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <Background :pictures="['/wallhaven-rrwvdq.webp']" />
  </ThemeRoot>
</template>
