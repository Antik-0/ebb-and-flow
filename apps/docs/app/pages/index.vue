<script setup lang="ts">
import { EbbHome } from 'ebb-theme'
import { useAnimationWorker } from '#/hooks/animation'

definePageMeta({ layout: false })

useSeoMeta({
  title: '潮起潮落',
  description: '潮起潮落-主页'
})

useAnimationWorker(new URL('../workers/meteor.ts', import.meta.url))
</script>

<template>
  <EbbHome />
  <canvas
    ref="animation"
    class="size-screen pointer-events-none left-0 top-0 fixed z-1"
  ></canvas>
</template>
