<script setup lang="ts">
import { useRouter } from 'vitepress'
import { useLayoutCtx } from '#/controller/layout.ts'
import { HOME_PATH } from '#/shared'

const { avatar } = useLayoutCtx()

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
        :src="avatar"
      />
    </div>
  </button>
</template>
