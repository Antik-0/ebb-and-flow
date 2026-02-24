<script setup lang='ts'>
const pathLength = Math.ceil(2 * Math.PI * 12)
</script>

<template>
  <svg
    height="1em"
    style="rotate: -90deg"
    viewBox="0 0 32 32"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      class="scroll-indicator"
      cx="16"
      cy="16"
      fill="none"
      r="12"
      stroke="currentColor"
      :stroke-dasharray="pathLength"
      stroke-linecap="round"
      stroke-width="3"
      :style="{
        '--value-from': pathLength,
        '--value-to': 0,
      }"
    />
  </svg>
</template>

<style>
.scroll-indicator {
  stroke-dashoffset: var(--m-value);
  animation: motion-value  linear forwards;
  animation-duration: auto;
  animation-timeline: scroll(block);
}
</style>
