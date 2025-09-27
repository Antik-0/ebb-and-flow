<script setup lang='ts'>
import { computed } from 'vue'
import { isExternalLink, normalizeLink } from '#/shared'

const props = defineProps<{
  tag?: string
  href?: string
  target?: string
  rel?: string
}>()

const tag = computed(() => props.tag ?? (props.href ? 'a' : 'span'))

const isExternal = computed(
  () => (props.href && isExternalLink(props.href)) || props.target === '_blank'
)
</script>

<template>
  <component
    :is="tag"
    :ref="props.rel ?? (isExternal ? 'noreferrer' : undefined)"
    :href="props.href ? normalizeLink(props.href) : undefined"
    :target="props.target ?? (isExternal ? '_blank' : undefined)"
  >
    <slot></slot>
  </component>
</template>
