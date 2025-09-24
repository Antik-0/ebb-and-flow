<script setup lang='ts'>
import { withBase } from 'vitepress'
import { computed } from 'vue'

const props = defineProps<{
  tag?: string
  href?: string
  target?: string
  rel?: string
}>()

const tag = computed(() => props.tag ?? (props.href ? 'a' : 'span'))

const EXTERNAL_URL_RE = /^(?:[a-z]+:|\/\/)/i

function isExternalLink(url: string) {
  return EXTERNAL_URL_RE.test(url)
}

function normalizeLink(href: string) {
  if (isExternalLink(href)) {
    return href
  }
  return withBase(href)
}

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
  />
</template>
