<script setup lang='ts'>
import type { SidebarMenuItem } from '#/types'
import { computed, nextTick, onMounted, ref, useTemplateRef } from 'vue'
import Link from '#/components/Link.vue'
import { ChevronRight, Icon } from '#/icons'

interface Props {
  item: SidebarMenuItem
  level?: number
}

const props = withDefaults(defineProps<Props>(), { level: 1 })

const collapsed = ref(props.item.collapsed ?? true)
const collapsiable = computed(() => {
  const item = props.item
  return Array.isArray(item.items) && item.items.length
})

const viewRef = useTemplateRef<HTMLElement>('view')

async function toggle() {
  const element = viewRef.value!

  if (collapsed.value) {
    collapsed.value = false
    element.style.removeProperty('display')
    element.style.height = '0'
    await nextTick()
    element.style.height = element.scrollHeight + 'px'
  } else {
    collapsed.value = true
    element.style.height = element.scrollHeight + 'px'
    // 强制重排
    void element.offsetHeight
    element.style.height = '0'
  }
}

function onTransitionend() {
  if (collapsed.value) {
    const element = viewRef.value!
    element.style.setProperty('display', 'none')
  }
}

onMounted(() => {
  const element = viewRef.value
  if (element && collapsed.value) {
    element.style.display = 'none'
    element.style.height = '0'
  }
})
</script>

<template>
  <template v-if="collapsiable">
    <button
      :aria-expanded="!collapsed"
      class="sidebar-item__button"
      :data-active="item.active"
      type="button"
      @click="toggle"
    >
      <Icon
        v-if="item.icon"
        class="text-brand mr-2 h-8"
        :icon="item.icon"
      />
      <span
        class="text-sm text-accent-foreground leading-8 font-700 flex-1 text-nowrap truncate"
        data-role="button-title"
      >
        {{ item.text }}
      </span>
      <span
        class="text-4.5 text-muted-foreground flex size-6 flex-center"
      >
        <ChevronRight class="transition-transform duration-250" />
      </span>
    </button>
    <div
      ref="view"
      class="pl-5 transition-height duration-250 ease overflow-hidden"
      :data-level="level"
      @transitionend.self="onTransitionend"
    >
      <SidebarItem
        v-for="(subItem, index) in item.items"
        :key="index"
        :item="subItem"
        :level="level + 1"
      />
    </div>
  </template>

  <div
    v-else
    class="sidebar-item"
    :data-active="item.active"
    data-role="route"
  >
    <Link
      class="flex gap-2 truncate items-center"
      :href="item.link"
    >
      <Icon
        v-if="item.icon"
        class="text-brand"
        :icon="item.icon"
      />
      <span
        class="text-sm text-muted-foreground leading-8 flex-1 transition-color duration-250 hover:text-brand-2"
        data-role="title"
      >
        {{ item.text }}
      </span>
    </Link>
  </div>
</template>
