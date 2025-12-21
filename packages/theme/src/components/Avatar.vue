<script setup lang="ts">
defineProps<{ avatar: string }>()
</script>

<template>
  <button
    aria-label="avatar"
    class="cursor-pointer drop-shadow-sm drop-shadow-color-cyan-300"
    type="button"
  >
    <div class="mask mask-squircle">
      <img
        alt="site owner avatar"
        class="size-[44px]"
        decoding="async"
        :src="avatar"
      />
    </div>
  </button>
</template>
