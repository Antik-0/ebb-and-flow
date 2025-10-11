<script setup lang='ts'>
import { motion } from 'motion-v'
import { useRouter } from 'vitepress'
import Menubar from '#/components/menubar/Menubar.vue'
import { useLayoutCtx } from '#/controller/layout.ts'
import { HOME_PATH } from '#/shared'
import Avatar from '../Avatar.vue'
import CubeAvatar from '../CubeAvatar.vue'
import EAFNavTitle from './NavbarTitle.vue'
import NavbarWidget from './NavbarWidget.vue'
import SidebarTrigger from './SidebarTrigger.vue'

const { isMobile, showToolPanel } = useLayoutCtx()

const router = useRouter()

function backHome() {
  router.go(HOME_PATH)
}
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
          <CubeAvatar v-else @click="backHome" />
        </div>

        <div class="relative isolate">
          <motion.div
            :animate="showToolPanel ? 'hidden' : 'show'"
            class="flex flex-center inset-0 absolute"
            :transition="{ duration: 0.6 }"
            :variants="{
              show: { opacity: 1, scale: 1 },
              hidden: { opacity: 0, scale: 0.8 }
            }"
          >
            <Avatar v-if="isMobile" @click="backHome" />
            <Menubar v-else />
          </motion.div>

          <EAFNavTitle :show="showToolPanel" />
        </div>

        <div class="relative">
          <NavbarWidget />
        </div>
      </div>
      <div aria-hidden="true" class="navbar-background"></div>
    </header>
  </div>
</template>
