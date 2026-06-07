<script setup lang="ts">
import { useAnimationWorker } from '#/hooks/animation'

definePageMeta({ layout: false })

useSeoMeta({
  title: formatTitle('归档'),
  description: '潮起潮落-归档'
})

const articles = await useFetch('/api/archive').then(
  res => res.data.value ?? []
)

useAnimationWorker(new URL('../workers/sakura.ts', import.meta.url))
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
