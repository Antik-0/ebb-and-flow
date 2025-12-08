<script setup lang='ts'>
import type { VNode } from 'vue'
import { computed, provide, ref } from 'vue'
import { Copy, CopyCheck, LogoIconRender } from '#/icons'

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

const copied = ref(false)

async function handleCopy() {
  if (copied.value) return

  const target = codeItems.value[activeIndex.value]!
  if (target.code) {
    await window.navigator.clipboard.writeText(target?.code)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  }
}

// 提供一个空上下文，用于 `CodeBlock` 组件判断是否处于 `CodeGroup` 内
provide('code-group', {})
</script>

<template>
  <div class="code-group">
    <div v-if="showTitle" class="p-2 bg-[--c-bg-code-title]/80 flex gap-1 items-center">
      <button
        v-for="(item, index) in codeItems"
        :key="index"
        :class="[
          'px-2 py-1.5 rounded-md flex gap-1 transition-colors items-center text-muted-foreground',
          `hover:(text-accent-foreground bg-[--c-bg-code-block])`,
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
    <button
      aria-label="copy"
      :class="[
        ' rounded-md flex size-8 cursor-pointer flex-center top-2 right-2 absolute transition-colors transition-opacity',
        'text-muted-foreground bg-muted/40 opacity-0',
        'hover:(text-accent-foreground bg-muted)',
      ]"
      :data-active="copied"
      data-role="copy-button"
      type="button"
      @click="handleCopy"
    >
      <CopyCheck v-if="copied" class="size-4" />
      <Copy v-else class="size-4" />
    </button>
    <component
      :is="item.component"
      v-for="(item, index) in codeItems"
      v-show="activeIndex === index"
      :key="index"
    />
  </div>
</template>
