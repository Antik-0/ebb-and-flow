<script setup lang='ts'>
import type { ContentCollectionItem } from '@nuxt/content'
import type { OutlineAnchor } from '@repo/theme'
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
  const toc = buildToc(links)

  return { title, toc, lastUpdated }
})

type TocLinks = NonNullable<ContentCollectionItem['body']['toc']>['links']

function buildToc(links: TocLinks) {
  const result: OutlineAnchor[] = []
  for (const link of links) {
    result.push({
      text: link.text,
      to: `#${link.id}`,
      level: link.depth - 2
    })
    if (link.children) {
      result.push(...buildToc(link.children))
    }
  }
  return result
}
</script>

<template>
  <LayoutPage :page="pageMeta">
    <ContentRenderer v-if="page" :value="page" />
  </LayoutPage>
</template>
