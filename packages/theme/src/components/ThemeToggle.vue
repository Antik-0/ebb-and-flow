<script setup lang='ts'>
import { motion } from 'motion-v'
import { useData } from 'vitepress'
import { shallowRef } from 'vue'
import { ThemeDark, ThemeLight } from '#/icons'

// const { isDark } = useData()

const isDark = shallowRef(true)

function toggle() {
  isDark.value = !isDark.value
}
</script>

<template>
  <motion.button
    :aria-checked="isDark"
    aria-label="dark-toggle"
    :class="[
      'text-5 border border-divider bg-[--c-bg-mutate]/20',
      'flex items-center p-0.5 rounded-2xl w-12 cursor-pointer',
    ]"
    :data-state="isDark ? 'dark' : 'light'"
    role="switch"
    :style="{ justifyContent: isDark ? 'flex-end' : 'flex-start' }"
    type="button"
    @click="toggle"
  >
    <motion.span
      :transition="{
        type: 'spring',
        visualDuration: 0.8,
      }"
      layout
    >
      <ThemeDark v-if="isDark" />
      <ThemeLight v-else />
    </motion.span>
  </motion.button>
</template>
