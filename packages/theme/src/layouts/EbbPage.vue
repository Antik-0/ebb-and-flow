<script setup lang='ts'>
import { useRouter } from 'nuxt/app'
import { computed, onMounted, ref, watch } from 'vue'
import ImageViewer from '#/components/ImageViewer.vue'
import Navbar from '#/components/navbar/Navbar.tsx'
import Sidebar, {
  SidebarContainer,
  SidebarOverlay
} from '#/components/sidebar/Sidebar.tsx'
import ToolPanel from '#/components/ToolPanel.vue'
import ViewportSentinel from '#/components/ViewportSentinel.vue'
import { layoutProvider, useLayout, usePageLoading } from '#/controller/layout'
import { updateActiveLink } from '#/controller/menus'

const { isDesktop, isMobile, isLargeScreen } = useLayout()

const { isLoading } = usePageLoading()

const isTriggerSentinel = ref(false)

function onSentinelVisibleChange(visible: boolean) {
  isTriggerSentinel.value = !visible
}

const router = useRouter()

onMounted(() => {
  watch(
    () => router.currentRoute.value,
    currentRoute => {
      updateActiveLink(currentRoute.path)
    },
    { immediate: true }
  )
})

layoutProvider({
  isDesktop,
  isMobile,
  isLargeScreen,
  isTriggerSentinel: computed(() => isTriggerSentinel.value)
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


    <ToolPanel v-if="!isLargeScreen" />
    <ImageViewer />

    <ViewportSentinel
      v-if="false"
      :top="200"
      @visible-change="onSentinelVisibleChange"
    />
  </div>
</template>
