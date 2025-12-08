<script setup lang="ts">
import type { CodeBlockProps } from '@repo/theme/prose'
import { CodeBlock } from '@repo/theme/prose'

// reference: https://github.com/nuxt-content/mdc/blob/main/src/runtime/components/prose/ProsePre.vue
const props = defineProps<CodeBlockProps>()
</script>

<template>
  <CodeBlock v-bind="props">
    <slot></slot>
  </CodeBlock>
</template>
