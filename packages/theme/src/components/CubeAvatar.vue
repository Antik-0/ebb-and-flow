<script setup lang='ts'>
import { useLayoutCtx } from '#/controller/layout.ts'

withDefaults(
  defineProps<{
    size?: 'large' | 'small'
  }>(),
  { size: 'small' }
)

const { avatar } = useLayoutCtx()
</script>

<template>
  <div class="cube-avatar" :data-size="size">
    <div class="cube" :style="{ '--avatar': `url(${avatar})` }">
      <div class="cube-face" data-state="front"></div>
      <div class="cube-face" data-state="back"></div>
      <div class="cube-face" data-state="top"></div>
      <div class="cube-face" data-state="bottom"></div>
      <div class="cube-face" data-state="left"></div>
      <div class="cube-face" data-state="right"></div>
    </div>
  </div>
</template>

<style>
.cube-avatar {
  isolation: isolate;
  perspective: 400px;
  cursor: pointer;
}

.cube-avatar[data-size='small'] {
  --size: 40px;
  --z: 20px;
  --r: 4px;
}

.cube-avatar[data-size='large'] {
  --size: 100px;
  --z: 50px;
  --r: 10px;
}

.cube {
  display: grid;
  width: var(--size);
  height: var(--size);
  transform-style: preserve-3d;
  animation: cube-rotate 4s linear infinite;
}

.cube-face {
  grid-area: 1 / 1;
  opacity: 0.6;
  border-radius: var(--r);
  backface-visibility: visible;
  background-image: var(--avatar);
  background-size: cover;
  filter: drop-shadow(0 0 var(--r) var(--c-brand-1));
}

.cube-face[data-state='front'] {
  transform: translateZ(var(--z));
}

.cube-face[data-state='back'] {
  transform: rotateY(180deg) translateZ(var(--z));
}

.cube-face[data-state='top'] {
  transform: rotateX(90deg) translateZ(var(--z));
}

.cube-face[data-state='bottom'] {
  transform: rotateX(-90deg) translateZ(var(--z));
}

.cube-face[data-state='left'] {
  transform: rotateY(-90deg) translateZ(var(--z));
}

.cube-face[data-state='right'] {
  transform: rotateY(90deg) translateZ(var(--z));
}
</style>
