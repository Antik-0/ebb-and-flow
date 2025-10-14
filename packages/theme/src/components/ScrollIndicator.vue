<script setup lang='ts'>
import { useAnimation, useScroll } from '@repo/utils/hooks'
import { computed } from 'vue'

// 用 animation 不要用 useScroll

const { progress } = useScroll()

const pathLength = 2 * Math.PI * 12
const dashoffset = computed(() => {
  return pathLength * (1 - progress.value)
})
</script>

<template>
  <svg
    height="1em"
    :style="{
      rotate: '-90deg',
      transition: 'stroke-offset 600ms ease-in'
    }"
    viewBox="0 0 32 32"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="16"
      cy="16"
      fill="none"
      r="12"
      rotate="-90deg"
      stroke="currentColor"
      :stroke-dasharray="pathLength"
      :stroke-dashoffset="dashoffset"
      stroke-linecap="round"
      stroke-width="3"
    />
  </svg>
</template>
