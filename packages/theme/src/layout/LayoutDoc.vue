<script setup lang='ts'>
import { useRouter, withBase } from 'vitepress'
import Avatar from '#/components/Avatar.vue'
import CubeAvatar from '#/components/CubeAvatar.vue'
import DocFooter from '#/components/DocFooter.vue'
import DocOutline from '#/components/DocOutline.vue'
import Menubar from '#/components/menubar/Menubar.vue'
import Navbar from '#/components/Navbar.vue'
import SocialLinks from '#/components/SocialLinks.vue'
import Sidebar from '#/components/sidebar/Sidebar.vue'
import SidebarTrigger from '#/components/sidebar/SidebarTrigger.vue'
import ThemeToggle from '#/components/ThemeToggle.vue'
import ToolPanel from '#/components/toolPanel/ToolPanel.vue'
import { useLayoutCtx } from '#/controller/layout.ts'
import { useOutline } from '#/controller/outline.ts'
import { Menu } from '#/icons'

useOutline()

const { isDesktop, isMobile, showToolPanel } = useLayoutCtx()

const router = useRouter()

function backToHome() {
  router.go(withBase('/'))
}
</script>

<template>
  <Navbar :show-title="showToolPanel">
    <template #start-action>
      <div class="px-6 flex items-center">
        <SidebarTrigger
          v-if="isMobile"
          class="text-6 size-10"
        >
          <Menu />
        </SidebarTrigger>
        <CubeAvatar
          v-else
          class="mx-auto"
          @click="backToHome"
        />
      </div>
    </template>

    <template #menu>
      <Avatar v-if="isMobile" @click="backToHome" />
      <Menubar v-else />
    </template>

    <template #end-action>
      <div class="pr-6 flex items-center justify-between">
        <ThemeToggle />
        <SocialLinks />
      </div>
    </template>
  </Navbar>

  <Sidebar />

  <div class="pt-[--navbar-height]">
    <div class="layout-doc">
      <main id="content" class="doc-content">
        <div class="px-8 pb-24 flex-1 min-w-0">
          <Content class="vp-doc" />
          <DocFooter />
        </div>

        <div v-if="isDesktop" class="pl-8 w-64">
          <aside class="doc-aside">
            <div class="aside-content">
              <DocOutline />
              <div class="flex-1"></div>
            </div>
          </aside>
        </div>

        <div id="bottom-sentry" class="h-px inset-x-0 bottom-px absolute"></div>
      </main>
    </div>
  </div>

  <ToolPanel />
</template>
