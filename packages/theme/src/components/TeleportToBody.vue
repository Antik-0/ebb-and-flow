<script setup lang='ts'>
import { nextTick, onMounted, shallowRef, Teleport } from 'vue'

const props = defineProps<{
  id: string
}>()

const ready = shallowRef(false)

onMounted(async () => {
  if (!document.getElementById(props.id)) {
    const div = document.createElement('div')
    div.setAttribute('id', props.id)
    document.body.append(div)
    await nextTick()
  }
  ready.value = true
})
</script>

<template>
  <ClientOnly>
    <Teleport v-if="ready" :to="`#${id}`" defer>
      <slot></slot>
    </Teleport>
  </ClientOnly>
</template>
