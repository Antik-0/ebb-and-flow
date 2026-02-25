<script setup lang="ts">
defineProps<{ avatar: string }>()

const emit = defineEmits<{ click: [] }>()
</script>

<template>
  <button
    aria-label="avatar"
    class="cursor-pointer drop-shadow-sm drop-shadow-color-cyan-300"
    type="button"
    @click="() => emit('click')"
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
