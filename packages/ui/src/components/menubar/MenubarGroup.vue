<script setup lang='ts'>
import type { MenuItem } from '#/controller/navbar.ts'
import { computed } from 'vue'
import { Popover } from '#/components/popover'
import MenubarItem from './MenubarItem.vue'

interface Props {
  item: MenuItem
  isActive?: boolean
}

const { item, isActive } = defineProps<Props>()

const emit = defineEmits<{
  click: []
}>()

const hasChild = computed(() => !!item.children)
</script>

<template>
  <Popover v-if="hasChild" :offset="20" trigger="hover">
    <template #trigger>
      <MenubarItem :is-active="isActive" :item="item" @click="emit('click')" />
    </template>

    <div class="rounded-4xl bg-rose-500 h-100 w-100">
    </div>
  </Popover>
  <MenubarItem
    v-else
    :is-active="isActive"
    :item="item"
    @click="emit('click')"
  />
</template>
