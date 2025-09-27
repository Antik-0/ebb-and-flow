<script setup lang='ts'>
import { useEventListener } from '@repo/utils/hooks'
import { animate, motion, useMotionValue } from 'motion-v'
import { ref, useTemplateRef, watch } from 'vue'
import { useSidebarControl, useSidebarMenu } from '#/controller/sidebar.ts'
import { SidebarGroup, SidebarItem } from './sidebar'

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
  },
  {
    immediate: true
  }
)

const { menus } = useSidebarMenu()

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
    :data-show="show"
  >
    <motion.aside
      ref="sidebar"
      class="flex-col max-w-80 w-[calc(100vw-64px)] inset-y-0 left-0 absolute z-20 isolate"
      :style="{ x }"
    >
      <slot name="sidebar-header"></slot>

      <div class="p-8 flex-1 overflow-x-hidden overflow-y-auto">
        <SidebarGroup v-for="(item, index) in menus" :key="index">
          <SidebarItem :item="item" :level="1" />
        </SidebarGroup>
      </div>

      <slot name="sidebar-footer"></slot>

      <div class="bg-[--sidebar-bg-color] inset-y-0 right-0 absolute -left-25 -z-1">
      </div>
    </motion.aside>

    <div
      class="bg-[--sidebar-mask-bg-color] inset-0 absolute z-10"
      @click="close"
    ></div>
  </div>
</template>
