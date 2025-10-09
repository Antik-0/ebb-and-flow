<script setup lang='ts'>
import { useData } from 'vitepress'
import { computed } from 'vue'
import TeleportToBody from './TeleportToBody.vue'

const props = defineProps<{
  darkBackground?: string[]
  lightBackground?: string[]
}>()

const { isDark } = useData()
const backgrounds = computed(
  () => (isDark.value ? props.darkBackground : props.lightBackground) ?? []
)
</script>

<template>
  <TeleportToBody id="background">
    <div class="grid inset-0 fixed -z-1">
      <img
        v-for="(src, index) in backgrounds"
        :key="index"
        alt="background"
        class="col-span-full row-span-full size-full block object-cover"
        :src="src"
      />
    </div>
  </TeleportToBody>
</template>
