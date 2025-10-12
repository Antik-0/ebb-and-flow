<script setup lang='ts'>
import { motion } from 'motion-v'
import { computed } from 'vue'

const props = defineProps<{
  text: string
}>()

const emit = defineEmits<{
  motionEnd: []
}>()

const textList = computed(() =>
  props.text.split('').map(s => (s === ' ' ? '\u00A0' : s))
)

let count = 0

function onComplete() {
  count += 1
  if (count === textList.value.length) {
    emit('motionEnd')
  }
}
</script>

<template>
  <span class="inline-flex">
    <motion.span
      v-for="(value, index) in textList"
      :key="index"
      :animate="{
        opacity: 1,
        y: 0
      }"
      :initial="{
        opacity: 0,
        y: 60
      }"
      :transition="{
        type: 'spring',
        duration: 1,
        delay: index * 0.05
      }"
      @animation-complete="onComplete"
    >
      {{ value }}
    </motion.span>
  </span>
</template>
