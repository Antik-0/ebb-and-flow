<script setup lang='ts'>
import { useSidebarControl } from '#/controller/sidebar.ts'
import { BookOpen, PanelLeftClose, PanelLeftOpen } from '#/icons'
import BackToTop from './BackToTop.vue'

const { isOpen, toggle } = useSidebarControl()
</script>

<template>
  <div class="p-1 rounded-5 right-2 top-1/2 fixed z-[--z-index-toolpanel] overflow-hidden">
    <div class="flex flex-col gap-1">
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

      <button class="action-button" type="button">
        <BookOpen />
      </button>

      <BackToTop />
    </div>

    <div class="panle-background"></div>
  </div>
</template>

<style>
.action-button {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: var(--c-text-2);
  cursor: pointer;
  transition: color 200ms ease;

  &:hover {
    color: var(--c-brand-3);
  }
}

.panle-background {
  position: absolute;
  inset: 0;
  z-index: -1;
  background-color: var(--c-bg-navbar);
  box-shadow:
    0 2px 10px 1px hsl(0 0% 67% / 0.1),
    inset 0 0 10px 4px hsl(0 0% 80% / 0.1),
    inset 0 0 50px 4px hsl(0 0% 60% / 0.1),
    inset -1px -1px 4px hsl(0 0% 100% / 0.1);
}
</style>
