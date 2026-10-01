<script lang="ts" setup>
const props = defineProps<{ src: string }>()

const isLoading = ref(true)
const cover = shallowRef<HTMLImageElement>()

function onLoad() {
  isLoading.value = false
}

onMounted(() => {
  if (cover.value?.complete) {
    isLoading.value = false
  }
})
</script>

<template>
  <picture class="overflow-hidden">
    <div class="p-8 bg-black inset-0 absolute z-10" v-if="isLoading">
      <img alt="loading" class="size-full object-contain" src="/loading.webp">
    </div>
    <img
      alt="cover"
      class="card-cover"
      loading="lazy"
      ref="cover"
      :src="props.src"
      @load="onLoad"
    >
  </picture>
</template>
