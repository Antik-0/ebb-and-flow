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
  <section class="sidebar-group" role="group">
    <template v-if="isGrouped">
      <div class="mb-2 flex">
        <Icon
          v-if="item.icon"
          class="text-18px text-brand mr-2 flex h-8"
          :icon="item.icon"
        />
        <span class="text-14px text-[--c-text-3] leading-8 font-700">
          {{ item.text }}
        </span>
      </div>
      <section
        v-for="(subItem, index) in item.items"
        :key="index"
        class="py-1"
      >
        <SidebarItem :item="subItem" :level="1" />
      </section>
    </template>
    <SidebarItem v-else :item="item" :level="1" />
  </section>
</template>
