<script setup lang='ts'>
import type { Timer } from '#/types'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import TeleportToBody from './TeleportToBody.vue'

const props = defineProps<{
  backgrounds: string[]
  interval?: number
}>()

const motions = ref<string[]>([])

watch(
  () => props.backgrounds.length,
  size => {
    motions.value = Array.from<string>({ length: size }).fill('')
  },
  { immediate: true }
)

const activeIndex = ref(0)
let timer: Timer | null = null

function onMotionFrame() {
  const length = props.backgrounds.length
  const currIndex = activeIndex.value
  const nextIndex = (currIndex + 1) % length
  activeIndex.value = nextIndex

  motions.value[currIndex] = 'exit'
  motions.value[nextIndex] = 'enter'
}

onMounted(() => {
  watch(
    () => props.backgrounds.length,
    length => {
      activeIndex.value = 0
      timer && window.clearInterval(timer)

      const enableMotion = length > 1
      if (enableMotion) {
        timer = window.setInterval(onMotionFrame, props.interval ?? 60_000)
      }
    }
  )
})

onBeforeUnmount(() => {
  timer && window.clearInterval(timer)
})
</script>

<template>
  <TeleportToBody id="background">
    <div class="grid inset-0 fixed isolate -z-1">
      <picture
        v-for="(source, index) in backgrounds"
        :key="index"
        class="background-image"
        :data-active="index === activeIndex"
        :data-motion="motions[index]"
      >
        <img
          alt="background"
          class="size-full object-cover"
          :src="source"
        />
      </picture>
    </div>
  </TeleportToBody>
</template>

<style>
.background-image {
  grid-area: 1 / 1;
  opacity: 0;
  z-index: -1;
  mix-blend-mode: plus-lighter;
}

.background-image[data-active='true'] {
  opacity: 1;
  z-index: 10;
}

.background-image[data-motion='enter'] {
  animation: cross-fade-enter 2s ease-out;
}

.background-image[data-motion='exit'] {
  animation: cross-fade-exit 2s ease-out;
}
</style>
