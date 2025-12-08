<script setup lang='ts'>
import { AnchorHead } from '@repo/theme/prose'

const props = defineProps<{ id?: string }>()
</script>

<template>
  <AnchorHead :id="id" tag="h3" v-bind="$attrs">
    <slot></slot>
  </AnchorHead>
</template>
