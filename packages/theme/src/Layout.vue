<script setup lang='ts'>
import { useResizeObserver } from '@repo/utils/hooks'
import { useData } from 'vitepress'
import {
  computed,
  onMounted,
  provide,
  shallowRef,
  useTemplateRef,
  watch,
  watchEffect
} from 'vue'
import { useThemeConfig } from '#/shared'
import { createMeteorAnimation } from './animation/meteor'
import { createSakuraAnimation } from './animation/sakura'
import Background from './components/Background.vue'
import TeleportToBody from './components/TeleportToBody.vue'
import ViewportSentinel from './components/ViewportSentinel.vue'
import { LayoutCtx, useLayout } from './controller/layout'
import LayoutDoc from './layout/LayoutDoc.vue'
import LayoutHome from './layout/LayoutHome.vue'

const { layout, isMobile, isDesktop, isLargeScreen } = useLayout()
const themeConfig = useThemeConfig()

const { isDark } = useData()

const animationCanvas = useTemplateRef('animation')

const { onWindowResize } = useResizeObserver()
onWindowResize(() => {
  const canvas = animationCanvas.value
  if (!canvas) return

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
})

const meteorAnimation = createMeteorAnimation()
const sakuraAnimation = createSakuraAnimation(themeConfig.value.sakura)

watch(animationCanvas, animationHandle, { once: true })
onMounted(watchEffect(animationHandle))

function animationHandle() {
  const canvas = animationCanvas.value
  if (!canvas) return

  if (isDark.value || layout.value === 'home') {
    sakuraAnimation.stop()
    // meteorAnimation.start(canvas)
  } else {
    meteorAnimation.stop()
    // sakuraAnimation.start(canvas)
  }
}

const showToolPanel = shallowRef(false)
function onSentinelChange(visible: boolean) {
  showToolPanel.value = !visible
}

provide(LayoutCtx, {
  isMobile,
  isDesktop,
  isLargeScreen,
  showToolPanel: computed(() => showToolPanel.value)
})
</script>

<template>
  <LayoutHome v-if="layout === 'home'" :avatar="themeConfig.avatar" />
  <LayoutDoc v-else />
  <Background :is-home="layout === 'home'" />
  <ViewportSentinel :top="200" @visible-change="onSentinelChange" />

  <TeleportToBody id="animation">
    <canvas ref="animation" class="inset-0 fixed -z-1"></canvas>
  </TeleportToBody>
</template>
