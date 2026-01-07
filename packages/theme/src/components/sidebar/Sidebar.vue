<script setup lang='ts'>
import { animate, motion, useMotionValue } from 'motion-v'
import { ref, useTemplateRef, watch } from 'vue'
import GlassMask from '#/components/GlassMask.vue'
import { useSidebarControl, useSidebarMenus } from '#/controller/sidebar'
import { useEventListener } from '#/hooks'
import SidebarGroup from './SidebarGroup.vue'

const { isOpen, close } = useSidebarControl()
const { sidebarMenus } = useSidebarMenus()

const show = ref(isOpen.value)
const x = useMotionValue('-100%')

watch(
  () => isOpen.value,
  opened => {
    if (opened) {
      show.value = true
      animate(x, '0%', { type: 'spring', duration: 0.6 })
    } else {
      animate(x, '-100%', {
        ease: 'backIn',
        duration: 0.6,
        onComplete() {
          show.value = false
        }
      })
    }
  }
)

const sidebar = useTemplateRef('sidebar')
const { addEventListener } = useEventListener()

addEventListener(
  () => sidebar.value?.$el,
  'click',
  event => {
    for (const path of event.composedPath()) {
      const node = path as HTMLElement
      if (node === document.body) break
      if (node.getAttribute('data-role') === 'route') {
        close()
        break
      }
    }
  }
)
</script>

<template>
  <div
    v-show="show"
    class="inset-0 fixed z-[--z-index-sidebar]"
    data-role="sidebar"
  >
    <motion.aside
      ref="sidebar"
      class="flex-col w-80 inset-y-0 left-0 absolute z-20 isolate"
      :style="{ x }"
    >
      <div class="px-6 py-8 flex-1 overflow-x-hidden overflow-y-auto">
        <SidebarGroup
          v-for="(item, index) in sidebarMenus"
          :key="index"
          :item="item"
        />
      </div>
      <div class="sidebar-background w-100 inset-y-0 right-0 absolute -z-1">
        <GlassMask style="--fit-size: contain" />
      </div>
    </motion.aside>
    <div
      class="bg-black/20 inset-0 absolute z-10"
      @click="close"
    ></div>
  </div>
</template>
