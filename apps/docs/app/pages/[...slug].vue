<script setup lang='ts'>
import type { MarkdownData } from 'ebb-markdown'
import { EbbContent } from 'ebb-theme'
import { ContentRender } from '#/render'

definePageMeta({ layout: 'page' })

const route = useRoute()

const { data } = await useFetch('/api/page', {
  method: 'post',
  body: { path: route.path }
})

console.log(data.value)

const page = data.value as MarkdownData | null

const metadata = page?.metadata

useSeoMeta({ title: formatTitle(metadata?.title) })

const pageData = metadata
  ? {
      title: metadata.title,
      toc: metadata.toc
    }
  : null
</script>

<template>
  <EbbContent :page="pageData">
    <ContentRender v-if="false" :data="page" :path="route.path" />
  </EbbContent>
</template>
