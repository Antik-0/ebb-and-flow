<script setup lang='ts'>
import { useTeleprots } from '#/controller/teleports.ts'
import EAFContent from './components/EAFContent.vue'
import EAFNav from './components/EAFNav.vue'
import EAFSidebar from './components/EAFSidebar.vue'

useTeleprots()
</script>

<template>
  <div class="flex-col min-h-[100vh]">
    <EAFNav />
    <EAFSidebar />
    <EAFContent />
  </div>
</template>
