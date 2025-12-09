<script setup lang='ts'>
import type { Timer } from '#/types'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps<{
  pictures: string[]
  interval?: number
}>()

const motions = ref<string[]>([])
const defaultInterval = 60_000

const activeIndex = ref(0)
let timer: Timer | null = null

watch(
  () => props.pictures.length,
  size => {
    motions.value = Array.from<string>({ length: size }).fill('')
  },
  { immediate: true }
)

function onMotionFrame() {
  const length = props.pictures.length
  const currIndex = activeIndex.value
  const nextIndex = (currIndex + 1) % length
  activeIndex.value = nextIndex

  motions.value[currIndex] = 'leave'
  motions.value[nextIndex] = 'enter'
}

onMounted(() => {
  watch(
    () => props.pictures.length,
    length => {
      activeIndex.value = 0
      timer && window.clearInterval(timer)

      const enableMotion = length > 1
      if (enableMotion) {
        timer = window.setInterval(
          onMotionFrame,
          props.interval ?? defaultInterval
        )
      }
    }
  )
})

onBeforeUnmount(() => {
  timer && window.clearInterval(timer)
})
</script>

<template>
  <div aria-hidden="true" class="grid inset-0 fixed isolate -z-1">
    <picture
      v-for="(source, index) in pictures"
      :key="index"
      class="picture-image"
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
</template>

<style>
.picture-image {
  grid-area: 1 / 1;
  opacity: 0;
  z-index: -1;
  mix-blend-mode: plus-lighter;
  animation-duration: 2000ms;
  animation-timing-function: ease-out;
}

.picture-image[data-active='true'] {
  opacity: 1;
  z-index: 1;
}

.picture-image[data-motion='enter'] {
  animation-name: cross-fade-enter;
}

.picture-image[data-motion='leave'] {
  animation-name: cross-fade-leave;
}
</style>
