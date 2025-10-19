<script setup lang="ts">
import { ref } from 'vue'
import { debounce, throttle } from './debounce'

const count = ref(0)
const countDebounce = ref(0)
const countThrottle = ref(0)

const debounceFn = debounce(() => (countDebounce.value += 1), 400)

const throttleFn = throttle(() => (countThrottle.value += 1), 400)

function onClick() {
  count.value += 1
  debounceFn()
  throttleFn()
}
</script>

<template>
  <div class="demo">
    <button type="button" @click="onClick">Click Me</button>
    <div>点击次数: {{ count }}</div>
    <div>防抖执行次数: {{ countDebounce }}</div>
    <div>节流执行次数: {{ countThrottle }}</div>
  </div>
</template>

<style scoped>
.demo {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;

  button {
    padding: 10px 18px;
    border-radius: 8px;
    font-size: 20px;
    color: aliceblue;
    background-color: hsl(263 82% 53%);
    text-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
  }

  div {
    font-size: 18px;
    color: aliceblue;
  }
}
</style>
