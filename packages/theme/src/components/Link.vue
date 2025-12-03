<script setup lang='ts'>
import { isExternalLink } from '@repo/utils'
import { computed, resolveComponent } from 'vue'

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

const NuxtLink = resolveComponent('NuxtLink')
</script>

<template>
  <component
    :is="isExternal ? tag : NuxtLink"
    :ref="props.rel ?? (isExternal ? 'noreferrer' : undefined)"
    :href="props.href"
    :target="props.target ?? (isExternal ? '_blank' : undefined)"
  >
    <slot></slot>
  </component>
</template>
