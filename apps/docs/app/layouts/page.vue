<script setup lang='ts'>
import { EbbPage } from 'ebb-theme'
</script>

<template>
  <EbbPage>
    <slot></slot>
    <template #loading>
      <div class="flex h-40vh flex-center">
        <img alt="loading" class="w-30 object-contain" src="/loading.gif" />
      </div>
    </template>
  </EbbPage>
</template>
