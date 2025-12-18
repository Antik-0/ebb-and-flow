<script setup lang='ts'>
import { Background, EbbTheme } from '@repo/theme'
import { themeConfig } from './theme.config'
</script>

<template>
  <EbbTheme :config="themeConfig" theme="dark">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <Background :pictures="['/wallhaven-rrwvdq.webp']" />
  </EbbTheme>
</template>
