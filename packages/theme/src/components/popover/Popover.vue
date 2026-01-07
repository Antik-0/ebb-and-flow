<script setup lang='ts'>
import type { ComponentPublicInstance, StyleValue } from 'vue'
import type { Timer } from '#/types'
import type { PopoverProps } from './index.ts'
import { Teleport, computed, h, onMounted, watch } from 'vue'
import { useEventListener } from '#/hooks'
import { usePopoverState } from './state.ts'

const props = withDefaults(defineProps<PopoverProps>(), {
  trigger: 'click',
  placement: 'bottom',
  maskClosable: true,
  keepAlive: false,
  fixed: false,
  width: 150,
  offset: 10,
  delayOpenFrame: 1,
  delayClose: 200
})

const slots = defineSlots<{
  default(): any[]
  trigger(): any[]
}>()

const { isActive, visible, isHidden, tRef, vRef, translate, open, close } =
  usePopoverState(props)

const hiddenStyle = computed(() => {
  if (!isHidden.value) return undefined
  return { opacity: 0, visibility: 'hidden' } as StyleValue
})

const model = defineModel<boolean>('open')

const handleOpen = () => {
  model.value = true
  open()
}

const handleClose = () => {
  model.value = false
  close()
}

watch(
  () => model.value,
  open => {
    if (open) {
      handleOpen()
    } else {
      handleClose()
    }
  }
)

let timer: Timer | null = null
const clearTimer = () => timer && clearTimeout(timer)

function createEvents(): {
  onClick?: () => void
  onPointerenter?: () => void
  onPointerleave?: () => void
} {
  const onClick = () => {
    visible.value ? handleClose() : handleOpen()
  }

  const onMouseEnter = () => {
    clearTimer()
    handleOpen()
  }

  const onMouseLeave = () => {
    timer = setTimeout(handleClose, props.delayClose)
  }

  if (props.trigger === 'click') {
    return { onClick }
  }
  return {
    onPointerenter: onMouseEnter,
    onPointerleave: onMouseLeave
  }
}

const events = createEvents()

const TriggerElement = () => {
  const elements = slots.trigger()
  if (elements.length !== 1) {
    return null
  }

  return h(elements[0], {
    ref: value => (tRef.value = value),
    ...events
  })
}

const triggerDOM = computed(() => {
  const value = tRef.value
  return (value as ComponentPublicInstance)?.$el ?? value
})

function onClickOutside(event: PointerEvent) {
  const elements = event.composedPath()
  const tDOM = triggerDOM.value
  const vDOM = vRef.value
  for (const ele of elements) {
    if (ele === tDOM || ele === vDOM) {
      return
    }
  }
  handleClose()
}

const { addEventListener } = useEventListener()
onMounted(() => {
  if (props.maskClosable) {
    addEventListener(window, 'pointerdown', onClickOutside)
  }
})
</script>

<template>
  <TriggerElement />
  <Teleport to="#teleports">
    <div
      v-if="isActive"
      v-show="visible"
      ref="vRef"
      class="popover"
      :data-show="visible"
      :style="[
        {
          '--x': `${translate.x}px`,
          '--y': `${translate.y}px`,
          position: fixed ? 'fixed' : 'absolute',
        },
        hiddenStyle
      ]"
      @pointerenter="clearTimer"
      @pointerleave="events.onPointerleave"
    >
      <slot></slot>
    </div>
  </Teleport>
</template>

<style>
.popover {
  contain: layout;
  top: 0;
  left: 0;
  pointer-events: auto;
  translate: var(--x) var(--y);
  z-index: 1000;
}
</style>
