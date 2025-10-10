<script setup lang='ts'>
import { Rocket } from '#/icons'

function backToTop() {
  document.documentElement.scrollIntoView()
}
</script>

<template>
  <button
    aria-label="back to top"
    class="back-top text-6 flex size-10 cursor-pointer flex-center hover:text-brand-2"
    type="button"
    @click="backToTop"
  >
    <Rocket />
  </button>
</template>

<style>
.back-top {
  transition: color 250ms ease;
}
</style>
