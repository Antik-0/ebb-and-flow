<script setup lang='ts'>
import type { Timer } from '#/types'
import { useData } from 'vitepress'
import { onBeforeUnmount, onMounted, ref, watch, watchEffect } from 'vue'
import { useThemeConfig } from '#/shared'
import TeleportToBody from './TeleportToBody.vue'

const props = defineProps<{
  isHome?: boolean
}>()

interface Background {
  src: string
  motion: string
}

const themeConfig = useThemeConfig()

const ThemeBg = themeConfig.value.backgrounds ?? {}

const { isDark } = useData()
const backgrounds = ref<Background[]>([])

watch(
  [() => isDark.value, () => props.isHome],
  () => {
    let result: string[] = []
    if (isDark.value || props.isHome) {
      result = ThemeBg.dark ?? []
    } else {
      result = ThemeBg.light ?? []
    }
    if (props.isHome) {
      result = result.slice(0, 1)
    }
    backgrounds.value = result.map(src => ({ src, motion: '' }))
  },
  { immediate: true }
)

const activeIndex = ref(0)
let timer: Timer | null = null

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
    const enableMotion = length > 1 && !props.isHome

    activeIndex.value = 0
    timer && window.clearInterval(timer)

    if (enableMotion) {
      timer = window.setInterval(onMotionFrame, ThemeBg.interval ?? 60_000)
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
