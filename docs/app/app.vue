<script setup lang='ts'>
import { EbbTheme } from '@repo/theme'
import { themeConfig } from './theme.config'
</script>

<template>
  <EbbTheme :config="themeConfig" theme="dark">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </EbbTheme>
</template>
