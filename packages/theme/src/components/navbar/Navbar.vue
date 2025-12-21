<script setup lang='ts'>
import { navigateTo } from 'nuxt/app'
import { useLayoutContext } from '#/controller/layout'
import { Menu } from '#/icons'
import { useTheme } from '#/theme'
import Avatar from '../Avatar.vue'
import CubeAvatar from '../CubeAvatar.vue'
import GlassMask from '../GlassMask.vue'
import Menubar from '../menubar/Menubar.vue'
import SidebarTrigger from '../sidebar/SidebarTrigger.vue'
import ThemeToggle from '../ThemeToggle.vue'
import SocialLinks from './SocialLinks.vue'

const { theme } = useTheme()
const { isMobile } = useLayoutContext()
</script>

<template>
  <div class="flex flex-center inset-x-0 top-0 fixed z-[--z-index-navbar]" data-role="navbar">
    <header class="bg-[--c-bg-navbar] h-[--h-navbar] max-w-320 w-full relative isolate">
      <div class="grid cols-[120px_1fr_120px] size-full">
        <div class="px-6 flex items-center">
          <SidebarTrigger
            v-if="isMobile"
            class="text-6 size-10"
          >
            <Menu />
          </SidebarTrigger>
          <CubeAvatar
            v-else
            :avatar="theme.avatar"
            class="mx-auto"
            :style="{
              '--size': '40px',
              '--rounded': '4px'
            }"
            @click="navigateTo('/')"
          />
        </div>

        <div class="flex flex-center">
          <Avatar
            v-if="isMobile"
            :avatar="theme.avatar"
            @click="navigateTo('/')"
          />
          <Menubar v-else />
        </div>

        <div class="flex gap-3 items-center">
          <ThemeToggle />
          <SocialLinks />
        </div>
      </div>

      <GlassMask class="inset-0 absolute -z-1" style="--fit-size: cover" />
    </header>
  </div>
</template>
