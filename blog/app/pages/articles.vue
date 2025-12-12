<script setup lang='ts'>
import { motion } from 'motion-v'

definePageMeta({
  layout: 'page'
})

useSeoMeta({ title: '目录' })

const { data } = await useFetch('/api/articles')

const articles = computed(() => data.value?.articles ?? [])
</script>

<template>
  <div class="px-8">
    <div class="mx-auto max-w-200">
      <h1 class="text-2xl text-brand-1 mb-4">文章汇总</h1>
      <ul class="flow-root">
        <motion.li
          v-for="(item, index) in articles"
          :key="index"
          :animate="{
            opacity: [0, 1],
            y: [40, -20, 0]
          }"
          class="my-4"
          :custom="index"
          :transition="{ ease: 'easeInOut', duration: 1, delay: index * 0.1 }"
        >
          <NuxtLink class="flex items-center" :to="item.path">
            <span class="text-brand-2 flex-1 hover:text-brand-3">{{ item.title }}</span>
            <span class="text-sm text-muted-foreground">{{ item.lastUpdated }}</span>
          </NuxtLink>
        </motion.li>
      </ul>
    </div>
  </div>
</template>
