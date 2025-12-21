<script setup lang='ts'>
import { computed, ref } from 'vue'
import ImageViewer from '#/components/ImageViewer.vue'
import Navbar from '#/components/navbar/Navbar.vue'
import Sidebar from '#/components/sidebar/Sidebar.vue'
import ToolPanel from '#/components/ToolPanel.vue'
import ViewportSentinel from '#/components/ViewportSentinel.vue'
import {
  provideLayoutContext,
  useLayout,
  usePageLoading
} from '#/controller/layout'

const { isDesktop, isMobile, isLargeScreen } = useLayout()

const { isLoading } = usePageLoading()

const isTriggerSentinel = ref(false)

function onSentinelVisibleChange(visible: boolean) {
  isTriggerSentinel.value = !visible
}

provideLayoutContext({
  isDesktop,
  isMobile,
  isLargeScreen,
  isTriggerSentinel: computed(() => isTriggerSentinel.value)
})
</script>

<template>
  <div class="min-h-screen">
    <Navbar />
    <Sidebar />

    <div class="ebb-page" data-role="page">
      <main class="page-content">
        <slot></slot>

        <div
          v-if="isLoading"
          class="p-8 bg-black/60 inset-0 absolute"
        >
          <slot name="loading">
          </slot>
        </div>
      </main>

      <div v-if="isLargeScreen" class="pl-2">
        <ToolPanel aside />
      </div>
    </div>

    <ToolPanel v-if="!isLargeScreen" />
    <ImageViewer />

    <ViewportSentinel
      :top="200"
      @visible-change="onSentinelVisibleChange"
    />
  </div>
</template>
