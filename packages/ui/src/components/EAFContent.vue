<script setup lang='ts'>
import { ref } from 'vue'
import Popover from './core/Popover.vue'

const count = ref(0)
</script>

<template>
  <main class="pt-[--nav-height] flex-1">
    <div class="flex">
      <div class="p-[32px_24px_96px] bg-[--content-bg-color]">
        <div class="px-[32px]">
          <Content class="vp-doc" />
        </div>
      </div>
    </div>
  </main>

  <div class="demo">
    <Popover>
      <template #trigger>
        <button
          class="p-4 rounded-lg bg-cyan-800 cursor-pointer"
          @click="count += 1"
        >
          测试按钮 {{ count }}
        </button>
      </template>

      <div class="bg-rose-600 h-80 w-60"></div>
    </Popover>
  </div>
</template>

<style>
.demo {
  position: fixed;
  width: 400px;
  height: 400px;
  top: 50%;
  left: 50%;
  translate: -50% -50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: lightseagreen;
}
</style>
