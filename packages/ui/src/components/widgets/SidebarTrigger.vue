<script setup lang='ts'>
import { useSidebarControl } from '#/controller/sidebar.ts'
import Menu from '../icons/Menu.vue'

const { open } = useSidebarControl()
</script>

<template>
  <button
    aria-label="sidebar-button"
    class="flex-center text-6 p-4 flex cursor-pointer"
    type="button"
    @click="open"
  >
    <Menu />
  </button>
</template>
