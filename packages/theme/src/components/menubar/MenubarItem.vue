<script setup lang='ts'>
import type { NavMenuItem } from '#/types'
import { motion } from 'motion-v'
import { inject } from 'vue'
import Link from '#/components/Link.vue'
import { MenubarCtx } from '#/controller/navbar.ts'
import { Icon } from '#/icons'

const props = defineProps<{
  item: NavMenuItem
  index: number
}>()

const slots = defineSlots<{
  content: () => any
}>()

const { forwarItemContent, onMenuItemHover } = inject(MenubarCtx)!

forwarItemContent(props.item, slots.content)
</script>

<template>
  <motion.li
    class="cursor-pointer relative data-[active=true]:text-brand hover:text-brand"
    :data-active="item.acitve"
    role="menuitem"
    layout
    @pointerenter="($event) => onMenuItemHover($event, index)"
  >
    <Link
      class="px-4 py-2.5 flex items-center"
      :href="item.link"
    >
      <motion.span
        v-if="item.icon && item.acitve"
        class="text-4 mr-1 inline-flex flex-center"
        layout-id="menuitem-icon"
      >
        <Icon :icon="item.icon" />
      </motion.span>
      <motion.span layout>{{ item.text }}</motion.span>
    </Link>
    <motion.span
      v-if="item.acitve"
      class="h-px inset-x-px absolute from-transparent to-transparent via-brand/70 bg-linear-to-r -bottom-px"
      layout-id="menuitem-line"
    />
  </motion.li>
</template>
