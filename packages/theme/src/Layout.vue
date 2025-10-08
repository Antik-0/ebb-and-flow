<script setup lang='ts'>
import { onErrorCaptured, provide } from 'vue'
import { useTeleprots } from '#/controller/teleports.ts'
import { LayoutCtxKey, useLayout } from './controller/layout'
import LayoutDoc from './layout/LayoutDoc.vue'
import LayoutHome from './layout/LayoutHome.vue'
import LayoutPage from './layout/LayoutPage.vue'

useTeleprots()

const { layout, isMobile, isDesktop } = useLayout()

provide(LayoutCtxKey, {
  isMobile,
  isDesktop
})

onErrorCaptured((error, instance, info) => {
  console.log('组件出错了', { error, instance, info })
  return false
})
</script>

<template>
  <LayoutHome v-if="layout === 'home'" />
  <LayoutPage v-else-if="layout === 'page'" />
  <LayoutDoc v-else />
</template>
