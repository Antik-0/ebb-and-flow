<script setup lang='ts'>
import { isExternalLink } from '@repo/utils'
import { computed, resolveComponent } from 'vue'

const props = defineProps<{ href?: string }>()

const NuxtLink = resolveComponent('NuxtLink')

const isExternal = computed(() => isExternalLink(props.href ?? ''))
const target = computed(() => (isExternal.value ? '_blank' : undefined))
const ref = computed(() => (isExternal.value ? 'noreferrer' : undefined))
</script>

<template>
  <NuxtLink :ref="ref" :href="href" :target="target">
    <slot></slot>
  </NuxtLink>
</template>
