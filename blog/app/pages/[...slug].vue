<script setup lang='ts'>
import { LayoutPage } from '@repo/theme'

const route = useRoute()

const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection('content').path(route.path).first()
})

const pageMeta = computed(() => {
  if (!page.value) return undefined

  const title = page.value.title
  const lastUpdated = page.value.lastUpdated
  const links = page.value.body.toc?.links ?? []
  const toc = links.map(link => ({
    text: link.text,
    to: `#${link.id}`,
    level: link.depth - 2
  }))

  return { title, toc, lastUpdated }
})
</script>

<template>
  <LayoutPage :page="pageMeta">
    <ContentRenderer v-if="page" :value="page" />
  </LayoutPage>
</template>
