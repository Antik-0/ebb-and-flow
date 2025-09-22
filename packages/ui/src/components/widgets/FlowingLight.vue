<template>
  <div class="flowing-light">
    <div class="flowing-light__color" style="--flowing-light-angle: 180deg"></div>
    <div class="flowing-light__color" style="--flowing-light-angle: -180deg"></div>
  </div>
</template>

<style>
.flowing-light {
  --width: 2px;
  --color: #67e8f9;

  contain: content;
  position: absolute;
  inset: 0;
  z-index: -1;
  padding: var(--width);
  border-radius: var(--rounded);
  mask-image: linear-gradient(#fff), linear-gradient(#fff);
  mask-clip: content-box, border-box;
  mask-composite: exclude;
}

.flowing-light__color {
  position: absolute;
  top: 50%;
  left: 50%;
  translate: -50% -50%;
  width: 100%;
  aspect-ratio: 1;
  background: conic-gradient(var(--color), transparent 40deg, transparent 320deg, var(--color));
  animation: flowing-light 2s cubic-bezier(0.65, 0.05, 0.36, 1) infinite alternate;
}

@keyframes flowing-light {
  to {
    rotate: var(--flowing-light-angle);
  }
}

@property --flowing-light-angle {
  syntax: '<angle>';
  inherits: false;
}
</style>
