<script setup lang='ts'>
import type { ContentCollectionItem } from '@nuxt/content'
import type { OutlineAnchor } from '@repo/theme'
import { DocContent } from '@repo/theme'

definePageMeta({ layout: 'page' })

const route = useRoute()

const { data: page } = await useAsyncData(route.path, async () => {
  const result = await queryCollection('content').path(route.path).first()
  const content = result?.body.value
  if (content) {
    // 填充 page-meta props，默认位置位于 `h1` 标题的后一个 dom
    const pageMeta = content[1] as any[]
    if (pageMeta && pageMeta[0] === 'page-meta') {
      pageMeta[1] = {
        // 非基本类型，需要:语法来动态绑定，值需要序列化
        ':tags': JSON.stringify(result.tags),
        readingTime: result.readingTime,
        lastUpdated: result.lastUpdated
      }
    }
  }
  return result
})

useSeoMeta({ title: formatTitle(page.value?.title) })

const pageMeta = computed(() => {
  if (!page.value) return undefined

  const title = page.value.title
  const links = page.value.body.toc?.links ?? []
  const toc = buildToc(links)

  return { title, toc }
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
  <DocContent :page="pageMeta">
    <ContentRenderer v-if="page" :value="page" />
  </DocContent>
</template>
