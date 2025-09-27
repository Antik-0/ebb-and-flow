<script setup lang='ts'>
import type { SidebarItem as SidebarItemProp } from '#/types'
import { AnimatePresence, motion } from 'motion-v'
import { computed, ref } from 'vue'
import Link from '#/components/Link.vue'
import { ChevronRight } from '#/icons'

interface Props {
  item: SidebarItemProp
  level?: number
}

const props = withDefaults(defineProps<Props>(), { level: 1 })

const hasChildren = computed(() => {
  const items = props.item.items
  return Array.isArray(items) && items.length
})

const collapsed = ref(props.item.collapsed ?? true)
const collapsiable = computed(
  () => props.item.collapsed !== undefined && hasChildren.value
)

function toggle() {
  if (collapsiable.value) {
    collapsed.value = !collapsed.value
  }
}
</script>

<template>
  <section>
    <button
      v-if="collapsiable"
      :aria-expanded="!collapsed"
      class="group/sidebar-btn text-left flex w-full cursor-pointer"
      type="button"
      @click="toggle"
    >
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

    <Link
      v-else
      class="group/sidebar-link py-1 flex w-full cursor-pointer text-nowrap truncate"
      :data-active="item.acitve"
      data-role="link"
      :href="item.link"
    >
      <span
        :class="[
          'flex-1',
          'text-(sm [--c-text-2]) leading-8 font-500',
          'transition-color duration-250',
          'hover:text-[--c-brand-1]',
          'group-data-[active=true]/sidebar-link:text-[--c-brand-1]',
        ]"
      >
        {{ item.text }}
      </span>
    </Link>

    <template v-if="hasChildren">
      <AnimatePresence>
        <motion.div
          v-show="!collapsed"
          :animate="{ height: 'auto' }"
          class="mt-2 pl-5 border-l border-[--c-divider] overflow-hidden"
          :exit="{ height: 0 }"
          :style="{ '--level': level }"
          :transition="{ ease: 'easeIn' }"
        >
          <SidebarItem
            v-for="(subItem, index) in item.items"
            :key="index"
            :item="subItem"
            :level="level + 1"
          />
        </motion.div>
      </AnimatePresence>
    </template>
  </section>
</template>
