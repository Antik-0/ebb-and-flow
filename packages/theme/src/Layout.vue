<script setup lang='ts'>
import { onErrorCaptured, provide } from 'vue'
import Background from './components/Background.vue'
import { LayoutCtxKey, useLayout } from './controller/layout'
import LayoutDoc from './layout/LayoutDoc.vue'
import LayoutHome from './layout/LayoutHome.vue'
import LayoutPage from './layout/LayoutPage.vue'

interface Props {
  avatar: string
  darkBackground?: string[]
  lightBackground?: string[]
}

const props = defineProps<Props>()

const { layout, isMobile, isDesktop } = useLayout()

provide(LayoutCtxKey, {
  avatar: props.avatar,
  isMobile,
  isDesktop
})

onErrorCaptured((error, instance, info) => {
  console.log('组件出错了', { error, instance, info })
  return false
})
</script>

<template>
  <LayoutHome v-if="layout === 'home'" />
  <LayoutPage v-else-if="layout === 'page'" />
  <LayoutDoc v-else />
  <Background
    :dark-background="props.darkBackground"
    :light-background="props.lightBackground"
  />
</template>
