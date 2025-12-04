<script setup lang='ts'>
import { computed, onMounted, shallowRef, watchEffect } from 'vue'
import { useSharedMenus } from '#/controller/menus.ts'
import Link from './Link.vue'

const props = defineProps<{
  lastUpdated?: string
}>()

const datetime = shallowRef('')
const ISODatetime = shallowRef('')
const hasLastUpdated = computed(() => !!props.lastUpdated)

onMounted(() => {
  const DateTimeFormater = new Intl.DateTimeFormat('zh-CN', {
    dateStyle: 'short',
    timeStyle: 'medium',
    timeZone: 'Asia/ShangHai'
  })

  watchEffect(() => {
    if (!props.lastUpdated) return
    const date = new Date(props.lastUpdated)
    datetime.value = DateTimeFormater.format(date)
    ISODatetime.value = date.toISOString()
  })
})

const { currActiveNode } = useSharedMenus()

const prevNav = computed(() => currActiveNode.value?.prevNav)
const nextNav = computed(() => currActiveNode.value?.nextNav)
</script>

<template>
  <footer class="mt-16">
    <div class="pb-4 flex items-center justify-between">
      <p v-if="hasLastUpdated" class="text-14px text-[--c-text-2] leading-8 font-500">
        <span>最后更新于: </span>
        <time :datetime="ISODatetime">{{ datetime }}</time>
      </p>
    </div>

    <div class="bg-divider h-px"></div>

    <nav aria-label="pager" class="pt-6 gap-4 grid grid-cols-1 sm:grid-cols-2">
      <div
        v-if="prevNav"
        class="border border-divider rounded-2 transition-colors duration-250 hover:border-brand-3"
      >
        <Link
          class="px-4 py-3 flex-col"
          :href="prevNav.link"
        >
          <span class="text-12px text-[--c-text-2] leading-20px">
            上一页
          </span>
          <span class="text-14px text-brand-3 leading-20px">
            {{ prevNav.text }}
          </span>
        </Link>
      </div>
      <div
        v-if="nextNav"
        class="border border-divider rounded-2 transition-colors duration-250 hover:border-brand-3 sm:col-2"
      >
        <Link

          class="px-4 py-3 text-right flex-col"
          :href="nextNav.link"
        >
          <span class="text-12px text-[--c-text-2] leading-20px">
            下一页
          </span>
          <span class="text-14px text-brand-3 leading-20px">
            {{ nextNav.text }}
          </span>
        </Link>
      </div>
    </nav>
  </footer>
</template>
