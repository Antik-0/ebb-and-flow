<script setup lang='ts'>
import type { Component } from 'vue'
import { h, shallowRef } from 'vue'
import { Github } from '#/icons'
import { useTheme } from '#/theme'
import Link from '../Link.vue'

const { theme } = useTheme()

const logoMap: Record<string, Component> = {
  github: () => h(Github)
}

const socialLinks = shallowRef(
  theme.socialLinks
    ?.filter(item => item.icon in logoMap)
    .map(item => ({
      label: item.icon,
      link: item.link,
      icon: logoMap[item.icon]!
    })) ?? []
)
</script>

<template>
  <div class="flex gap-2">
    <Link
      v-for="item in socialLinks"
      :key="item.label"
      :aria-label="item.label"
      class="text-6 flex size-9 cursor-pointer flex-center"
      :href="item.link"
    >
      <component :is="item.icon" />
    </Link>
  </div>
</template>
