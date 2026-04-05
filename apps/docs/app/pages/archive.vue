<script setup lang='ts'>
import { useResizeObserver } from 'ebb-theme'
import { onBeforeUnmount, onMounted, useTemplateRef } from 'vue'

definePageMeta({ layout: false })

useSeoMeta({
  title: formatTitle('归档'),
  description: '潮起潮落-归档'
})

const articles = await useFetch('/api/archive').then(
  res => res.data.value?.data
)

const { onWindowResize } = useResizeObserver()
const canvas = useTemplateRef<HTMLCanvasElement>('animation')

let worker: Worker = null!
onMounted(async () => {
  worker = new Worker(new URL('../workers/sakura.ts', import.meta.url), {
    type: 'module'
  })

  const offscreenCanvas = canvas.value!.transferControlToOffscreen()
  offscreenCanvas.width = window.innerWidth
  offscreenCanvas.height = window.innerHeight

  async function loadImage(source: string) {
    const image = new Image(24)
    await new Promise(resolve => {
      image.src = source
      image.onload = () => resolve(true)
    })
    return window.createImageBitmap(image)
  }

  const sakuraImage = await loadImage('/sakura.png')

  worker.postMessage(
    {
      type: 'start',
      payload: { canvas: offscreenCanvas, sakuraImage }
    },
    [offscreenCanvas, sakuraImage]
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
  <div class="archive-page">
    <div class="chain top-[--offset]"></div>
    <div class="chain bottom-[--offset]" data-reverse="true"></div>
    <div class="cards-container">
      <ul class="cards">
        <li v-for="(item, index) in articles" :key="index">
          <NuxtLink class="card relative" :to="item.path">
            <CardCover :src="item.cover" />
            <div class="p-2 bg-black">
              <p class="leading-6 font-bold text-center truncate">
                {{ item.title }}
              </p>
            </div>
            <div class="p-2 bg-black/60 inset-x-0 bottom-10 absolute">
              <p class="text-xs flex gap-2 items-center">
                <span v-for="(tag, idx) in item.tags" :key="idx">
                  {{ '#' + tag }}
                </span>
                <span class="flex-1"></span>
                <NuxtTime
                  class="text-xs text-muted-foreground"
                  :datetime="item.lastUpdated"
                />
              </p>
            </div>
            <div class="card-mask inset-0 absolute z-10" data-role="mask"></div>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </div>
  <canvas ref="animation" class="size-screen pointer-events-none left-0 top-0 fixed z-1"></canvas>
</template>
