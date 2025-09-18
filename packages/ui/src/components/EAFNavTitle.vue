<script setup lang='ts'>
import { AnimatePresence, motion } from 'motion-v'

interface Props {
  show?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  show: false
})
</script>

<template>
  <AnimatePresence>
    <motion.div
      v-show="props.show"
      :animate="{ opacity: 1, x: 0 }"
      class="flex flex-col inset-0 justify-center absolute z-10"
      :exit="{ opacity: 0, x: 40 }"
      :initial="{ opacity: 0, x: 40 }"
      :transition="{
        type: 'spring',
        duration: 0.8
      }"
    >
      <span class="text-xs text-[--c-text-2] leading-snug">Vue 源码解析</span>
      <h2 class="text-lg truncate">
        Vue 响应式系统 - Reactive
      </h2>
    </motion.div>
  </AnimatePresence>
</template>
