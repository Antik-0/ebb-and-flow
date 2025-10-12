<script setup lang='ts'>
defineProps<{
  avatar: string
}>()
</script>

<template>
  <div class="moon-avatar size-50 cursor-pointer relative isolate">
    <div class="rounded-999 inset-0 absolute z-20 overflow-hidden">
      <img
        alt="site owner avatar"
        class="transition-transform duration-800 ease-in-out"
        :src="avatar"
      />
    </div>
    <div class="moon-bg"></div>
    <div class="moon-mask"></div>
  </div>
</template>

<style>
.moon-avatar:hover img {
  scale: 1.2;
}

.moon-bg {
  position: absolute;
  inset: 0;
  z-index: 10;
  border-radius: 999px;
  background: linear-gradient(45deg, #00dc82, #36e4da, #0047e1);
  filter: blur(80px);
  animation: breathing 6s ease-in-out infinite;
}

.moon-mask {
  position: absolute;
  inset: 0;
  z-index: 30;
  border-radius: 50%;
  box-shadow:
    0 2px 10px 1px hsl(175 30% 40% / 0.8),
    inset 0 0 40px 0px hsl(175 78% 90% / 0.4),
    inset 0 10px 20px 0px hsl(175 78% 80% / 0.8);
}
</style>
