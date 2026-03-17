<script setup lang='ts'>
import type { MenuItem } from '#/types'
import { computed } from 'vue'
import Link from '#/components/Link.vue'
import { useMenuNodeIsActive } from '#/controller/menus'
import { ChevronRight, Icon } from '#/icons'
import { Accordion, AccordionContent, AccordionTrigger } from '../Accordion.tsx'

interface Props {
  item: MenuItem
  level?: number
}

const props = withDefaults(defineProps<Props>(), { level: 1 })

const collapsed = props.item.collapsed ?? true
const collapsiable = computed(() => {
  const item = props.item
  return Array.isArray(item.items) && item.items.length
})

const isActive = useMenuNodeIsActive(props.item.index)
</script>

<template>
  <Accordion v-if="collapsiable" :default-value="collapsed">
    <AccordionTrigger>
      <button
        class="sidebar-item__button"
        :data-active="isActive"
        type="button"
      >
        <Icon
          v-if="item.icon"
          class="text-brand mr-2 h-8"
          :icon="item.icon"
        />
        <span
          class="text-sm text-accent-foreground leading-8 font-700 flex-1 text-nowrap truncate"
          data-role="text"
        >
          {{ item.text }}
        </span>
        <span
          class="text-4.5 text-muted-foreground flex size-6 flex-center"
        >
          <ChevronRight class="transition-transform duration-300" />
        </span>
      </button>
    </AccordionTrigger>
    <AccordionContent :style="{ '--level': level }">
      <SidebarItem
        v-for="(subItem, index) in item.items"
        :key="index"
        :item="subItem"
        :level="level + 1"
      />
    </AccordionContent>
  </Accordion>

  <div
    v-else
    class="sidebar-item"
    :data-active="isActive"
    data-role="route"
  >
    <Link
      class="flex gap-2 truncate transition-transform duration-300 items-center"
      :href="item.link"
    >
      <Icon
        v-if="item.icon"
        class="text-brand"
        :icon="item.icon"
      />
      <span
        class="text-sm text-muted-foreground leading-8 flex-1 transition-color duration-300 hover:text-brand-2"
        data-role="text"
      >
        {{ item.text }}
      </span>
    </Link>
  </div>
</template>
