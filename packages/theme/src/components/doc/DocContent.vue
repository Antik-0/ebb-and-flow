<script setup lang='ts'>
import type { Page } from '#/types'
import { watch } from 'vue'
import { useLayoutContext, usePageData } from '#/controller/layout'
import NotFound from '#/not-found.vue'
import DocFooter from './DocFooter.vue'
import DocOutline from './DocOutline.vue'

const props = defineProps<{ page?: Page }>()

const { isDesktop } = useLayoutContext()

const { setPageData } = usePageData()

watch(
  () => props.page,
  value => setPageData(value ?? null),
  { immediate: true }
)
</script>

<template>
  <div v-if="page" class="flex" data-role="doc-content">
    <div class="px-8 pb-24 flex-1 min-w-0">
      <article id="content" class="ebb-doc">
        <slot></slot>
      </article>
      <DocFooter />
    </div>

    <div v-if="isDesktop" class="pl-8 w-64">
      <aside class="doc-aside">
        <div class="aside-content">
          <DocOutline />
          <div class="flex-1"></div>
        </div>
      </aside>
    </div>
  </div>
  <NotFound v-else />
</template>
