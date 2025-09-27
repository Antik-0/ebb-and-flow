<script setup lang="ts">
import { useRouter } from 'vitepress'
import { HOME_PATH } from '#/shared'

const router = useRouter()

function goHome() {
  router.go(HOME_PATH)
}
</script>

<template>
  <button
    aria-label="home-button"
    class="cursor-pointer drop-shadow-sm drop-shadow-color-cyan-300"
    type="button"
    @click="goHome"
  >
    <div class="mask mask-squircle">
      <img
        alt="site owner avatar"
        class="size-[44px]"
        decoding="async"
        src="https://antik-0.github.io/ebb-and-flow/assets/EAF-avatar.CHiAdHFK.png"
      />
    </div>
  </button>
</template>
