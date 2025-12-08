<script setup lang='ts'>
import { computed } from 'vue'

interface Props {
  /**
   * block 类型
   */
  type?: 'info' | 'warning' | 'danger'
  /**
   * block 标题
   */
  title?: string
}

const props = withDefaults(defineProps<Props>(), { type: 'info' })

const title = computed(() => props.title ?? props.type.toUpperCase())
</script>

<template>
  <div class="custom-block" :data-type="type">
    <p class="font-600">{{ title }}</p>
    <slot></slot>
  </div>
</template>
