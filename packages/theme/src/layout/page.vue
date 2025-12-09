<script setup lang='ts'>
import type { Page } from '#/types'
import { usePageTitle } from '@repo/utils/hooks'
import { useRouter } from 'nuxt/app'
import { computed, shallowRef, watch } from 'vue'
import Avatar from '#/components/Avatar.vue'
import CubeAvatar from '#/components/CubeAvatar.vue'
import DocFooter from '#/components/DocFooter.vue'
import DocOutline from '#/components/DocOutline.vue'
import ImageViewer from '#/components/ImageViewer.vue'
import Menubar from '#/components/menubar/Menubar.vue'
import Navbar from '#/components/Navbar.vue'
import SocialLinks from '#/components/SocialLinks.vue'
import Sidebar from '#/components/sidebar/Sidebar.vue'
import SidebarTrigger from '#/components/sidebar/SidebarTrigger.vue'
import ThemeToggle from '#/components/ThemeToggle.vue'
import ToolPanel from '#/components/ToolPanel.vue'
import ViewportSentinel from '#/components/ViewportSentinel.vue'
import { provideLayoutCtx, useLayout } from '#/controller/layout'
import { providePageToc } from '#/controller/outline'
import { Menu } from '#/icons'
import NotFound from '#/NotFound.vue'
import { useTheme } from '#/useTheme'

defineOptions({ name: 'LayoutPage' })

const props = defineProps<{ page?: Page }>()

const { theme } = useTheme()

// 动态修改页面标题
const defaultTitleTemplate = `<title> | ${theme.title}`

const pageTitle = usePageTitle(props.page?.title, {
  titleTemplate: theme?.titleTemplate ?? defaultTitleTemplate
})

watch(
  () => props.page,
  page => {
    pageTitle.value = page?.title ?? theme.notFoundTitle ?? '404'
  }
)

const { isDesktop, isMobile, isLargeScreen } = useLayout()

const router = useRouter()

const showToolPanel = shallowRef(false)
function onSentinelChange(visible: boolean) {
  showToolPanel.value = !visible
}

function backToHome() {
  router.push('/')
}

providePageToc({
  value: computed(() => props.page?.toc ?? [])
})

provideLayoutCtx({
  isDesktop,
  isMobile,
  isLargeScreen,
  showToolPanel: computed(() => showToolPanel.value)
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

    <div class="pt-[--h-navbar]">
      <div class="layout-doc">
        <main class="doc-content">
          <template v-if="page">
            <div class="px-8 pb-24 flex-1 min-w-0">
              <article id="content" class="ebb-doc">
                <slot></slot>
              </article>
              <DocFooter :last-updated="page.lastUpdated" />
            </div>

            <div v-if="isDesktop" class="pl-8 w-64">
              <aside class="doc-aside">
                <div class="aside-content">
                  <DocOutline />
                  <div class="flex-1"></div>
                </div>
              </aside>
            </div>
          </template>

          <template v-else>
            <NotFound />
          </template>
        </main>

        <div v-if="isLargeScreen" class="pl-2">
          <ToolPanel aside />
        </div>
      </div>
    </div>

    <ToolPanel v-if="!isLargeScreen" />
    <ViewportSentinel :top="200" @visible-change="onSentinelChange" />
    <ImageViewer />
  </div>
</template>
