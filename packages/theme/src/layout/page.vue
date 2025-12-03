<script setup lang='ts'>
import { useRouter } from 'nuxt/app'
import { computed } from 'vue'
import Avatar from '#/components/Avatar.vue'
import CubeAvatar from '#/components/CubeAvatar.vue'
import ImageViewer from '#/components/ImageViewer.vue'
import Menubar from '#/components/menubar/Menubar.vue'
import Navbar from '#/components/Navbar.vue'
import SocialLinks from '#/components/SocialLinks.vue'
import Sidebar from '#/components/sidebar/Sidebar.vue'
import SidebarTrigger from '#/components/sidebar/SidebarTrigger.vue'
import ThemeToggle from '#/components/ThemeToggle.vue'
import { provideLayoutCtx, useLayout } from '#/controller/layout'
import { Menu } from '#/icons'
import { useTheme } from '#/useTheme'

const { isDesktop, isMobile, isLargeScreen } = useLayout()

const { theme } = useTheme()
const router = useRouter()

function backToHome() {
  router.push('/')
}

provideLayoutCtx({
  isDesktop,
  isMobile,
  isLargeScreen,
  showToolPanel: computed(() => false)
})
</script>

<template>
  <div class="min-h-screen">
    <Navbar>
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
            :avatar="theme.avatar"
            class="mx-auto"
            :style="{
              '--size': '40px',
              '--rounded': '4px'
            }"
            @click="backToHome"
          />
        </div>
      </template>

      <template #menu>
        <Avatar
          v-if="isMobile"
          :avatar="theme.avatar"
          @click="backToHome"
        />
        <Menubar v-else />
      </template>

      <template #end-action>
        <div class="pr-6 flex items-center justify-between">
          <ThemeToggle />
          <SocialLinks />
        </div>
      </template>
    </Navbar>

    <Sidebar :glass-mask="isDesktop" />

    <div class="pt-[--navbar-height]">
      <div class="layout-doc">
        <main id="content" class="doc-content">
          <div class="px-8 pb-24 flex-1 min-w-0">
            <div class="vp-doc">
              <slot name="content"></slot>
            </div>
            <!-- <DocFooter /> -->
          </div>

          <div v-if="isDesktop" class="pl-8 w-64">
            <aside class="doc-aside">
              <div class="aside-content">
                <!-- <DocOutline /> -->
                <div class="flex-1"></div>
              </div>
            </aside>
          </div>
        </main>

        <div v-if="isLargeScreen" class="pl-2">
          <!-- <ToolPanel aside /> -->
        </div>
      </div>
    </div>

    <!-- <ToolPanel v-if="!isLargeScreen" /> -->
    <ImageViewer />
  </div>
</template>
