<script setup lang='ts'>
import { Hash } from '#/icons'

const props = defineProps<{
  tag: string
  id?: string
}>()
</script>

<template>
  <component :is="tag" :id="id" v-bind="$attrs">
    <a class="group inline-flex items-center relative" :href="`#${id}`">
      <span
        :class="[
          'rounded-md -left-1 flex size-5 flex-center absolute -translate-x-full cursor-pointer',
          'text-muted-foreground bg-muted hover:text-brand',
          'opacity-0 group-hover:opacity-100 transition-opacity'
        ]"
      >
        <Hash class="size-4" />
      </span>
      <slot></slot>
    </a>
  </component>
</template>
