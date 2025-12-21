<script setup lang='ts'>
import { useFPS } from '@repo/utils/hooks'
import { shallowRef, watch } from 'vue'
import DocOutline from '#/components/doc/DocOutline.vue'
import { Popover } from '#/components/popover'
import { useLayoutContext } from '#/controller/layout.ts'
import { useSidebarControl } from '#/controller/sidebar.ts'
import { BookOpen, PanelLeftClose, PanelLeftOpen } from '#/icons'
import BackToTop from './BackToTop.vue'
import GlassMask from './GlassMask.vue'
import ScrollIndicator from './ScrollIndicator.vue'
import SidebarTrigger from './sidebar/SidebarTrigger.vue'

defineProps<{ aside?: boolean }>()

const { isMobile, isTriggerSentinel } = useLayoutContext()

const { isOpen: sidebarOpened, close: closeSidebar } = useSidebarControl()

const outlineOpened = shallowRef(false)

watch(isMobile, () => (outlineOpened.value = false))

watch(
  () => isTriggerSentinel.value,
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

const { fps } = useFPS()
</script>

<template>
  <div
    class="toolpanel"
    :data-aside="aside"
    :data-show="isTriggerSentinel"
  >
    <div class="rounded-5 flex flex-col gap-1">
      <SidebarTrigger class="tool-button" title="侧边导航">
        <PanelLeftOpen v-if="sidebarOpened" />
        <PanelLeftClose v-else />
      </SidebarTrigger>

      <Popover
        v-if="isMobile"
        v-model:open="outlineOpened"
        :delay-open-frame="2"
        :keep-alive="true"
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
            title="本地导航"
            type="button"
          >
            <BookOpen />
          </button>
        </template>

        <div
          class="p-4 min-w-60 relative isolate"
          @click="onOutlineClick"
        >
          <DocOutline />
          <GlassMask class="rounded-4 inset-0 absolute -z-1" />
        </div>
      </Popover>


      <div class="text-6 text-teal flex size-10 flex-center">
        <ScrollIndicator />
      </div>

      <div class="text-teal flex-col size-10 items-center justify-between">
        <span class="text-3 leading-[1]">fps</span>
        <span class="text-14px leading-6">{{ fps }}</span>
      </div>

      <BackToTop />
    </div>
    <GlassMask class="rounded-5 inset-0 absolute -z-1" />
  </div>
</template>
