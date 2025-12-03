<template>
  <div aria-hidden="true" class="flowing-light">
    <div class="flowing-light__line" style="--angle-to: 180deg"></div>
    <div class="flowing-light__line" style="--angle-to: -180deg"></div>
  </div>
</template>

<style>
.flowing-light {
  --color: #67e8f9;

  contain: content;
  position: absolute;
  inset: 0;
  z-index: -1;
  padding: 2px;
  border-radius: 999px;
  mask-image: linear-gradient(#fff), linear-gradient(#fff);
  mask-clip: content-box, border-box;
  mask-composite: exclude;
}

.flowing-light__line {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  aspect-ratio: 1;
  translate: -50% -50%;
  rotate: var(--m-angle);
  background: conic-gradient(var(--color), transparent 40deg, transparent 320deg, var(--color));
  animation: motion-angle 2s cubic-bezier(0.65, 0.05, 0.36, 1) infinite alternate;
}
</style>
