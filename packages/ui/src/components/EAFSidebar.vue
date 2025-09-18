<script setup lang='ts'>
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useSpring
} from 'motion-v'
import { computed, ref, watch } from 'vue'
import { useSidebarControl } from '#/controller/sidebar.ts'

const { isOpen, close } = useSidebarControl()

const delayShow = ref(isOpen.value)
const show = computed(() => isOpen.value || delayShow.value)

const _x = useMotionValue(-100)
const x = useSpring(_x, { duration: 2 })

useMotionValueEvent(x, 'animationComplete', () => {
  console.log('动画结束')
})

watch(
  () => isOpen.value,
  value => {
    if (value) {
      delayShow.value = true
      _x.set(0)
    } else {
      _x.set(-100)
    }
  },
  { immediate: true }
)
</script>

<template>
  <div v-show="show" class="inset-0 fixed z-[--z-index-sidebar]">
    <motion.aside
      class="max-w-80 w-[calc(100vw-64px)] inset-y-0 left-0 absolute z-20"
      :style="{ x }"
      @animation-complete="() => delayShow = isOpen"
    >
      <div class="p-8 bg-[--sidebar-bg-color] size-full">
      </div>
    </motion.aside>

    <motion.div
      class="bg-[--sidebar-mask-bg-color] inset-0 absolute z-10"
      @click="close"
    />
  </div>
</template>
