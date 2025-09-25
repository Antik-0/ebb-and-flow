<script setup lang='ts'>
import { onErrorCaptured } from 'vue'
import { useTeleprots } from '#/controller/teleports.ts'
import EAFContent from './components/EAFContent.vue'
import EAFNav from './components/EAFNav.vue'
import EAFSidebar from './components/EAFSidebar.vue'

onErrorCaptured((error, instance, info) => {
  console.log('组件出错了', { error, instance, info })
  return false
})
useTeleprots()
</script>

<template>
  <div class="flex-col min-h-[100vh]">
    <EAFNav />
    <EAFSidebar />
    <EAFContent />
  </div>
</template>
