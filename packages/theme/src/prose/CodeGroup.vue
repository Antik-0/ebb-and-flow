<script setup lang='ts'>
import type { VNode } from 'vue'
import { computed, ref } from 'vue'
import { LogoIconRender } from '#/icons'

interface CodeRecord {
  code: string
  filename?: string
  language?: string
}

const props = defineProps<{
  single?: boolean
}>()

const slots = defineSlots<{
  default: () => VNode[]
}>()

const activeIndex = ref(0)
const showTitle = computed(() => !props.single)

const codeItems = computed(() => {
  const children = slots.default()
  if (!children) return []

  return children.map(vnode => {
    const props = vnode.props as CodeRecord
    return {
      title: props.filename || props.language,
      logo: props.language,
      code: props.code,
      component: vnode
    }
  })
})
</script>

<template>
  <div class="code-group rounded-2 relative">
    <div v-if="showTitle" class="p-2 bg-[--c-bg-code-title]/80 flex gap-1 items-center">
      <button
        v-for="(item, index) in codeItems"
        :key="index"
        :class="[
          'px-2 py-1.5 rounded-md flex gap-1 transition-colors items-center text-muted-foreground',
          'hover:(text-accent-foreground bg-[--c-bg-code-block])',
          `data-[active='true']:(text-accent-foreground bg-[--c-bg-code-block])`
        ]"
        :data-active="activeIndex === index"
        type="button"
        @click="activeIndex = index"
      >
        <LogoIconRender v-if="item.logo" class="size-4" :logo="item.logo" />
        <span class="text-sm">{{ item.title }}</span>
      </button>
    </div>
    <component
      :is="item.component"
      v-for="(item, index) in codeItems"
      v-show="activeIndex === index"
      :key="index"
    />
  </div>
</template>
