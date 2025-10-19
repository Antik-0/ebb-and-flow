<script setup lang="ts">
import { Layout as ThemeLayout } from '@repo/theme'
import { enableTransitions } from '@repo/utils'
import { useData, useRoute, useRouter, withBase } from 'vitepress'

defineOptions({ name: 'EAFLayout' })

async function viewTransitionStart(type: 'enter' | 'exit') {
  if (!enableTransitions()) return

  const html = document.documentElement
  const transition = document.startViewTransition(() => {
    html.setAttribute('data-home', type)
  })

  await transition.finished
}

const route = useRoute()
const router = useRouter()
const { site } = useData()

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
</script>

<template>
  <ThemeLayout />
</template>
