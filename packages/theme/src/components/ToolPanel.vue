<script setup lang='ts'>
import { shallowRef, watch } from 'vue'
import DocOutline from '#/components/DocOutline.vue'
import { Popover } from '#/components/popover'
import { useLayoutCtx } from '#/controller/layout.ts'
import { useSidebarControl } from '#/controller/sidebar.ts'
import { BookOpen, PanelLeftClose, PanelLeftOpen } from '#/icons'
import BackToTop from './BackToTop.vue'
import SidebarTrigger from './sidebar/SidebarTrigger.vue'

defineProps<{
  aside?: boolean
}>()

const { isMobile, showToolPanel } = useLayoutCtx()

const { isOpen: sidebarOpened, close: closeSidebar } = useSidebarControl()

const outlineOpened = shallowRef(false)

watch(
  () => showToolPanel.value,
  value => {
    if (value === false) {
      outlineOpened.value = false
      closeSidebar()
    }
  }
)

function onOutlineClick(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (target.tagName === 'A' || target.classList.contains('outline-item')) {
    outlineOpened.value = false
  }
}
</script>

<template>
  <div
    class="toolpanel"
    :data-aside="aside"
    :data-show="showToolPanel"
  >
    <div class="rounded-5 flex flex-col gap-1">
      <SidebarTrigger class="tool-button">
        <PanelLeftOpen v-if="sidebarOpened" />
        <PanelLeftClose v-else />
      </SidebarTrigger>

      <Popover
        v-if="isMobile"
        v-model:open="outlineOpened"
        :mask-closable="false"
        :offset="20"
        placement="left"
        fixed
      >
        <template #trigger>
          <button
            :aria-checked="outlineOpened"
            aria-label="outline-button"
            class="tool-button"
            role="switch"
            type="button"
          >
            <BookOpen />
          </button>
        </template>

        <div
          class="glass-mask p-4 rounded-4 min-w-60"
          @click="onOutlineClick"
        >
          <DocOutline />
        </div>
      </Popover>

      <BackToTop />
    </div>

    <div class="glass-mask rounded-5 inset-0 absolute -z-1"></div>
  </div>
</template>
