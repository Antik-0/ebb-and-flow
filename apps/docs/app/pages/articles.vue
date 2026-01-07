<script setup lang='ts'>
import { EllipsisVertical } from '@repo/theme/icons'
import { motion } from 'motion-v'

definePageMeta({ layout: 'page' })

useSeoMeta({ title: formatTitle('归档') })

const { data } = await useFetch('/api/articles')

const articles = computed(() => {
  if (!data.value) return []
  return [...Object.entries(data.value)]
})
</script>

<template>
  <div class="px-8">
    <div class="mx-auto max-w-200">
      <motion.h1
        :animate="{ opacity: [0, 1], y: [40, 0] }"
        class="mb-4 text-center"
        :transition="{ duration: 0.8 }"
      >
        <span class="text-2xl text-teal tracking-2 font-600">文章归档</span>
      </motion.h1>

      <div
        v-for="[year, items] in articles"
        :key="year"
        class="my-4"
      >
        <motion.h2
          :animate="{ opacity: [0, 1], x: [60, 0] }"
          class="py-2"
          :transition="{ duration: 0.8 }"
        >
          <span class="text-xl text-accent-foreground tracking-1">{{ year }}</span>
          <span class="text-sm text-muted-foreground ml-4">{{ items.length }}篇文章</span>
        </motion.h2>

        <ul class="py-2 flow-root">
          <motion.li
            v-for="(item, index) in items"
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
              <NuxtTime
                class="text-xs text-muted-foreground text-right w-12"
                :datetime="item.lastUpdated"
                day="2-digit"
                month="2-digit"
              />

              <EllipsisVertical class="text-zinc bottom-full left-14 absolute -ml-px" />
              <span class="mx-1 rounded-1 bg-zinc size-1.5 transition-height group-hover:(bg-brand-3 h-4)"></span>

              <span class="flex-1 truncate transition-transform group-hover:text-brand-3 group-hover:translate-x-2">
                {{ item.title }}
              </span>

              <span
                v-if="item.tags"
                class="inline-flex gap-3 items-center"
              >
                <span
                  v-for="(tag, index) in item.tags"
                  :key="index"
                  class="text-sm text-muted-foreground"
                >
                  #{{ tag }}
                </span>
              </span>
            </NuxtLink>
          </motion.li>
        </ul>
      </div>
    </div>
  </div>
</template>
