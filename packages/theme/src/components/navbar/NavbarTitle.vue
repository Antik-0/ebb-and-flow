<script setup lang='ts'>
import { AnimatePresence, motion } from 'motion-v'
import { computed } from 'vue'
import { useSharedMenus } from '#/controller/menus.ts'

interface Props {
  show?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  show: false
})

const { currActiveNode } = useSharedMenus()

const title = computed(() => currActiveNode.value?.text ?? '')

const path = computed(() => {
  let node = currActiveNode.value
  const paths: string[] = []
  while (node?.parent) {
    node = node.parent
    paths.push(node.text)
  }
  return paths.reverse().join('/')
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
      <span class="text-xs text-[--c-text-2] leading-snug">
        {{ path }}
      </span>
      <h2 class="text-lg truncate">
        {{ title }}
      </h2>
    </motion.div>
  </AnimatePresence>
</template>
