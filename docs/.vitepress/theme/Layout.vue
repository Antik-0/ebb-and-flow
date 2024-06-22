<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import EAFHome from './components/EAFHome.vue'
import { useData, useRoute, useRouter, withBase } from 'vitepress'
import { computed } from 'vue'
import { useViewTransition } from './hooks/useViewTransition'

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
    // 首页滑出
    if (to === withBase('/guide/reactive')) {
      viewTransitionStart(true)
    }

    // 首页滑入
    if (to === site.value.base) {
      viewTransitionStart(false)
    }
  },
  onAfterRouteChanged(to) {
    viewTransitionEnd()
  }
}

Object.assign(router, routerGuard)
</script>

<template>
  <EAFHome v-if="isCustom" />
  <DefaultTheme.Layout v-else />
</template>
