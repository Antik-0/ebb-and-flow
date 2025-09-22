<script setup lang='ts'>
import { inject, Teleport } from 'vue'
import { TeleportsContext, TeleportsId } from '#/controller/teleports.ts'

const { ready } = inject(TeleportsContext)!
</script>

<template>
  <ClientOnly>
    <Teleport v-if="ready" :to="`#${TeleportsId}`" defer>
      <slot></slot>
    </Teleport>
  </ClientOnly>
</template>
