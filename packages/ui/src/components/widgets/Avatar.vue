<script setup lang="ts">

</script>

<template>
  <button aria-label="home-button" class="size-[40px] cursor-pointer" type="button">
    <div class="mask mask-squircle">
      <img
        alt="site owner avatar"
        class="size-full"
        decoding="async"
        src="https://antik-0.github.io/ebb-and-flow/assets/EAF-avatar.CHiAdHFK.png"
      />
    </div>
  </button>
</template>

<style>
.mask {
  mask-size: cover;
  mask-position: center;
  mask-repeat: no-repeat;
}

.mask-squircle {
  mask-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"> <path d="M 0,50 C 0,10 10,0 50,0 C 90,0 100,10 100,50 C 100,90 90,100 50,100 C 10,100 0,90 0,50" /></svg>');
}
</style>
