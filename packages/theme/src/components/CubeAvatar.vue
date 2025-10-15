<script setup lang='ts'>
defineProps<{
  avatar: string
}>()
</script>

<template>
  <div class="cube-avatar">
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
  --size: 100px;
  --rounded: 10px;

  isolation: isolate;
  perspective: 400px;
  cursor: pointer;
}

.cube {
  --angle-to: -1turn;
  display: grid;
  width: var(--size);
  height: var(--size);
  transform-style: preserve-3d;
  rotate: 0 1 0 var(--m-angle);
  animation: motion-angle 4s linear infinite;
}

.cube-face {
  --m-length: calc(var(--size) / 2);

  grid-area: 1 / 1;
  opacity: 0.6;
  border-radius: var(--rounded);
  backface-visibility: visible;
  background-image: var(--avatar);
  background-size: cover;
  filter: drop-shadow(0 0 var(--rounded) var(--c-brand-1));
  transition: 400ms ease-in;
  transition-property: --m-length, opacity;
}

.cube-face[data-state='front'] {
  transform: translateZ(var(--m-length));
}

.cube-face[data-state='back'] {
  transform: rotateY(180deg) translateZ(var(--m-length));
}

.cube-face[data-state='top'] {
  transform: rotateX(90deg) translateZ(var(--m-length));
}

.cube-face[data-state='bottom'] {
  transform: rotateX(-90deg) translateZ(var(--m-length));
}

.cube-face[data-state='left'] {
  transform: rotateY(-90deg) translateZ(var(--m-length));
}

.cube-face[data-state='right'] {
  transform: rotateY(90deg) translateZ(var(--m-length));
}
</style>
