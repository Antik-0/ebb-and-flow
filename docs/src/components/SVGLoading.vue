<script setup lang="ts">
import { ref } from 'vue'

const defaultValue = 10

// 用滑块来模拟移动端下拉
const scrollValue = ref(defaultValue)
const scrollValueMax = 120
const maxValue = 160

// dashValue 至少要比 svg 的圆周大
const dashValue = 100
// 设置默认偏移量为 dashValue 完全隐藏圆弧轨迹
const dashoffset = ref(dashValue - defaultValue)
// 设置最小偏移量，达到不显示完整的圆弧效果
const dashoffsetMin = 40

// 旋转角度
const rotateValue = ref(0)
// 转动 3/4周
const rotateValueMax = 270

// 透明度
const opacitValue = ref(0.4)

const loading = ref(false)

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  scrollValue.value = Number(target.value)
  const value = Math.min(scrollValue.value, scrollValueMax)

  const percentage = value / scrollValueMax
  dashoffset.value = Math.floor(
    Math.max(dashoffsetMin, dashValue - dashValue * percentage)
  )

  rotateValue.value = rotateValueMax * percentage
  // 0.4是最低的透明度
  opacitValue.value = (1 - 0.4) * percentage + 0.4

  // 用最大值来模拟下拉松开情景，触发loading
  loading.value = scrollValue.value === maxValue
}
</script>

<template>
  <div class="canvas">
    <div class="label">
      <input
        :max="maxValue"
        min="0"
        name="range"
        type="range"
        :value="scrollValue"
        @input="onInput"
      />
      <div>
        <label for="range">当前值: {{ scrollValue }}</label>
      </div>
      <div>最大滚动值: {{ scrollValueMax }}</div>
    </div>

    <svg
      class="svg-loading"
      :data-loading="loading"
      fill="none"
      height="1em"
      stroke="currentColor"
      stroke-width="3"
      viewBox="0 0 32 32"
      width="1em"
    >
      <g
        :opacity="opacitValue"
        :transform="`rotate(${rotateValue})`"
        transform-origin="16 16"
      >
        <circle
          cx="16"
          cy="16"
          r="12"
          stroke-dasharray="100"
          :stroke-dashoffset="dashoffset"
          stroke-linecap="round"
          transform="rotate(-45)"
          transform-origin="16 16"
        />
      </g>
    </svg>
  </div>
</template>

<style scoped>
.canvas {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.canvas .label {
  margin-bottom: 20px;
  color: oklch(0.645 0.246 16.439);
  text-align: center;
}

.svg-loading {
  border-radius: 50%;
  padding: 10px;
  font-size: 96px;
  color: hsl(263 100% 70%);
  background-color: #fff;
  box-shadow: 0 0 10px 4px hsl(263 100% 70% / 0.4);
}

.svg-loading[data-loading='true'] {
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0);
  }

  to {
    transform: rotate(1turn);
  }
}
</style>
