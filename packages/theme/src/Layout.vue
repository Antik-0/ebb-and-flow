<script setup lang='ts'>
import { computed, provide, shallowRef } from 'vue'
import Background from './components/Background.vue'
import ViewportSentinel from './components/ViewportSentinel.vue'
import { LayoutCtxKey, useLayout } from './controller/layout'
import LayoutDoc from './layout/LayoutDoc.vue'
import LayoutHome from './layout/LayoutHome.vue'
import LayoutPage from './layout/LayoutPage.vue'

const props = defineProps<Props>()

interface Props {
  avatar: string
  homeBackground?: string[]
  darkBackground?: string[]
  lightBackground?: string[]
}

const { layout, isMobile, isDesktop } = useLayout()

const showToolPanel = shallowRef(false)

function onSentinelChange(visible: boolean) {
  showToolPanel.value = !visible
}

provide(LayoutCtxKey, {
  avatar: props.avatar,
  isMobile,
  isDesktop,
  showToolPanel: computed(() => showToolPanel.value)
})
</script>

<template>
  <LayoutHome v-if="layout === 'home'" />
  <LayoutPage v-else-if="layout === 'page'" />
  <LayoutDoc v-else />
  <Background
    :dark-background="darkBackground"
    :home-background="homeBackground"
    :is-home="layout === 'home'"
    :light-background="lightBackground"
  />
  <ViewportSentinel :top="200" @visible-change="onSentinelChange" />
</template>
