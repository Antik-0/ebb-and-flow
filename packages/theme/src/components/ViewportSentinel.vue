<script setup lang='ts'>
import { useIntersectionObserver } from '@repo/utils/hooks'
import { computed, onMounted, useTemplateRef } from 'vue'

const props = defineProps<{
  top?: number
  bottom?: number
}>()

const emit = defineEmits<{
  visibleChange: [visible: boolean]
}>()

const style = computed(() => {
  if (props.top) {
    return { top: props.top + 'px' }
  }
  if (props.bottom) {
    return { bottom: props.bottom + 'px' }
  }
  return undefined
})

const sentinel = useTemplateRef('sentinel')

const { observe } = useIntersectionObserver()

onMounted(() => {
  observe(sentinel.value, entry => {
    emit('visibleChange', entry.isIntersecting)
  })
})
</script>

<template>
  <div
    ref="sentinel"
    aria-hidden="true"
    class="h-1 inset-x-0 absolute -z-1"
    data-role="sentinel"
    :style="style"
  ></div>
</template>
