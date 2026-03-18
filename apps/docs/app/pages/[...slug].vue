<script setup lang='ts'>
import { EbbContent } from 'ebb-theme'
import { ContentRender } from '#/render'

definePageMeta({ layout: 'page' })

const route = useRoute()

const page = await useFetch('/api/page', {
  method: 'post',
  body: { path: route.path }
}).then(res => res.data.value?.data)

const metadata = page?.metadata

useSeoMeta({
  title: formatTitle(metadata?.title),
  description: `潮起潮落 - ${metadata?.title ?? 404}`
})

const pageData = computed(() => {
  if (!metadata) return null
  return {
    title: metadata.title,
    toc: metadata.toc
  }
})
</script>

<template>
  <EbbContent :page="pageData">
    <ContentRender :data="page" :path="route.path" />
  </EbbContent>
</template>
