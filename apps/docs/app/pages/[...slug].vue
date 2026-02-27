<script setup lang='ts'>
import type { OutlineAnchor } from 'ebb-theme'
import { EbbContent } from 'ebb-theme'

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

const pageData = createPageData()

function createPageData() {
  if (!page.value) return null

  const title = page.value.title
  const links = page.value.body.toc?.links ?? []
  const toc = buildToc(links)

  function buildToc(items: typeof links) {
    const result: OutlineAnchor[] = []
    for (const item of items) {
      result.push({
        text: item.text,
        to: `#${item.id}`,
        level: item.depth - 1
      })
      if (item.children) {
        result.push(...buildToc(item.children))
      }
    }
    return result
  }

  return { title, toc }
}
</script>

<template>
  <EbbContent :page="pageData">
    <ContentRenderer v-if="page" :value="page" />
  </EbbContent>
</template>
