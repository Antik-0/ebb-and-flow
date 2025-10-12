<script setup lang='ts'>
import { computed, shallowRef } from 'vue'
import Background from './components/Background.vue'
import ViewportSentinel from './components/ViewportSentinel.vue'
import { provideLayoutCtx, useLayout } from './controller/layout'
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

const { layout, isMobile, isDesktop, isLargeScreen } = useLayout()

const showToolPanel = shallowRef(false)

function onSentinelChange(visible: boolean) {
  showToolPanel.value = !visible
}

provideLayoutCtx({
  avatar: props.avatar,
  isMobile,
  isDesktop,
  isLargeScreen,
  showToolPanel: computed(() => showToolPanel.value)
})
</script>

<template>
  <LayoutHome v-if="layout === 'home'" :avatar="avatar" />
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
