<script setup lang='ts'>
import type { Component } from 'vue'
import type { SocialLink } from '#/types'
import { h, shallowRef } from 'vue'
import Link from '#/components/Link.vue'
import ThemeToggle from '#/components/ThemeToggle.vue'
import { Github } from '#/icons'
import { useTheme } from '#/shared'

const theme = useTheme()

const socialLinks = shallowRef(buildSocialLinks(theme.value.socialLinks ?? []))

function buildSocialLinks(themeSocialLinks: SocialLink[]) {
  const logoMap: Record<string, Component> = {
    github: () => h(Github)
  }

  return themeSocialLinks
    .filter(item => item.icon in logoMap)
    .map(item => ({
      label: item.icon,
      link: item.link,
      icon: logoMap[item.icon]!
    }))
}
</script>

<template>
  <div class="px-5 inset-y-0 right-0 absolute">
    <div class="flex gap-2 h-full items-center">
      <div class="mx-2">
        <ThemeToggle />
      </div>
      <div class="flex gap-2">
        <Link
          v-for="social in socialLinks"
          :key="social.label"
          :aria-label="social.label"
          class="text-6 flex size-9 cursor-pointer flex-center"
          :href="social.link"
        >
          <component :is="social.icon" />
        </Link>
      </div>
    </div>
  </div>
</template>
