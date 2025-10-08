<script setup lang='ts'>
import Navbar from '#/components/navbar/Navbar.vue'
import Outline from '#/components/Outline.vue'
import Sidebar from '#/components/sidebar/Sidebar.vue'
import { useLayoutCtx } from '#/controller/layout.ts'

const { isMobile, isDesktop } = useLayoutCtx()
</script>

<template>
  <Navbar />
  <Sidebar v-if="isMobile" />
  <div class="pt-[--navbar-height]">
    <div class="layout-doc">
      <main id="content" class="doc-content">
        <div class="px-8 pb-32 flex-1 min-w-0">
          <Content class="vp-doc" />
        </div>

        <template v-if="isDesktop">
          <div class="pl-8 w-64">
            <aside class="doc-aside">
              <div class="aside-content">
                <Outline />
                <div class="flex-1"></div>
              </div>
            </aside>
          </div>
          <div id="bottom-sentry" class="h-px inset-x-0 bottom-px absolute"></div>
        </template>
      </main>
    </div>
  </div>
</template>
