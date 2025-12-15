<script setup lang="ts">
import { Copy, CopyCheck } from '@repo/theme/icons'

// reference: https://github.com/nuxt-content/mdc/blob/main/src/runtime/components/prose/ProsePre.vue
interface Props {
  code?: string
  language?: string
  filename?: string
  highlights?: (() => number[])[]
  meta?: string
  class?: string
}

const props = defineProps<Props>()

const copied = ref(false)

async function handleCopy() {
  if (copied.value || !props.code) return

  await window.navigator.clipboard.writeText(props.code)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}
</script>

<template>
  <pre class="group rounded-2 relative" :class="props.class" v-bind="$attrs">
    <button
      aria-label="copy"
      :class="[
        'rounded-md flex size-8 cursor-pointer flex-center top-2 right-2 absolute transition-all',
        'text-muted-foreground bg-muted/40 opacity-0',
        'group-hover:opacity-100 hover:(text-accent-foreground bg-muted)',
      ]"
      :data-active="copied"
      type="button"
      @click="handleCopy"
    >
      <CopyCheck v-if="copied" class="size-4" />
      <Copy v-else class="size-4" />
    </button>
    <slot></slot>
  </pre>
</template>
