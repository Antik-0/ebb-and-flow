<script setup lang='ts'>
import type { MenuItem } from '#/controller/navMenu.ts'

interface Props {
  item: MenuItem
  isActive?: boolean
}

const props = defineProps<Props>()
</script>

<template>
  <li
    class="cursor-pointer relative data-[active=true]:text-[--c-brand] hover:text-[--c-brand]"
    :data-active="isActive"
    role="menuitem"
  >
    <div class="px-4 py-2 flex items-center">
      <span>{{ props.item.text }}</span>
    </div>
    <span
      v-if="isActive"
      class="h-1px inset-x-1px absolute from-transparent to-transparent via-[--c-brand]/70 bg-linear-to-r -bottom-1px"
    ></span>
  </li>
</template>
