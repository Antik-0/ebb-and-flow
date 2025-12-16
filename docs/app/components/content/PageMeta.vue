<script setup lang='ts'>
const props = defineProps<{
  tags?: string[]
  readingTime?: number
  lastUpdated?: number
}>()
</script>

<template>
  <div class="my-4">
    <div v-if="tags" class="mx-auto flex gap-2 w-[max-content] items-center">
      <span class="text-sm mr-1">🏷️</span>
      <span
        v-for="(tag, index) in tags"
        :key="index"
        class="text-sm text-brand"
      >
        #{{ tag }}
      </span>
      <span class="text-sm ml-1">🏷️</span>
    </div>
    <div class="mx-auto py-2 flex gap-8 w-[max-content] items-center">
      <span class="text-xs text-accent-foreground">
        <span class="mr-1">🕝</span>
        <span>预计阅读时间 {{ readingTime }} 分钟</span>
      </span>
      <span v-if="lastUpdated" class="text-xs text-accent-foreground">
        <span class="mr-1">最后更新于</span>
        <NuxtTime :datetime="lastUpdated" />
      </span>
    </div>
  </div>
</template>
