<script setup lang='ts'>
import { useLayoutContext } from '#/controller/layout'
import { useTheme } from '#/theme'
import GlassMask from '../GlassMask.vue'
import ThemeToggle from '../ThemeToggle.vue'
import { NavbarAction, NavbarContent } from './Navbar'
import SocialLinks from './SocialLinks.vue'

const { theme } = useTheme()
const { isMobile } = useLayoutContext()
</script>

<template>
  <header
    class="flex grid-area-[navbar] flex-center inset-x-0 top-0 fixed z-[--z-index-navbar]"
    data-role="navbar"
  >
    <div class="bg-[--c-bg-navbar] grid cols-[120px_1fr_120px] h-[--h-navbar] max-w-320 w-full">
      <div class="px-6 flex items-center">
        <NavbarAction :avatar="theme.avatar" :is-mobile="isMobile" />
      </div>

      <div class="flex flex-center">
        <NavbarContent :avatar="theme.avatar" :is-mobile="isMobile" />
      </div>

      <div class="pr-6 flex items-center justify-between">
        <ThemeToggle />
        <SocialLinks />
      </div>
    </div>

    <GlassMask
      class="inset-0 absolute -z-1"
      style="--fit-size: cover"
    />
  </header>
</template>
