<script setup lang='ts'>
import { useIntersectionObserver, useMediaQuery } from '@repo/utils/hooks'
import { ref, Teleport, useTemplateRef } from 'vue'
import EAFNavAvatar from './EAFNavAvatar.vue'
import EAFNavMenu from './EAFNavMenu.vue'
import EAFNavTitle from './EAFNavTitle.vue'
import Avatar from './widgets/Avatar.vue'
import Hamburger from './widgets/Hamburger.vue'
import Search from './widgets/Search.vue'
import SidebarTrigger from './widgets/SidebarTrigger.vue'

const menuOpen = ref(false)

const showTitle = ref(false)
const sentry = useTemplateRef('sentry')
const { observe } = useIntersectionObserver()

observe(sentry, entry => {
  showTitle.value = !entry.isIntersecting
})

// 媒体查询
const isLargeScreen = useMediaQuery('(min-width: 400px)', {
  ssrWidth: 1024
})
</script>

<template>
  <header class="h-[--nav-height] inset-x-0 top-0 fixed z-[--z-index-nav]">
    <div class="navbar-background"></div>

    <div class="grid grid-cols-[100px_1fr_100px] size-full">
      <div class="flex justify-center">
        <div v-if="isLargeScreen" class="flex-center flex">
          <Avatar />
        </div>
        <SidebarTrigger v-else />
      </div>

      <div class="relative">
        <EAFNavAvatar v-if="!isLargeScreen" :show="!showTitle" />
        <div v-else class="flex-center flex inset-0 absolute">
          <EAFNavMenu />
        </div>

        <EAFNavTitle v-if="false" :show="showTitle" />
      </div>

      <div class="flex gap-1 justify-center">
        <Search />
        <Hamburger v-model="menuOpen" />
      </div>
    </div>
  </header>


  <ClientOnly>
    <Teleport to="body">
      <div ref="sentry" aria-hidden="true" class="h-1 pointer-events-none inset-x-0 top-[100px] absolute -z-[10]"></div>
    </Teleport>
  </ClientOnly>
</template>


<style>
.navbar-background {
  position: absolute;
  inset: 0;
  z-index: -1;
  background-color: var(--nav-bg-color);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 10px 1px hsl(0 0% 67% / 0.1),
              inset 0 0 10px 4px hsl(0 0% 80% / 0.1),
              inset 0 0 50px 4px hsl(0 0% 60% / 0.1),
              inset -1px -1px 4px hsl(0 0% 100% / 0.1)
}
</style>
