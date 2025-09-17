<script setup lang='ts'>
import EAFContent from './components/EAFContent.vue'
import EAFNav from './components/EAFNav.vue'
import EAFSidebar from './components/EAFSidebar.vue'
</script>

<template>
  <div class="flex-col min-h-[100vh]">
    <EAFNav />
    <EAFSidebar />
    <EAFContent />
  </div>
</template>
