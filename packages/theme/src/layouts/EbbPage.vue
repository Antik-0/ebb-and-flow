<script setup lang='ts'>
import { onMounted } from 'vue'
import ImageViewer from '#/components/ImageViewer.tsx'
import Navbar from '#/components/navbar/Navbar.tsx'
import Sidebar, {
  SidebarContainer,
  SidebarOverlay
} from '#/components/sidebar/Sidebar.tsx'
import ToolPanel from '#/components/ToolPanel.tsx'
import ViewportSentinel from '#/components/ViewportSentinel.vue'
import {
  provideLayout,
  setHtmlLayout,
  useLayoutState,
  usePage
} from '#/controller/layout'
import { useUpdateMenuActive } from '#/controller/menus'

const { isDesktop, isMobile, isTriggerSentinel } = useLayoutState()

const { isLoading } = usePage()

function onSentinelVisibleChange(visible: boolean) {
  isTriggerSentinel.value = !visible
}

useUpdateMenuActive()

onMounted(() => setHtmlLayout('page'))

provideLayout({
  isDesktop,
  isMobile,
  isTriggerSentinel
})
</script>

<template>
  <div class="ebb-page" data-role="page">
    <Navbar />

    <main class="grid-area-[main] min-w-0 md:p-4" data-role="main">
      <section class="p-6 bg-[--c-bg-content] min-w-0 w-full relative md:rounded-4">
        <slot></slot>

        <div
          v-if="isLoading"
          class="p-8 bg-black/60 inset-0 absolute"
        >
          <slot name="loading"></slot>
        </div>
      </section>
    </main>

    <SidebarContainer>
      <Sidebar />
      <SidebarOverlay />
    </SidebarContainer>

    <div class="aside-container" data-role="aside">
      <ToolPanel />
      <ImageViewer />
    </div>

    <ViewportSentinel
      :top="200"
      @visible-change="onSentinelVisibleChange"
    />
  </div>
</template>
