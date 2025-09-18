<script setup lang='ts'>
import { useIntersectionObserver } from '@repo/utils/hooks'
import { ref, Teleport, useTemplateRef } from 'vue'
import EAFNavAvatar from './EAFNavAvatar.vue'
import EAFNavTitle from './EAFNavTitle.vue'
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
</script>

<template>
  <header class="h-[--nav-height] inset-x-0 top-0 fixed z-[--z-index-nav]">
    <div class="navbar-background"></div>

    <div class="grid grid-cols-[100px_1fr_100px] size-full">
      <div class="flex justify-center">
        <SidebarTrigger />
      </div>

      <div class="relative">
        <EAFNavAvatar :show="!showTitle" />
        <EAFNavTitle :show="showTitle" />
      </div>

      <div class="flex gap-1 justify-center">
        <Search />
        <Hamburger v-model="menuOpen" />
      </div>
    </div>
  </header>


  <Teleport to="body">
    <div ref="sentry" aria-hidden="true" class="h-1 pointer-events-none inset-x-0 top-[100px] absolute -z-[10]"></div>
  </Teleport>
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
