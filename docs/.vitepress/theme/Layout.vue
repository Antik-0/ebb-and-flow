<script setup lang="ts">
import { Layout as ThemeLayout } from '@repo/theme'
import { enableTransitions } from '@repo/utils'
import { useData, useRoute, useRouter, withBase } from 'vitepress'
import AvatarURL from '@/avatar.png'
import lightBg1 from '@/wallhaven-6lq3m7.webp'
import darkBg2 from '@/wallhaven-8g3gkk.webp'
import darkBg1 from '@/wallhaven-rrwvdq.webp'

// import { useAnimation } from '@repo/motion'
// import { computed } from 'vue'
// import sakuraURL from '@/sakura.png'

defineOptions({ name: 'EAFLayout' })

async function viewTransitionStart(type: 'enter' | 'exit') {
  if (!enableTransitions()) return

  const html = document.documentElement
  const transition = document.startViewTransition(() => {
    html.setAttribute('data-slide', type)
  })

  await transition.finished
}

const route = useRoute()
const router = useRouter()
const { site, isDark } = useData()

interface RouterGuard {
  onBeforeRouteChange: typeof router.onBeforeRouteChange
}

Object.assign(router, {
  async onBeforeRouteChange(to) {
    const base = site.value.base
    const isBase = route.path === base
    if (isBase && to === withBase('/vue/guide/reactive')) {
      viewTransitionStart('exit')
    } else if (to === base) {
      viewTransitionStart('enter')
    }
  }
} as RouterGuard)

// useAnimation({
//   useSakura: computed(() => !isDark.value),
//   sakuaraSource: sakuraURL,
//   style: style => {
//     style.position = 'fixed'
//     style.inset = '0'
//     style.zIndex = '10'
//   }
// })
</script>

<template>
  <ThemeLayout
    :avatar="AvatarURL"
    :dark-background="[darkBg1]"
    :home-background="[darkBg1]"
    :light-background="[lightBg1]"
  />
</template>
