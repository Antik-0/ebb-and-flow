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
          'rounded-md flex size-5 flex-center cursor-pointer absolute',
          'text-muted-foreground bg-muted hover:text-brand duration-250',
          'opacity-0 group-hover:opacity-100 transition-opacity'
        ]"
      >
        <Hash class="size-4" />
      </span>
      <span class="transition-transform duration-250 group-hover:translate-x-6">
        <slot></slot>
      </span>
    </a>
  </component>
</template>
