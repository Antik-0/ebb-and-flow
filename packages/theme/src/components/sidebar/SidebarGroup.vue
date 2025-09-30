<script setup lang='ts'>
import type { SidebarItem as SidebarMenuItem } from '#/types'
import { computed } from 'vue'
import { Icon } from '#/icons'
import SidebarItem from './SidebarItem.vue'

const props = defineProps<{
  item: SidebarMenuItem
}>()

const isGrouped = computed(() => !!props.item.grouped)
</script>

<template>
  <div class="group py-3 [&_+_.group]:(border-t border-divider)" role="group">
    <template v-if="isGrouped">
      <div class="mb-2 flex">
        <Icon v-if="item.icon" class="text-18px text-brand mr-2 flex h-8" :icon="item.icon" />
        <span class="text-sm text-[--c-text-3] leading-8 font-700">{{ item.text }}</span>
      </div>
      <SidebarItem
        v-for="(subItem, index) in item.items"
        :key="index"
        class="py-1"
        :item="subItem"
        :level="1"
      />
    </template>
    <SidebarItem v-else :item="item" :level="1" />
  </div>
</template>
