<script setup lang='ts'>
import { animate, motion, useMotionValue } from 'motion-v'
import { ref, watch } from 'vue'
import { useSidebarControl } from '#/controller/sidebar.ts'

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
</script>

<template>
  <div
    v-show="show"
    class="inset-0 fixed z-[--z-index-sidebar]"
    :data-show="show"
  >
    <motion.aside
      class="max-w-80 w-[calc(100vw-64px)] inset-y-0 left-0 absolute z-20 isolate"
      :style="{ x }"
    >
      <div class="bg-[--sidebar-bg-color] inset-y-0 right-0 absolute -left-25 -z-1">
      </div>
      <div class="p-8 size-full"></div>
    </motion.aside>

    <div
      class="bg-[--sidebar-mask-bg-color] inset-0 absolute z-10"
      @click="close"
    ></div>
  </div>
</template>
