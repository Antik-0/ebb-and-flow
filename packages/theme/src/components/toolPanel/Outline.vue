<script setup lang='ts'>
import DocOutline from '#/components/DocOutline.vue'
import { Popover } from '#/components/popover'
import { BookOpen } from '#/icons'
</script>

<template>
  <Popover :offset="20" placement="left" fixed>
    <template #trigger>
      <button
        aria-label="outline-button"
        class="action-button"
        type="button"
      >
        <BookOpen />
      </button>
    </template>

    <div class="outline-viewport">
      <DocOutline />
    </div>
  </Popover>
</template>
