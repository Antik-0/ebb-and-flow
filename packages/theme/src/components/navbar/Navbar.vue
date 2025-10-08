<script setup lang='ts'>
import { useIntersectionObserver } from '@repo/utils/hooks'
import { motion } from 'motion-v'
import { ref, shallowRef, Teleport, useTemplateRef } from 'vue'
import Menubar from '#/components/menubar/Menubar.vue'
import { useLayoutCtx } from '#/controller/layout.ts'
import Avatar from '../Avatar.vue'
import Hamburger from './Hamburger.vue'
import EAFNavTitle from './NavbarTitle.vue'
import Search from './Search.vue'
import SidebarTrigger from './SidebarTrigger.vue'

const { isMobile } = useLayoutCtx()

const menuOpen = ref(false)

const showTitle = shallowRef(false)
const sentry = useTemplateRef('sentry')

const { observe } = useIntersectionObserver()
observe(sentry, entry => {
  showTitle.value = !entry.isIntersecting
})
</script>

<template>
  <div
    class="flex flex-center inset-x-0 top-0 fixed z-[--z-index-navbar]"
    :data-state="isMobile ? 'mobile' : 'desktop'"
  >
    <header class="h-[--navbar-height] max-w-1280px w-full relative isolate">
      <div class="grid grid-cols-[100px_1fr_100px] size-full">
        <div class="flex flex-center">
          <SidebarTrigger v-if="isMobile" />
          <Avatar v-else />
        </div>

        <div class="relative isolate">
          <motion.div
            :animate="showTitle ? 'hidden' : 'show'"
            class="flex flex-center inset-0 absolute"
            :transition="{ duration: 0.6 }"
            :variants="{
              show: { opacity: 1, scale: 1 },
              hidden: { opacity: 0, scale: 0.8 }
            }"
          >
            <Avatar v-if="isMobile" />
            <Menubar v-else />
          </motion.div>

          <EAFNavTitle :show="showTitle" />
        </div>

        <div class="flex gap-1 justify-center">
          <Search />
          <Hamburger v-model="menuOpen" />
        </div>
      </div>
      <div aria-hidden="true" class="navbar-background"></div>
    </header>
  </div>

  <ClientOnly>
    <Teleport to="body">
      <div ref="sentry" aria-hidden="true" class="h-1 pointer-events-none inset-x-0 top-[100px] absolute -z-[10]"></div>
    </Teleport>
  </ClientOnly>
</template>
