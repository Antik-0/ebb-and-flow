<script setup lang="ts">
import { motion } from 'motion-v'

const isOpen = defineModel<boolean>()
</script>

<template>
  <motion.button
    :animate="isOpen ? 'open' : 'closed'"
    aria-label="hamburger-button"
    class="text-6 px-3 cursor-pointer"
    initial="closed"
    type="button"
    :while-hover="isOpen ? 'open' : 'hover'"
    @click="isOpen = !isOpen"
  >
    <svg
      height="1em"
      style="pointer-events: none"
      viewBox="0 0 24 24"
      width="1em"
    >
      <g
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
      >
        <motion.path
          :variants="{
            closed: { d: 'M 20 5 L 4 5' },
            open: { d: 'M 20 5 L 4 19' },
            hover: { d: 'M 20 5 L 8 5' },
          }"
        />
        <motion.path
          :variants="{
            closed: { d: 'M 20 12 L 12 12', opacity: 1 },
            open: { opacity: 0 },
            hover: { d: 'M 20 12 L 4 12' },
          }"
        />
        <motion.path
          :variants="{
            closed: { d: 'M 20 19 L 8 19' },
            open: { d: 'M 20 19 L 4 5' },
            hover: { d: 'M 20 19 L 12 19' },
          }"
        />
      </g>
    </svg>
  </motion.button>
</template>
