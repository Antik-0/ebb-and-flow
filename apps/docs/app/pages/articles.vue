<script setup lang='ts'>
import '../assets/article.css'

useSeoMeta({ title: formatTitle('归档') })

const articles = await useFetch('/api/articles').then(
  res => res.data.value?.data
)
</script>

<template>
  <div class="article-page">
    <div class="chain top-[--offset]"></div>
    <div class="chain bottom-[--offset]" data-reverse="true"></div>
    <div class="cards-container">
      <ul class="cards">
        <li v-for="(item, index) in articles" :key="index">
          <NuxtLink class="card relative" :to="item.path">
            <picture class="overflow-hidden">
              <img alt="img" :src="item.cover" />
            </picture>
            <div class="p-2 bg-black">
              <p class="leading-6 font-bold mb-2 text-center truncate">
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
</template>
