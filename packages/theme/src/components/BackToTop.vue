<script setup lang='ts'>
import { useAnimation } from '@repo/utils/hooks'
import { Rocket } from '#/icons'

const { animation, scope } = useAnimation(
  [{ translate: '0 10px' }, { translate: '0 -100px' }],
  {
    effect: {
      duration: 1000,
      easing: 'cubic-bezier(0.6, -0.28, 0.74, 0.05)'
    }
  }
)

function backToTop() {
  animation.value?.play()
  document.documentElement.scrollIntoView()
}
</script>

<template>
  <button
    ref="scope"
    aria-label="back to top"
    class="text-6 text-[--c-text-2] flex size-10 cursor-pointer flex-center"
    title="回到顶部"
    type="button"
    @click="backToTop"
  >
    <Rocket />
  </button>
</template>
