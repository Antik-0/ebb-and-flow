<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import EAFHome from './components/EAFHome.vue'
import { useData, useRoute } from 'vitepress'
import { computed } from 'vue'

defineOptions({ name: 'EAFLayout' })

const { frontmatter, site } = useData()
const route = useRoute()

const isCustom = computed(() => {
  const isRoot = route.path === site.value.base
  const layoutValue = frontmatter.value.layout
  return isRoot && layoutValue === 'EAF-HOME'
})
</script>

<template>
  <EAFHome v-if="isCustom" />
  <DefaultTheme.Layout v-else />
</template>
