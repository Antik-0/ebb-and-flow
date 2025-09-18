<script setup lang='ts'>
import { AnimatePresence, Motion } from 'motion-v'
import Avatar from './widgets/Avatar.vue'

interface Props {
  show?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  show: true
})
</script>

<template>
  <AnimatePresence>
    <Motion
      :animate="{ opacity: 1 }"
      :exit="{ opacity: 0 }"
      :initial="{ opacity: 0 }"
      :transition="{
        duration: 0.8
      }"
      as-child
    >
      <div v-show="props.show" class="flex-center flex inset-0 absolute z-20">
        <Avatar />
      </div>
    </Motion>
  </AnimatePresence>
</template>
