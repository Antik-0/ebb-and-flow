<script setup lang='ts'>
import type { ComponentPublicInstance } from 'vue'
import type { Timer } from '#/types'
import type { PopoverProps } from './types.ts'
import { useEventListener } from '@repo/utils/hooks'
import { motion } from 'motion-v'
import { computed, h, onMounted, ref } from 'vue'
import TeleportToBody from '#/components/TeleportToBody.vue'
import { usePopoverMotion, usePopoverState } from './state.ts'

const props = withDefaults(defineProps<PopoverProps>(), {
  trigger: 'click',
  placement: 'bottom',
  width: 150,
  offset: 10,
  closeDelay: 200
})

const slots = defineSlots<{
  default(): any[]
  trigger(): any[]
}>()

const { opacity, translateY, animating, startOpenMotion, startCloseMotion } =
  usePopoverMotion()

const { posX, posY, tRef, vRef, onViewReady, onViewMounted } =
  usePopoverState(props)

onViewReady(startOpenMotion)

const visible = ref(false)

function handleOpen() {
  visible.value = true
  startOpenMotion()
}

async function handleClose() {
  await startCloseMotion()
  visible.value = false
}

let timer: Timer | null = null
const clearTimer = () => timer && clearTimeout(timer)

function createEvents() {
  const onClick = () => {
    if (props.trigger !== 'click') return
    if (animating.value) return
    visible.value ? handleClose() : handleOpen()
  }

  const onMouseEnter = () => {
    if (props.trigger !== 'hover') return
    clearTimer()
    handleOpen()
  }

  const onMouseLeave = () => {
    if (props.trigger !== 'hover') return
    timer = setTimeout(handleClose, props.closeDelay)
  }

  return {
    onClick,
    onPointerenter: onMouseEnter,
    onPointerleave: onMouseLeave
  }
}

const triggerEvents = createEvents()

const TriggerElement = () => {
  const elements = slots.trigger()
  if (elements.length !== 1) {
    return null
  }

  return h(elements[0], {
    ref: value => (tRef.value = value),
    ...triggerEvents
  })
}

const viewDom = computed(() => (vRef.value as ComponentPublicInstance)?.$el)
function onClickOutside(event: PointerEvent) {
  const elements = event.composedPath()
  for (const ele of elements) {
    if (ele === viewDom.value || ele === tRef.value) {
      return
    }
  }
  handleClose()
}

const { addEventListener } = useEventListener()
onMounted(() => {
  addEventListener(window, 'pointerdown', onClickOutside)
})
</script>

<template>
  <TriggerElement />
  <TeleportToBody id="popover">
    <motion.div
      v-if="visible"
      ref="vRef"
      class="popover"
      :style="{
        '--x': `${posX}px`,
        '--y': `${posY}px`,
        y: translateY,
        opacity
      }"
      @pointerenter="clearTimer"
      @pointerleave="triggerEvents.onPointerleave"
      @vue:mounted="onViewMounted"
    >
      <slot></slot>
    </motion.div>
  </TeleportToBody>
</template>

<style>
.popover {
  contain: layout;
  position: absolute;
  top: 0;
  left: 0;
  transform-origin: center;
  pointer-events: auto;
  translate: var(--x) var(--y);
  z-index: 9999;
}
</style>
