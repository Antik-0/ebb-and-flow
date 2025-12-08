<script setup lang="ts">
import { onMounted, reactive, type ShallowRef, shallowRef } from 'vue'

const glassEl = shallowRef<HTMLDivElement>()

function useMove(target: ShallowRef<HTMLElement | undefined | null>) {
  const pressedDelta = reactive({ x: 0, y: 0 })

  let targetElement: HTMLElement
  let containerElement: HTMLElement

  let targetRect: DOMRect
  let containerRect: DOMRect

  function start(e: PointerEvent) {
    targetRect = targetElement.getBoundingClientRect()
    containerRect = containerElement.getBoundingClientRect()

    pressedDelta.x = e.offsetX
    pressedDelta.y = e.offsetY

    targetElement.style.cursor = 'move'
    document.addEventListener('pointermove', move)
  }

  function move(e: PointerEvent) {
    let x = e.clientX - pressedDelta.x - containerRect.left
    x = Math.min(Math.max(0, x), containerRect.width - targetRect.width)

    let y = e.clientY - pressedDelta.y - containerRect.top
    y = Math.min(Math.max(0, y), containerRect.height - targetRect.height)

    targetElement.style.top = y + 'px'
    targetElement.style.left = x + 'px'
  }

  function end() {
    pressedDelta.x = 0
    pressedDelta.y = 0

    targetElement.style.cursor = ''
    document.removeEventListener('pointermove', move)
  }

  onMounted(() => {
    targetElement = target.value!
    containerElement = document.querySelector('.glass-container')!

    targetElement.addEventListener('pointerdown', start)
    document.addEventListener('pointerup', end)
  })
}

useMove(glassEl)
</script>

<template>
  <div class="glass-container">
    <div ref="glassEl" class="glass">
      <div class="glass-text">Drag Me</div>
    </div>
  </div>
</template>

<style scoped>
.glass-container {
  position: relative;
  isolation: isolate;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 12px;
  background: url('/docs/css-glass-bg.png') no-repeat;
  background-size: cover;
}

.glass {
  position: absolute;
  top: 30%;
  left: 40%;
  width: 100px;
  aspect-ratio: 1 / 1.5;
  border-radius: 8px;
  overflow: hidden;
  z-index: 99;
  backdrop-filter: blur(10px);
  box-shadow:
    4px 2px 10px 2px hsl(0 0% 0% / 0.25),
    inset 0 0 10px 4px hsl(0 0% 100% / 0.025),
    inset 0 0 50px 4px hsl(0 0% 100% / 0.025),
    inset -1px -1px hsl(0 0% 100% / 0.025),
    inset 1px 1px hsl(0 0% 100% / 0.025);
}

.glass::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  background: url('../images/css-glass-mask.png') no-repeat;
  background-size: cover;
  opacity: 0.05;
}

.glass-text {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  font-size: 18px;
  color: #b8bfbe;
  background-color: hsl(210 8% 5% /0.75);
}
</style>
