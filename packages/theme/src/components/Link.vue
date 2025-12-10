<script setup lang='ts'>
import { isExternalLink } from '@repo/utils'
import { computed, resolveComponent } from 'vue'

const props = defineProps<{
  tag?: string
  href?: string
  target?: string
  rel?: string
}>()

const NuxtLink = resolveComponent('NuxtLink')

const tag = computed(() => props.tag ?? (props.href ? NuxtLink : 'span'))

const isExternal = computed(
  () => (props.href && isExternalLink(props.href)) || props.target === '_blank'
)
</script>

<template>
  <component
    :is="isExternal ? 'a' : tag"
    :href="props.href"
    :rel="props.rel ?? (isExternal ? 'noreferrer' : undefined)"
    :target="props.target ?? (isExternal ? '_blank' : undefined)"
  >
    <slot></slot>
  </component>
</template>
