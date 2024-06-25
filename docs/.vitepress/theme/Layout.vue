<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import EAFHome from './components/EAFHome.vue'
import { useData, useRoute, useRouter, withBase } from 'vitepress'
import { computed, onMounted } from 'vue'
import { useViewTransition, useMeteorAnimation } from './hooks'

defineOptions({ name: 'EAFLayout' })

const { frontmatter, site } = useData()
const route = useRoute()

const isCustom = computed(() => {
  const isRoot = route.path === site.value.base
  const layoutValue = frontmatter.value.layout
  return isRoot && layoutValue === 'EAF-HOME'
})

const { viewTransitionStart, viewTransitionEnd } = useViewTransition()
const router = useRouter()

interface RouterGuard {
  onBeforeRouteChange: typeof router.onBeforePageLoad
  onAfterRouteChanged: typeof router.onAfterRouteChanged
}

const routerGuard: RouterGuard = {
  onBeforeRouteChange(to) {
    // 主页滑出
    if (to === withBase('/guide/reactive')) {
      viewTransitionStart(true)
    }

    // 主页滑入
    if (to === site.value.base) {
      viewTransitionStart(false)
    }
  },
  onAfterRouteChanged(to) {
    viewTransitionEnd()
  }
}

Object.assign(router, routerGuard)

onMounted(() => {
  // use 流星动画
  useMeteorAnimation()
})
</script>

<template>
  <EAFHome v-if="isCustom" />
  <DefaultTheme.Layout v-else />
</template>
