<script setup lang='ts'>
import type { MenuItem } from '#/controller/navbar.ts'
import { motion } from 'motion-v'
import { Icon } from '#/icons'

interface Props {
  item: MenuItem
  isActive?: boolean
}

const { item, isActive } = defineProps<Props>()
</script>

<template>
  <motion.li
    class="cursor-pointer relative data-[active=true]:text-[--c-brand] hover:text-[--c-brand]"
    role="menuitem"
    layout
  >
    <a
      class="px-4 py-2 flex items-center"
      :href="item.href"
    >
      <motion.span
        v-if="item.icon && isActive"
        class="flex-center text-4 mr-1 inline-flex"
        layout-id="menuitem-icon"
      >
        <Icon :icon="item.icon" />
      </motion.span>
      <motion.span layout>{{ item.text }}</motion.span>
    </a>
    <motion.span
      v-if="isActive"
      class="h-1px inset-x-1px absolute from-transparent to-transparent via-[--c-brand]/70 bg-linear-to-r -bottom-1px"
      layout-id="menuitem-line"
    />
  </motion.li>
</template>
