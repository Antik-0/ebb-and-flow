<script setup lang='ts'>
import { motion } from 'motion-v'
import { useSidebarControl } from '#/controller/sidebar.ts'

const { isOpen, close } = useSidebarControl()
</script>

<template>
  <div v-show="isOpen" class="inset-0 fixed z-[--eaf-z-index-sidebar]">
    <motion.aside
      :animate="isOpen ? 'show' : 'hidden'"
      class="max-w-80 w-[calc(100vw-64px)] inset-y-0 left-0 fixed z-[calc(var(--eaf-z-index-sidebar)+2)] data-[show=true]:translate-x-0"
      :data-show="isOpen"
      initial="hidden"
      :transition="{
        type: 'spring',
        duration: 1
      }"
      :variants="{
        show: {x: 0},
        hidden: {x: '-100%'}
      }"
    >
      <div class="p-8 bg-[--eaf-sidebar-bg-color] size-full">
      </div>
    </motion.aside>
    <div class="bg-[--eaf-sidebar-mask-color] inset-0 fixed z-[calc(var(--eaf-z-index-sidebar)+1)]" @click="close"></div>
  </div>
</template>
