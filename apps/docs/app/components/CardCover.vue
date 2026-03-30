<script setup lang='ts'>
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
  <picture class="relative overflow-hidden">
    <div v-if="isLoading" class="p-8 bg-black inset-0 absolute z-10">
      <img alt="loading" class="size-full object-contain" src="/loading.webp" />
    </div>
    <img
      ref="cover"
      alt="cover"
      class="card-cover"
      loading="lazy"
      :src="props.src"
      @load="onLoad"
    />
  </picture>
</template>
