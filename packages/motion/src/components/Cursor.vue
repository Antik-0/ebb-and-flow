<script setup lang="ts">
import { useEventListener } from '@repo/utils/hooks'
import { animate, motion, useMotionTemplate, useMotionValue } from 'motion-v'
import { onMounted, Teleport } from 'vue'

const offsetX = useMotionValue(0)
const offsetY = useMotionValue(0)
const scale = useMotionValue(1)
const rotate = useMotionValue(0)

const transform = useMotionTemplate`
  translate3d(-50%, -50%, 0)
  translateX(${offsetX}px)
  translateY(${offsetY}px)
  scale(${scale})
  rotate(${rotate}deg)
`

function onPointerdown() {
  animate(scale, 0.7, { duration: 0.4 })
}

function onPointerup() {
  animate(scale, 1, { duration: 0.4 })
}

function onMouseMove(event: MouseEvent) {
  const { clientX, clientY } = event
  offsetX.set(clientX)
  offsetY.set(clientY)
}

const { addEventListener } = useEventListener()

onMounted(() => {
  animate(rotate, 360, {
    duration: 2,
    ease: 'linear',
    repeat: Number.POSITIVE_INFINITY,
    repeatType: 'loop'
  })

  addEventListener(window, 'pointermove', onMouseMove)
  addEventListener(window, 'pointerup', onPointerup)
  addEventListener(window, 'pointerdown', onPointerdown)
})
</script>

<template>
  <Teleport to="body">
    <motion.div class="cursor" :style="{transform}">
      <div class="cursor-arrow border-b-none border-r-none left-0 top-0"></div>
      <div class="cursor-arrow border-b-none border-l-none right-0 top-0"></div>
      <div class="cursor-arrow border-r-none border-t-none bottom-0 left-0"></div>
      <div class="cursor-arrow border-l-none border-t-none bottom-0 right-0"></div>
      <div class="rounded-full bg-[--color] h-1.5 w-1.5"></div>
    </motion.div>
  </Teleport>
</template>

<style>
.cursor {
  --color: #fb7185;

  contain: layout;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  width: 40px;
  height: 40px;
  will-change: transform;
  transform-origin: 50% 50% 0;
  pointer-events: none;
}

.cursor-arrow {
  position: absolute;
  width: 10px;
  height: 10px;
  border: 2px solid var(--color);
}

html {
  cursor: none;
}
</style>
