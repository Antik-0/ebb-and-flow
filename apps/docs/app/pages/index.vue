<script setup lang='ts'>
import { EbbHome, useResizeObserver } from 'ebb-theme'
import { onBeforeUnmount, onMounted, useTemplateRef } from 'vue'

definePageMeta({ layout: false })

useSeoMeta({
  title: '潮起潮落',
  description: '潮起潮落-主页'
})

const { onWindowResize } = useResizeObserver()
const canvas = useTemplateRef<HTMLCanvasElement>('animation')

let worker: Worker = null!
onMounted(() => {
  worker = new Worker(new URL('../workers/meteor.ts', import.meta.url), {
    type: 'module'
  })

  const offscreenCanvas = canvas.value!.transferControlToOffscreen()
  offscreenCanvas.width = window.innerWidth
  offscreenCanvas.height = window.innerHeight

  worker.postMessage(
    {
      type: 'start',
      payload: { canvas: offscreenCanvas }
    },
    [offscreenCanvas]
  )

  onWindowResize(entry => {
    const { width, height } = entry.contentRect
    worker.postMessage({
      type: 'update',
      payload: { width, height }
    })
  })
})

onBeforeUnmount(() => {
  worker.postMessage({ type: 'stop' })
  worker.terminate()
})
</script>

<template>
  <EbbHome />
  <canvas ref="animation" class="size-screen pointer-events-none left-0 top-0 fixed z-1"></canvas>
</template>
