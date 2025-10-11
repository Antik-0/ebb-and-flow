<script setup lang='ts'>
import { useLayoutCtx } from '#/controller/layout.ts'
import { useSidebarControl } from '#/controller/sidebar.ts'
import { PanelLeftClose, PanelLeftOpen } from '#/icons'
import BackToTop from './BackToTop.vue'
import Outline from './Outline.vue'

const { isMobile, showToolPanel } = useLayoutCtx()

const { isOpen, toggle } = useSidebarControl()
</script>

<template>
  <div
    class="toolpanel"
    :data-show="showToolPanel"
  >
    <div class="rounded-5 flex flex-col gap-1">
      <button
        :aria-checked="isOpen"
        class="action-button"
        role="switch"
        type="button"
        @click="toggle"
      >
        <PanelLeftOpen v-if="isOpen" />
        <PanelLeftClose v-else />
      </button>

      <Outline v-if="isMobile" />

      <BackToTop />
    </div>

    <div class="panle-background rounded-5"></div>
  </div>
</template>
