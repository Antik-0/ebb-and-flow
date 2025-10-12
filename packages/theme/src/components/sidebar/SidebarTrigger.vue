<script setup lang='ts'>
import { useSidebarControl } from '#/controller/sidebar.ts'

const { isOpen, toggle } = useSidebarControl()
</script>

<template>
  <button
    aria-label="sidebar-button"
    class="flex cursor-pointer flex-center"
    type="button"
    @click="toggle"
  >
    <slot v-bind="{ isOpen }"></slot>
  </button>
</template>
