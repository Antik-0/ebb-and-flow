<script setup lang='ts'>
import type { ComponentPublicInstance } from 'vue'
import type { Placement } from '#/controller/popover.ts'
import { onClickOutside } from '@repo/utils/hooks'
import { animate, motion, useMotionValue } from 'motion-v'
import { computed, h, ref, watch } from 'vue'
import { usePopoverState } from '#/controller/popover.ts'
import Teleports from './Teleports.vue'

interface Props {
  /**
   * 触发方式
   * @default 'hover'
   */
  trigger?: 'hover' | 'click'
  /**
   * 出现位置
   * @default 'bottom'
   */
  placement?: Placement
  /**
   * 宽度
   * @default 150
   */
  width?: number
  /**
   * 偏移量
   */
  offset?: number
}

const props = withDefaults(defineProps<Props>(), {
  trigger: 'click',
  placement: 'bottom',
  width: 150,
  offset: 10
})

const slots = defineSlots<{
  default(): any[]
  trigger(): any[]
}>()

const visible = ref(false)
const translateY = useMotionValue(20)

function handleOpen() {
  visible.value = true
  animate(translateY, 0, { type: 'spring' })
}

function handleClose() {
  animate(translateY, 20, {
    type: 'spring',
    duration: 0.6,
    onComplete() {
      visible.value = false
    }
  })
}

function toggle() {
  visible.value ? handleClose() : handleOpen()
}

const onClick = () => {
  if (props.trigger === 'hover') return
  toggle()
}

const onMouseenter = () => {
  if (props.trigger === 'click') return
  handleOpen()
}

const onMouseleave = () => {
  if (props.trigger === 'click') return
  handleClose()
}

const triggerEvents = {
  onClick,
  onPointerenter: onMouseenter,
  onPointerleave: onMouseleave
}

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

const { posX, posY, tRef, vRef, ready, onViewMounted, onViewUnmounted } =
  usePopoverState(props.placement, props.offset)

const viewDom = computed(() => (vRef.value as ComponentPublicInstance)?.$el)
onClickOutside(viewDom, () => {
  // visible.value = false
})
</script>

<template>
  <TriggerElement />
  <Teleports>
    <motion.div
      v-if="visible"
      ref="vRef"
      class="popover"
      :style="{
        '--x': `${posX}px`,
        '--y': `${posY}px`,
        y: translateY
      }"
      @vue:before-unmount="onViewUnmounted"
      @vue:mounted="onViewMounted"
    >
      <slot></slot>
    </motion.div>
  </Teleports>
</template>

<style>
.popover {
  position: absolute;
  top: 0;
  left: 0;
  transform-origin: center;
  pointer-events: auto;
  translate: var(--x) var(--y);
  z-index: 9999;
}
</style>
