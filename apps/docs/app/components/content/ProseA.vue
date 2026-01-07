<script setup lang='ts'>
import { isExternalLink } from '@repo/utils'

const props = defineProps<{
  href: string
  target?: string
}>()

const isExternal = computed(() => isExternalLink(props.href))
</script>

<template>
  <NuxtLink
    class="ebb-link relative"
    :external="isExternal"
    :href="href"
    :target="isExternal ? '_blank' : target"
  >
    <slot></slot>
  </NuxtLink>
</template>

<style>
.ebb-link::after {
  --m-value-u: 0%;

  content: '';
  position: absolute;
  top: 100%;
  inset-inline: 0;
  height: 2px;
  border-radius: 2px;
  translate: 0 2px;
  transition: --m-value-u 400ms ease-in-out;
  background: linear-gradient(to right, var(--c-brand-2) var(--m-value-u), hsla(0, 0%, 60%, 0.2) var(--m-value-u));
}

.ebb-link:hover::after {
  --m-value-u: 100%;
}
</style>
