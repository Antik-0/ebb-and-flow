<script setup lang="ts">
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

  onWindowResize(() => {
    const width = window.innerWidth
    const height = window.innerHeight
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
  <div class="archive-page" data-page="archive">
    <div class="cards-container">
      <ul class="cards">
        <li v-for="(item, index) in articles" :key="index" class="card-item">
          <NuxtLink class="block lg:transform-3d" :to="item.path">
            <article class="card relative">
              <figure class="card-content">
                <CardCover :src="item.cover" />
                <figcaption class="card-summary">
                  <p
                    class="text-8 leading-12 font-bold text-center text-brand truncate tracking-px lg:text-4 lg:leading-8"
                  >
                    {{ item.title }}
                  </p>
                  <p
                    class="p-4 text-base flex gap-2 items-center text-brand-2 lg:text-sm lg:p-2"
                  >
                    <span v-for="(tag, idx) in item.tags" :key="idx">
                      {{ '#' + tag }}
                    </span>
                    <span class="flex-1"></span>
                    <NuxtTime
                      class="text-base text-muted-foreground lg:text-sm"
                      :datetime="item.lastUpdated"
                    />
                  </p>
                </figcaption>
              </figure>
              <div class="card-mask"></div>
            </article>
          </NuxtLink>
        </li>
      </ul>
    </div>
    <div class="chain" data-pos="bs" aria-hidden="true"></div>
    <div class="chain" data-pos="be" aria-hidden="true"></div>
    <div class="shadow-mask" data-pos="is" aria-hidden="true"></div>
    <div class="shadow-mask" data-pos="ie" aria-hidden="true"></div>
    <div class="indicator" aria-hidden="true"></div>
  </div>
  <canvas
    ref="animation"
    class="size-screen pointer-events-none left-0 top-0 fixed z-1"
  ></canvas>
</template>
