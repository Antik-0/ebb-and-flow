<script setup lang='ts'>
import type { VNode } from 'vue'
import type { MenuItem } from '#/types'
import { motion } from 'motion-v'
import Link from '#/components/Link.vue'
import { useMenubarCtx } from '#/controller/navbar.ts'
import { Icon } from '#/icons'

const props = defineProps<{
  item: MenuItem
}>()

const emit = defineEmits<{
  hover: []
}>()

const slots = defineSlots<{
  content: () => VNode[]
}>()

const { forwarContent } = useMenubarCtx()

forwarContent(props.item, slots.content)
</script>

<template>
  <motion.li
    class="cursor-pointer relative data-[active=true]:text-brand hover:text-brand"
    :data-active="item.active"
    role="menuitem"
    layout
    @pointerenter="emit('hover')"
  >
    <Link
      class="px-4 py-2.5 flex items-center"
      :href="item.link"
    >
      <motion.span
        v-if="item.icon && item.active"
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
      v-if="item.active"
      class="h-px inset-x-px absolute from-transparent to-transparent via-brand/70 bg-linear-to-r -bottom-px"
      layout-id="menuitem-line"
    />
  </motion.li>
</template>
