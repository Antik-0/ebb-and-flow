# CSS Effect 收集

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
