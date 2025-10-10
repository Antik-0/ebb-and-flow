<script setup lang='ts'>
import type { Timer } from '#/types'
import { useData } from 'vitepress'
import {
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  watch,
  watchEffect
} from 'vue'
import TeleportToBody from './TeleportToBody.vue'

const props = defineProps<{
  isHome?: boolean
  homeBackground?: string[]
  darkBackground?: string[]
  lightBackground?: string[]
}>()

interface BackgroundImage {
  src: string
  motion: string
}

const { isDark } = useData()
const backgrounds = ref<BackgroundImage[]>([])

watch(
  [() => isDark.value, () => props.isHome],
  () => {
    let result = []
    if (props.isHome) {
      result = props.homeBackground ?? []
    } else {
      result =
        (isDark.value ? props.darkBackground : props.lightBackground) ?? []
    }
    backgrounds.value = result.map(src => ({ src, motion: '' }))
  },
  { immediate: true }
)

const activeIndex = shallowRef(0)
let timer: Timer | null = null
const IntervalTime = 60_000

function onMotionFrame() {
  const length = backgrounds.value.length
  const currIndex = activeIndex.value
  const nextIndex = (currIndex + 1) % length
  activeIndex.value = nextIndex

  backgrounds.value[currIndex]!.motion = 'exit'
  backgrounds.value[nextIndex]!.motion = 'enter'
}

onMounted(() => {
  watchEffect(() => {
    const length = backgrounds.value.length
    const enableMotion = length > 1

    activeIndex.value = 0
    timer && window.clearInterval(timer)

    if (enableMotion) {
      timer = window.setInterval(onMotionFrame, IntervalTime)
    }
  })
})

onBeforeUnmount(() => {
  timer && window.clearInterval(timer)
})
</script>

<template>
  <TeleportToBody id="background">
    <div class="grid inset-0 fixed isolate -z-1">
      <picture
        v-for="(item, index) in backgrounds"
        :key="index"
        class="background-image"
        :data-active="index === activeIndex"
        :data-motion="item.motion"
      >
        <img
          alt="background"
          class="size-full object-cover"
          :src="item.src"
        />
      </picture>
    </div>
  </TeleportToBody>
</template>
