<script setup lang='ts'>
import { useSidebarControl } from '#/controller/sidebar.ts'

const { isOpen, toggle } = useSidebarControl()
</script>

<template>
  <button
    :aria-checked="isOpen"
    aria-label="sidebar-button"
    class="flex cursor-pointer flex-center"
    role="switch"
    type="button"
    @click="toggle"
  >
    <slot></slot>
  </button>
</template>
