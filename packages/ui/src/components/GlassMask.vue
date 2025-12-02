<template>
  <div class="glass-mask">
    <div class="glass-mask__image"></div>
  </div>
</template>

<style>
.glass-mask {
  --size: cover;
  isolation: isolate;
  backdrop-filter: blur(10px);
  box-shadow:
    0 2px 16px 1px hsl(0 0% 60% / 0.1),
    inset 0 0 10px 4px hsl(0 0% 80% / 0.1),
    inset 0 0 50px 4px hsl(0 0% 60% / 0.1),
    inset -1px -1px 4px hsl(0 0% 100% / 0.1);
}

.glass-mask__image {
  position: absolute;
  inset: 0;
  z-index: -1;
  opacity: 0.1;
  background-image: url('/glass-mask.png');
  background-size: var(--size);
  background-repeat: repeat;
}
</style>
