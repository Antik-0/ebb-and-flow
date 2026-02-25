<script setup lang='ts'>
import type { MenuItem } from '#/types'
import { motion } from 'motion-v'
import { useMenuNodeIsActive } from '#/controller/menus'
import { useMenubar } from '#/controller/navbar'
import { Icon } from '#/icons'
import Link from '../Link.vue'

const props = defineProps<{
  index: number
  item: MenuItem
}>()

const { onMenuItemHover } = useMenubar()
const isActive = useMenuNodeIsActive(props.item.id)
</script>

<template>
  <motion.li
    class="cursor-pointer relative data-[active=true]:text-brand hover:text-brand"
    :data-active="isActive"
    data-role="menuitem"
    layout
    @pointerenter="() => onMenuItemHover(index)"
  >
    <Link
      class="px-4 py-2.5 flex items-center"
      :href="item.link"
    >
      <motion.span
        v-if="item.icon && isActive"
        class="text-4 mr-1 inline-flex flex-center"
        layout-id="menuitem-icon"
      >
        <Icon :icon="item.icon" />
      </motion.span>
      <motion.span class="text-sm" layout>
        {{ item.text }}
      </motion.span>
    </Link>
    <motion.span
      v-if="isActive"
      class="h-px inset-x-px absolute from-transparent to-transparent via-brand/70 bg-linear-to-r -bottom-px"
      layout-id="menuitem-line"
    />
  </motion.li>
</template>
