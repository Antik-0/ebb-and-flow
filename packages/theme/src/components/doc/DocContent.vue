<script setup lang='ts'>
import type { Page } from '#/types'
import { watch } from 'vue'
import { setPageData } from '#/controller/layout'
import NotFound from '../NotFound.tsx'
import DocFooter from './DocFooter.vue'
import DocOutline from './DocOutline.tsx'

const props = defineProps<{ page?: Page }>()

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

    <div class="pl-4 w-64" data-role="doc-aside">
      <aside class="pb-12 pt-[calc(var(--h-navbar)+48px)] flex-col w-56 inset-y-0 fixed">
        <div
          :class="[
            'flex-col flex-1 overflow-x-hidden overflow-y-auto',
            'opacity-60 transition-opacity hover:opacity-100'
          ]"
        >
          <DocOutline />
          <div class="flex-1"></div>
        </div>
      </aside>
    </div>
  </div>
  <NotFound v-else />
</template>
