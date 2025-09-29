<script setup lang='ts'>
import { onErrorCaptured, watch } from 'vue'
import { useTeleprots } from '#/controller/teleports.ts'
import { useLayout } from './controller/layout'
import LayoutDoc from './layout/LayoutDoc.vue'
import LayoutHome from './layout/LayoutHome.vue'
import LayoutPage from './layout/LayoutPage.vue'

useTeleprots()

onErrorCaptured((error, instance, info) => {
  console.log('组件出错了', { error, instance, info })
  return false
})

const { layout } = useLayout()

watch(layout, () => {
  console.log(layout.value)
})
</script>

<template>
  <div class="flex-col min-h-[100vh]">
    <LayoutHome v-if="layout === 'home'" />
    <LayoutDoc v-else-if="layout === 'doc'" />
    <LayoutPage v-else />
  </div>
</template>
