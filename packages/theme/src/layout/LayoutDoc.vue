<script setup lang='ts'>
import DocFooter from '#/components/DocFooter.vue'
import DocOutline from '#/components/DocOutline.vue'
import Navbar from '#/components/navbar/Navbar.vue'
import Sidebar from '#/components/sidebar/Sidebar.vue'
import ToolPanel from '#/components/toolPanel/ToolPanel.vue'
import { useLayoutCtx } from '#/controller/layout.ts'

const { isMobile, isDesktop } = useLayoutCtx()
</script>

<template>
  <Navbar />
  <Sidebar v-if="isMobile" />
  <div class="pt-[--navbar-height]">
    <div class="layout-doc">
      <main id="content" class="doc-content">
        <div class="px-8 pb-24 flex-1 min-w-0">
          <Content class="vp-doc" />
          <DocFooter />
        </div>

        <template v-if="isDesktop">
          <div class="pl-8 w-64">
            <aside class="doc-aside">
              <div class="aside-content">
                <DocOutline />
                <div class="flex-1"></div>
              </div>
            </aside>
          </div>
          <div id="bottom-sentry" class="h-px inset-x-0 bottom-px absolute"></div>
        </template>
      </main>
    </div>
  </div>
  <ToolPanel />
</template>
