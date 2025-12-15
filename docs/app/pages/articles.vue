<script setup lang='ts'>
import { EllipsisVertical } from '@repo/theme/icons'
import { motion } from 'motion-v'

definePageMeta({ layout: 'page' })

useSeoMeta({ title: '目录' })

const { data } = await useFetch('/api/articles')

const articles = computed(() => data.value?.articles ?? [])
const count = computed(() => data.value?.total)
</script>

<template>
  <div class="px-8">
    <div class="mx-auto max-w-200">
      <h1 class="mb-4">
        <span class="text-2xl text-neutral font-600">文章汇总</span>
        <span class="text-sm text-muted-foreground ml-8">{{ count }}篇文章</span>
      </h1>
      <ul class="flow-root">
        <motion.li
          v-for="(item, index) in articles"
          :key="index"
          :animate="{
            opacity: [0, 1],
            y: [40, -20, 0]
          }"
          class="group py-2"
          :custom="index"
          :transition="{ ease: 'easeInOut', duration: 1, delay: index * 0.1 }"
        >
          <NuxtLink class="text-brand-2/60 flex gap-2 items-center relative" :to="item.path">
            <EllipsisVertical class="text-zinc bottom-full absolute -ml-px" />
            <span class="mx-1 rounded-1 bg-zinc size-1.5 transition-height group-hover:(bg-brand-3 h-4)"></span>
            <span class="flex-1 truncate transition-transform group-hover:text-brand-3 group-hover:translate-x-2">
              {{ item.title }}
            </span>
            <NuxtTime
              class="text-sm text-muted-foreground"
              :datetime="item.lastUpdated"
            />
          </NuxtLink>
        </motion.li>
      </ul>
    </div>
  </div>
</template>
