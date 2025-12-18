<script setup lang='ts'>
import { computed, shallowRef } from 'vue'
import ImageViewer from '#/components/ImageViewer.vue'
import Navbar from '#/components/navbar/Navbar.vue'
import Sidebar from '#/components/sidebar/Sidebar.vue'
import ToolPanel from '#/components/ToolPanel.vue'
import ViewportSentinel from '#/components/ViewportSentinel.vue'
import { provideLayoutCtx, useLayout } from '#/controller/layout'

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
