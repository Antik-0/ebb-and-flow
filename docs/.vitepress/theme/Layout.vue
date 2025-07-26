<script setup lang="ts">
import { useData, useRoute, useRouter, withBase } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { computed, onMounted } from 'vue'
import EAFHome from './components/EAFHome.vue'
import { useMeteorAnimation, useViewTransition } from './hooks'

defineOptions({ name: 'EAFLayout' })

const { frontmatter, site } = useData()
const route = useRoute()

const isCustom = computed(() => {
  const isRoot = route.path === site.value.base
  const layoutValue = frontmatter.value.layout
  return isRoot && layoutValue === 'EAF-HOME'
})

const { viewTransitionStart, sleep } = useViewTransition()
const router = useRouter()

interface RouterGuard {
  onBeforeRouteChange: typeof router.onBeforeRouteChange
}

Object.assign(router, {
  async onBeforeRouteChange(to) {
    // 主页滑出
    const base = site.value.base
    const isBase = route.path === base
    if (isBase && to === withBase('/vue/guide/reactive')) {
      viewTransitionStart(true)
      // 为了保证能正确获取当前路由的快照，延迟一点时间再进行路由跳转
      await sleep(100)
    }
    // 主页滑入
    else if (to === base) {
      viewTransitionStart(false)
      await sleep(100)
    }
  }
} as RouterGuard)

onMounted(() => {
  // use 流星动画
  useMeteorAnimation()
})
</script>

<template>
  <EAFHome v-if="isCustom" />
  <DefaultTheme.Layout v-else />
</template>
