<script setup lang="ts">
import { sleep } from '@repo/utils'
import { useData, useRoute, useRouter, withBase } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { computed, onMounted, watch } from 'vue'
import EAFHome from './components/EAFHome.vue'
import {
  useHomeViewTransition,
  useMeteorAnimation,
  useSakuraAnimation,
  useToggleAppearance
} from './hooks'

defineOptions({ name: 'EAFLayout' })

const { frontmatter, site } = useData()
const route = useRoute()

const isCustom = computed(() => {
  const isRoot = route.path === site.value.base
  const layoutValue = frontmatter.value.layout
  return isRoot && layoutValue === 'EAF-HOME'
})

const setDataIsHome = () => {
  if (isCustom.value) {
    document.documentElement.setAttribute('data-isHome', 'true')
  } else {
    document.documentElement.removeAttribute('data-isHome')
  }
}

watch(isCustom, setDataIsHome)

onMounted(setDataIsHome)

const { viewTransitionStart } = useHomeViewTransition()
const router = useRouter()

interface RouterGuard {
  onBeforeRouteChange: typeof router.onBeforeRouteChange
}

Object.assign(router, {
  async onBeforeRouteChange(to) {
    const base = site.value.base
    const isBase = route.path === base
    if (isBase && to === withBase('/vue/guide/reactive')) {
      // 主页滑出
      viewTransitionStart(true)
      // 为了保证能正确获取当前路由的快照，延迟一点时间再进行路由跳转
      await sleep(100)
    } else if (to === base) {
      // 主页滑入
      viewTransitionStart(false)
      await sleep(100)
    }
  }
} as RouterGuard)

onMounted(() => {
  // use 流星动画
  useMeteorAnimation()
})

useToggleAppearance()

const { install } = useSakuraAnimation()

onMounted(install)
</script>

<template>
  <EAFHome v-if="isCustom" />
  <DefaultTheme.Layout v-else />
</template>
