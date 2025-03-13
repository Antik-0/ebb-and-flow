# CSS Effect

::: info
本文记录一些有趣的 CSS 效果。
:::

## SVG spinner

这个 CSS 特效出自 [Making SVG Loading Spinners: An Interactive Guide](https://www.fffuel.co/svg-spinner/)

<div class="demo ">
  <svg width="200" height="200" viewBox="-200 -200 400 400">
    <circle
      class="svg-spinner"
      cx="0"
      cy="0"
      r="100"
      fill="none"
      stroke="#59AFFF"
      stroke-width="24"
      stroke-linecap="round"
      stroke-dasharray="1 314"
      stroke-dashoffset="0"
    />
  </svg>
</div>

::: code-group

```html
<div class="demo">
  <svg width="200" height="200" viewBox="-200 -200 400 400">
    <circle
      class="svg-spinner"
      cx="0"
      cy="0"
      r="100"
      fill="none"
      stroke="#59AFFF"
      stroke-width="24"
      stroke-linecap="round"
      stroke-dasharray="1 314"
      stroke-dashoffset="0"
    />
  </svg>
</div>
```

```css
.svg-spinner {
  animation: spin2 1s linear infinite, spin1 2s ease-in-out infinite alternate;
}

@keyframes spin1 {
  0% {
    stroke-dasharray: 1 314;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 310 2;
    stroke-dashoffset: -155;
  }

  100% {
    stroke-dasharray: 1 314;
    stroke-dashoffset: 0;
  }
}

@keyframes spin2 {
  0% {
    transform: rotate(360deg);
  }
}
```

:::

## 炫彩边框

这个 CSS 特效出自 [turbo 官网](https://turbo.build/)。

<div class="demo">
  <div class="border-container">
    <div class="colorful-border"></div>
  </div>
</div>

::: code-group

```html
<div class="demo">
  <div class="border-container">
    <div class="colorful-border"></div>
  </div>
</div>
```

```css
.border-container {
  position: relative;
  width: 200px;
  height: 200px;
  border-radius: 10px;
  overflow: hidden;
  z-index: 0;
}

.colorful-border {
  position: absolute;
  inset: 0;
  padding: 10px;
  mask: linear-gradient(0, #fff, #fff) content-box, linear-gradient(
      0,
      #fff,
      #fff
    );
  mask-composite: exclude;
}

.colorful-border::before {
  --size: 200%;
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: var(--size);
  padding-bottom: var(--size);
  background: conic-gradient(
    #e92a67 0deg,
    #a853ba 135deg,
    #2a8af6 215deg,
    hsla(0, 0%, 100%, 0.1) 360deg
  );
  animation: ring-flow 2s linear infinite;
}

@keyframes ring-flow {
  0% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}
```

:::

## 网格动画

这个 CSS 特效出自 [turbo 官网](https://turbo.build/)。

<div class="demo">
  <div class="grid-view">
    <div class="grid-stage">
      <div class="grid-flat"></div>
    </div>
  </div>
</div>

::: code-group

```html
<div class="grid-view">
  <div class="grid-stage">
    <div class="grid-flat"></div>
  </div>
</div>
```

```css
.grid-view {
  position: relative;
  width: 600px;
  height: 600px;
  perspective: 1000px;
}

.grid-stage {
  position: absolute;
  inset: 0;
  overflow: hidden;
  transform: rotateX(60deg);
}

.grid-flat {
  position: absolute;
  inset: -100% 0;
  transform: translateY(0);
  background: linear-gradient(
    to right,
    #b9ddff 45%,
    transparent 50%,
    #f8cde8 55%
  );
  /* prettier-ignore */
  mask-image:
    linear-gradient(90deg, #000 2px, transparent 0),
    linear-gradient(180deg, #0002px, transparent 0);
  mask-size: 60px 60px;
  mask-repeat: repeat;
  mask-position: 50% 0;
  animation: grid-flow 10s linear infinite;
}

@keyframes grid-flow {
  0% {
    transform: translateY(0);
  }

  100% {
    transform: translateY(50%);
  }
}
```

:::

## playon

<div class="demo">
  <svg
    viewBox="0 0 32 32"
    width="1em"
    height="1em"
    style="font-size: 128px; color: oklch(0.645 0.246 16.439)"
  >
    <g stroke="currentColor" stroke-width="6" stroke-linecap="round">
      <line x1="7" y1="10" x2="7" y2="26">
        <animate
          attributeName="y1"
          values="10;20;10"
          dur="0.8s"
          repeatCount="indefinite"
        ></animate>
      </line>
      <line x1="16" y1="6" x2="16" y2="26">
        <animate
          attributeName="y1"
          values="18;6;18"
          dur="0.8s"
          repeatCount="indefinite"
        ></animate>
      </line>
      <line x1="25" y1="8" x2="25" y2="26">
        <animate
          attributeName="y1"
          values="8;20;8"
          dur="0.8s"
          repeatCount="indefinite"
        ></animate>
      </line>
    </g>
  </svg>
</div>

```html
<svg
  viewBox="0 0 32 32"
  width="1em"
  height="1em"
  style="font-size: 128px; color: oklch(0.645 0.246 16.439)"
>
  <g stroke="currentColor" stroke-width="6" stroke-linecap="round">
    <line x1="7" y1="10" x2="7" y2="26">
      <animate
        attributeName="y1"
        values="10;20;10"
        dur="0.8s"
        repeatCount="indefinite"
      ></animate>
    </line>
    <line x1="16" y1="6" x2="16" y2="26">
      <animate
        attributeName="y1"
        values="18;6;18"
        dur="0.8s"
        repeatCount="indefinite"
      ></animate>
    </line>
    <line x1="25" y1="8" x2="25" y2="26">
      <animate
        attributeName="y1"
        values="8;20;8"
        dur="0.8s"
        repeatCount="indefinite"
      ></animate>
    </line>
  </g>
</svg>
```

## 下拉 Loading

<script setup>
import SVGLoading from './components/SVGLoading.vue'
</script>

<div class="demo">
  <SVGLoading />
</div>

::: code-group

```html
<div class="canvas">
  <div class="label">
    <input
      name="range"
      type="range"
      min="0"
      :max="maxValue"
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
    viewBox="0 0 32 32"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    stroke-width="3"
  >
    <g
      :opacity="opacitValue"
      :transform="`rotate(${rotateValue})`"
      transform-origin="16 16"
    >
      <circle
        r="12"
        cx="16"
        cy="16"
        stroke-linecap="round"
        stroke-dasharray="100"
        :stroke-dashoffset="dashoffset"
        transform="rotate(-45)"
        transform-origin="16 16"
      ></circle>
    </g>
  </svg>
</div>
```

```css
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
```

```ts
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
```

:::

<style>
.demo {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 240px;
}
</style>

<!-- svg spiner -->
<style>
.svg-spinner {
  animation:
    spin2 1s linear infinite,
    spin1 2s ease-in-out infinite alternate;
}

@keyframes spin1 {
  0% {
    stroke-dasharray: 1 314;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 310 2;
    stroke-dashoffset: -155;
  }

  100% {
    stroke-dasharray: 1 314;
    stroke-dashoffset: 0;
  }
}

@keyframes spin2 {
  0% {
    transform: rotate(360deg);
  }
}
</style>

<!-- 炫彩边框 -->
<style>
.border-container {
  position: relative;
  width: 200px;
  height: 200px;
  border-radius: 10px;
  overflow: hidden;
  z-index: 0;
}

.colorful-border {
  position: absolute;
  inset: 0;
  padding: 10px;
  mask:
    linear-gradient(0, #fff, #fff) content-box,
    linear-gradient(0, #fff, #fff);
  mask-composite: exclude;
}

.colorful-border::before {
  --size: 200%;
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: var(--size);
  padding-bottom: var(--size);
  background: conic-gradient(
    #e92a67 0deg,
    #a853ba 135deg,
    #2a8af6 215deg,
    hsla(0, 0%, 100%, 0.1) 360deg
  );
  animation: ring-flow 2s linear infinite;
}

@keyframes ring-flow {
  0% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}
</style>

<!-- 网格动画 -->
<style>
.grid-view {
  position: relative;
  width: 600px;
  height: 600px;
  perspective: 1000px;
}

.grid-stage {
  position: absolute;
  inset: 0;
  overflow: hidden;
  transform: rotateX(60deg);
}

.grid-flat {
  position: absolute;
  inset: -100% 0;
  transform: translateY(0);
  background: linear-gradient(
    to right,
    #b9ddff 45%,
    transparent 50%,
    #f8cde8 55%
  );
  mask-image: linear-gradient(90deg, #000 2px, transparent 0),
    linear-gradient(180deg, #000 2px, transparent 0);
  mask-size: 60px 60px;
  mask-repeat: repeat;
  mask-position: 50% 0;
  animation: grid-flow 10s linear infinite;
}

@keyframes grid-flow {
  0% {
    transform: translateY(0);
  }

  100% {
    transform: translateY(50%);
  }
}
</style>
