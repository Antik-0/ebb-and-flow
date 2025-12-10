<script setup lang='ts'>
import { usePageTitle } from '@repo/utils/hooks'
import { computed, shallowRef, watch } from 'vue'
import ImageViewer from '#/components/ImageViewer.vue'
import Navbar from '#/components/navbar/Navbar.vue'
import Sidebar from '#/components/sidebar/Sidebar.vue'
import ToolPanel from '#/components/ToolPanel.vue'
import ViewportSentinel from '#/components/ViewportSentinel.vue'
import { provideLayoutCtx, useLayout, usePageData } from '#/controller/layout'
import { useTheme } from '#/useTheme'

defineOptions({ name: 'LayoutPage' })

const { theme } = useTheme()
const { page } = usePageData()

const defaultTitleTemplate = `<title> | ${theme.title}`
const pageTitle = usePageTitle(page.value?.title, {
  titleTemplate: theme?.titleTemplate ?? defaultTitleTemplate
})

watch(
  () => page.value,
  page => {
    pageTitle.value = page?.title ?? theme.notFoundTitle ?? '404'
  },
  { immediate: true }
)

const { isDesktop, isMobile, isLargeScreen } = useLayout()

const showToolPanel = shallowRef(false)
function onSentinelChange(visible: boolean) {
  showToolPanel.value = !visible
}

provideLayoutCtx({
  isDesktop,
  isMobile,
  isLargeScreen,
  showToolPanel: computed(() => showToolPanel.value)
})
</script>

<template>
  <div class="min-h-screen">
    <Navbar />
    <Sidebar />

    <div class="pt-[--h-navbar]">
      <div class="layout-page" data-role="page">
        <main class="page-content">
          <slot></slot>
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
