<script setup lang='ts'>
import { useEventListener } from '@repo/utils/hooks'
import { animate, motion, useMotionValue } from 'motion-v'
import { ref, useTemplateRef, watch } from 'vue'
import { useSidebar, useSidebarControl } from '#/controller/sidebar.ts'
import SidebarGroup from './SidebarGroup.vue'

const { isOpen, close } = useSidebarControl()

const show = ref(isOpen.value)
const x = useMotionValue('-100%')

watch(
  () => isOpen.value,
  value => {
    if (value) {
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

const { menus } = useSidebar()

const sidebar = useTemplateRef('sidebar')
const { addEventListener } = useEventListener()

addEventListener(
  () => sidebar.value?.$el,
  'click',
  event => {
    for (const path of event.composedPath()) {
      const node = path as HTMLElement
      if (node === document.body) break
      if (node.getAttribute('data-role') === 'link') {
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
  >
    <motion.aside
      ref="sidebar"
      class="flex-col w-80 inset-y-0 left-0 absolute z-20 isolate"
      :style="{ x }"
    >
      <div class="p-8 flex-1 overflow-x-hidden overflow-y-auto">
        <SidebarGroup
          v-for="(item, index) in menus"
          :key="index"
          :item="item"
        />
      </div>
      <div class="bg-[--c-bg-sidebar] w-100 inset-y-0 right-0 absolute -z-1"></div>
    </motion.aside>
    <div
      class="bg-black/40 inset-0 absolute z-10"
      @click="close"
    ></div>
  </div>
</template>
