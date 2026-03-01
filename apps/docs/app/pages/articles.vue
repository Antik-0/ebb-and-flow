<script setup lang='ts'>
import '../assets/article.css'
import { random } from '@repo/utils'

useSeoMeta({ title: formatTitle('归档') })

const { data } = await useFetch('/api/articles')

const articles = data.value
</script>

<template>
  <div class="article-page">
    <div id="container" class="cards-container">
      <ul class="cards">
        <li v-for="(item, index) in articles" :key="index">
          <NuxtLink class="card" :to="item.path">
            <img alt="img" :src="item.cover" />
            <div class="px-2 py-1 bg-black">
              <p class="text-cyan-50 leading-6 font-bold mb-2 text-center truncate">
                {{ item.title }}
              </p>
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
          </NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>
