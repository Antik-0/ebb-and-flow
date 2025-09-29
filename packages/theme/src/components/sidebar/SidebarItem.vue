<script setup lang='ts'>
import type { SidebarItem as SidebarMenuItem } from '#/types'
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
  const hasChildren = Array.isArray(item.items) && item.items.length
  return props.item.collapsed !== undefined && hasChildren
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
    element.style.height = '0px'
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
  <section>
    <template v-if="collapsiable">
      <button
        :aria-expanded="!collapsed"
        class="group/sidebar-btn text-left flex w-full cursor-pointer"
        type="button"
        @click="toggle"
      >
        <Icon
          v-if="item.icon"
          class="text-brand mr-2 flex h-8"
          :icon="item.icon"
        />
        <span class="text-sm text-[--c-text-1] leading-8 font-700 flex-1 text-nowrap truncate">
          {{ item.text }}
        </span>
        <span
          class="text-(lg [--c-text-3]) flex size-8 flex-center group-hover/sidebar-btn:text-[--c-text-2] -mr-2"
        >
          <ChevronRight
            class="transition-transform duration-250 group-aria-[expanded=true]/sidebar-btn:rotate-90"
          />
        </span>
      </button>
      <div
        ref="view"
        class="pl-5 border-l border-[--c-divider] transition-all duration-250 ease overflow-hidden"
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

    <Link
      v-else
      class="group/sidebar-link py-1 flex w-full cursor-pointer text-nowrap truncate"
      :data-active="item.acitve"
      data-role="link"
      :href="item.link"
    >
      <Icon
        v-if="item.icon"
        class="text-brand mr-2 flex h-8"
        :icon="item.icon"
      />
      <span
        :class="[
          'flex-1',
          'text-(sm [--c-text-2]) leading-8 font-500',
          'transition-color duration-250',
          'hover:text-brand-3',
          'group-data-[active=true]/sidebar-link:text-brand-2',
        ]"
      >
        {{ item.text }}
      </span>
    </Link>
  </section>
</template>
